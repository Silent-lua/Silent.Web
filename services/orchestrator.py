from typing import Dict, Any, List
import hashlib

from services.providers.openai_provider import OpenAIProvider
from services.providers.gemini_provider import GeminiProvider
from services.providers.groq_provider import GroqProvider

from services.router import IntelligentRouter
from services.parallel_executor import ParallelExecutor
from services.judge import Judge

from utils.logger import system_logger


class AIOrchestrator:

    def __init__(self, config: dict):

        self.providers = {}

        # OpenAI
        if config.get("OPENAI_API_KEY"):
            self.providers["openai"] = OpenAIProvider(
                config.get("OPENAI_API_KEY")
            )

        # Gemini
        if config.get("GEMINI_API_KEY"):
            self.providers["gemini"] = GeminiProvider(
                config.get("GEMINI_API_KEY")
            )

        # Groq
        if config.get("GROQ_API_KEY"):
            self.providers["groq"] = GroqProvider(
                config.get("GROQ_API_KEY")
            )

        self.router = IntelligentRouter()
        self.executor = ParallelExecutor(self.providers)

        # Selección automática del Judge
        if self.providers.get("gemini"):
            self.judge = Judge(self.providers["gemini"])
        elif self.providers.get("groq"):
            self.judge = Judge(self.providers["groq"])
        elif self.providers.get("openai"):
            self.judge = Judge(self.providers["openai"])
        else:
            self.judge = None

        self.cache = {}

    def _generate_cache_key(self, prompt: str, mode: str) -> str:
        return hashlib.md5(
            f"{prompt}_{mode}".encode("utf-8")
        ).hexdigest()

    def execute_prompt(
        self,
        user_prompt: str,
        mode: str,
        history: List[Dict]
    ) -> Dict[str, Any]:

        system_logger.info(
            f"Orchestrating prompt via mode: {mode}"
        )

        cache_key = self._generate_cache_key(
            user_prompt,
            mode
        )

        if cache_key in self.cache:

            cached = self.cache[cache_key].copy()

            cached["latency_ms"] = 0.0
            cached["cost_usd"] = 0.0

            return cached

        messages = history + [
            {
                "role": "user",
                "content": user_prompt
            }
        ]

        if mode == "auto":

            route = self.router.determine_route(
                user_prompt
            )

            if route["requires_triple"]:

                response = self._execute_triple_consensus(
                    user_prompt,
                    messages,
                    [m[0] for m in route["ranked_models"]]
                )

            else:

                response = self.executor.execute_with_fallback(
                    route["ranked_models"],
                    messages
                )

        elif mode == "triple":

            available = list(self.providers.keys())

            response = self._execute_triple_consensus(
                user_prompt,
                messages,
                available
            )

        else:

            response = self.executor.execute_with_fallback(
                [(mode, 1.0)],
                messages
            )

        if response.get("success"):
            self.cache[cache_key] = response.copy()

        return response

    def _execute_triple_consensus(
        self,
        prompt: str,
        messages: List[Dict],
        target_models: List[str]
    ) -> Dict[str, Any]:

        if self.judge is None:
            return {
                "success": False,
                "error": "No Judge provider configured."
            }

        results = self.executor.execute_parallel(
            target_models,
            messages
        )

        if not results:
            return {
                "success": False,
                "error": "All providers failed."
            }

        if len(results) == 1:

            only = next(iter(results.values()))

            only["decision_reason"] = (
                "Single provider available."
            )

            return only

        final = self.judge.evaluate_responses(
            prompt,
            results
        )

        final["tokens"] = sum(
            r["tokens"] for r in results.values()
        )

        final["cost_usd"] = sum(
            r["cost_usd"] for r in results.values()
        ) + final.get("judge_cost", 0)

        return final