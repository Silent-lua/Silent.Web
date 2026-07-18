import time
from typing import List, Dict, Any, Generator

from groq import Groq

from services.providers.base import BaseProvider
from utils.logger import system_logger


class GroqProvider(BaseProvider):
    """
    Proveedor oficial para Groq.
    Compatible con SilentAI Enterprise.
    """

    def __init__(
        self,
        api_key: str,
        model: str = "llama-3.3-70b-versatile"
    ):
        super().__init__(api_key)

        self.provider_name = "groq"
        self.model = model

        self.client = Groq(api_key=api_key)

        # Costos aproximados (ajusta cuando Groq publique cambios)
        self.pricing = {
            "input": 0.00059 / 1000,
            "output": 0.00079 / 1000
        }

    def generate(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> Dict[str, Any]:

        start_time = time.time()

        try:

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=kwargs.get("temperature", 0.7),
                max_tokens=kwargs.get("max_tokens", 4096)
            )

            usage = response.usage

            prompt_tokens = getattr(usage, "prompt_tokens", 0)
            completion_tokens = getattr(usage, "completion_tokens", 0)
            total_tokens = getattr(usage, "total_tokens", 0)

            cost = (
                prompt_tokens * self.pricing["input"] +
                completion_tokens * self.pricing["output"]
            )

            return self._format_telemetry(
                response.choices[0].message.content,
                total_tokens,
                start_time,
                cost
            )

        except Exception as e:

            system_logger.error(f"Groq Provider Error: {e}")

            return self._format_error(str(e))

    def generate_stream(
        self,
        messages: List[Dict[str, str]],
        **kwargs
    ) -> Generator:

        try:

            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True,
                temperature=kwargs.get("temperature", 0.7),
                max_tokens=kwargs.get("max_tokens", 4096)
            )

            for chunk in stream:

                if (
                    chunk.choices
                    and
                    chunk.choices[0].delta.content is not None
                ):
                    yield chunk.choices[0].delta.content

        except Exception as e:

            system_logger.error(f"Groq Stream Error: {e}")

            return