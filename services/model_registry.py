from typing import Dict, List, Optional


class ModelRegistry:
    """
    Registro centralizado de modelos disponibles.
    """

    def __init__(self):
        self._models: Dict[str, Dict] = {}

    def register(
        self,
        name: str,
        provider: str,
        model: str,
        enabled: bool = True,
        priority: int = 100,
        supports_stream: bool = True,
        metadata: Optional[Dict] = None
    ) -> None:

        self._models[name] = {
            "provider": provider,
            "model": model,
            "enabled": enabled,
            "priority": priority,
            "supports_stream": supports_stream,
            "metadata": metadata or {}
        }

    def unregister(self, name: str) -> None:
        self._models.pop(name, None)

    def get(self, name: str) -> Optional[Dict]:
        return self._models.get(name)

    def list_models(self) -> List[Dict]:
        return [
            {"name": k, **v}
            for k, v in sorted(
                self._models.items(),
                key=lambda item: item[1]["priority"]
            )
        ]

    def enabled_models(self) -> List[str]:
        return [
            name for name, cfg in self._models.items()
            if cfg["enabled"]
        ]

    def set_enabled(self, name: str, enabled: bool) -> bool:
        if name not in self._models:
            return False
        self._models[name]["enabled"] = enabled
        return True

    def exists(self, name: str) -> bool:
        return name in self._models

    def clear(self) -> None:
        self._models.clear()


registry = ModelRegistry()

registry.register(
    name="openai",
    provider="openai",
    model="gpt-4o",
    priority=1
)

registry.register(
    name="gemini",
    provider="google",
    model="gemini-2.5-pro",
    priority=2
)

registry.register(
    name="grok",
    provider="xai",
    model="grok-4",
    priority=3
)
