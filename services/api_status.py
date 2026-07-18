import time
from typing import Dict, Any


class APIStatus:
    """
    Verifica el estado de los proveedores de IA.
    """

    def __init__(self, providers: Dict[str, Any]):
        self.providers = providers

    def check_all(self) -> Dict[str, Dict]:
        results = {}

        for name, provider in self.providers.items():
            start = time.time()

            try:
                # Prueba mínima
                response = provider.generate(
                    [{"role": "user", "content": "ping"}],
                    temperature=0
                )

                latency = round((time.time() - start) * 1000, 2)

                results[name] = {
                    "online": response.get("success", False),
                    "latency_ms": latency,
                    "model": getattr(provider, "model", "unknown"),
                    "error": response.get("error")
                }

            except Exception as e:
                results[name] = {
                    "online": False,
                    "latency_ms": None,
                    "model": getattr(provider, "model", "unknown"),
                    "error": str(e)
                }

        return results

    def summary(self) -> Dict[str, Any]:
        data = self.check_all()

        return {
            "status": "healthy" if all(v["online"] for v in data.values()) else "degraded",
            "providers": data,
            "online": sum(1 for v in data.values() if v["online"]),
            "offline": sum(1 for v in data.values() if not v["online"])
        }
