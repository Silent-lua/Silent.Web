import time
from typing import List, Dict, Any, Generator

import google.generativeai as genai

from services.providers.base import BaseProvider
from utils.logger import system_logger


class GeminiProvider(BaseProvider):
    """
    Proveedor para Google Gemini.
    """

    def __init__(self, api_key: str, model: str = "gemini-2.5-pro"):
        super().__init__(api_key)
        self.provider_name = "gemini"

        genai.configure(api_key=api_key)
        self.client = genai.GenerativeModel(model)
        self.model = model

        self.pricing = {
            "input": 0.003 / 1000,
            "output": 0.010 / 1000
        }

    def generate(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        start_time = time.time()

        try:
            prompt = "\n".join(
                f"{m['role']}: {m['content']}" for m in messages
            )

            response = self.client.generate_content(
                prompt,
                generation_config={
                    "temperature": kwargs.get("temperature", 0.7)
                }
            )

            content = response.text if hasattr(response, "text") else ""

            usage = getattr(response, "usage_metadata", None)
            input_tokens = getattr(usage, "prompt_token_count", 0) if usage else 0
            output_tokens = getattr(usage, "candidates_token_count", 0) if usage else 0
            total_tokens = input_tokens + output_tokens

            cost = (
                input_tokens * self.pricing["input"] +
                output_tokens * self.pricing["output"]
            )

            return self._format_telemetry(
                content,
                total_tokens,
                start_time,
                cost
            )

        except Exception as e:
            system_logger.error(f"Gemini Provider Error: {e}")
            return self._format_error(str(e))

    def generate_stream(self, messages: List[Dict[str, str]], **kwargs) -> Generator:
        try:
            prompt = "\n".join(
                f"{m['role']}: {m['content']}" for m in messages
            )

            stream = self.client.generate_content(
                prompt,
                stream=True,
                generation_config={
                    "temperature": kwargs.get("temperature", 0.7)
                }
            )

            for chunk in stream:
                text = getattr(chunk, "text", None)
                if text:
                    yield text

        except Exception as e:
            system_logger.error(f"Gemini Stream Error: {e}")
            return
