from abc import ABC, abstractmethod
from typing import List, Dict, Any, Generator, Optional
import time

class BaseProvider(ABC):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.provider_name = "Base"

    @abstractmethod
    def generate(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """Ejecuta una petición síncrona y devuelve la telemetría estandarizada."""
        pass

    @abstractmethod
    def generate_stream(self, messages: List[Dict[str, str]], **kwargs) -> Generator:
        """Generador para Server-Sent Events (Streaming)."""
        pass

    def _format_telemetry(self, content: str, tokens: int, start_time: float, cost: float) -> Dict[str, Any]:
        """Estandariza la respuesta de todos los proveedores."""
        return {
            "success": True,
            "provider": self.provider_name,
            "content": content,
            "tokens": tokens,
            "latency_ms": (time.time() - start_time) * 1000,
            "cost_usd": cost,
            "error": None
        }

    def _format_error(self, error_msg: str) -> Dict[str, Any]:
        return {
            "success": False,
            "provider": self.provider_name,
            "content": "",
            "tokens": 0,
            "latency_ms": 0.0,
            "cost_usd": 0.0,
            "error": error_msg
        }
