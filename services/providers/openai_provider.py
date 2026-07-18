import time
from typing import List, Dict, Any, Generator
from openai import OpenAI
from services.providers.base import BaseProvider
from utils.logger import system_logger

class OpenAIProvider(BaseProvider):
    def __init__(self, api_key: str, model: str = "gpt-4o"):
        super().__init__(api_key)
        self.client = OpenAI(api_key=api_key)
        self.model = model
        self.provider_name = "openai"
        # Precios aproximados por token (Input / Output)
        self.pricing = {"input": 0.005 / 1000, "output": 0.015 / 1000}

    def generate(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        start_time = time.time()
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=kwargs.get("temperature", 0.7)
            )

            content = response.choices[0].message.content
            input_tokens = response.usage.prompt_tokens
            output_tokens = response.usage.completion_tokens
            total_tokens = response.usage.total_tokens

            cost = (input_tokens * self.pricing["input"]) + (output_tokens * self.pricing["output"])

            return self._format_telemetry(content, total_tokens, start_time, cost)

        except Exception as e:
            system_logger.error(f"OpenAI Provider Error: {str(e)}")
            return self._format_error(str(e))

    def generate_stream(self, messages: List[Dict[str, str]], **kwargs) -> Generator:
        stream = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            stream=True
        )
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content
