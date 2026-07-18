from collections import defaultdict
from datetime import datetime
from typing import Dict, Any


class UsageTracker:
    """
    Rastrea métricas de uso de usuarios y proveedores de IA.
    """

    def __init__(self):
        self.user_stats = defaultdict(lambda: {
            "requests": 0,
            "tokens": 0,
            "cost_usd": 0.0,
            "models": defaultdict(int),
            "first_seen": datetime.utcnow().isoformat(),
            "last_seen": None
        })

    def record(
        self,
        user_id: str,
        provider: str,
        tokens: int = 0,
        cost_usd: float = 0.0
    ) -> None:

        stats = self.user_stats[user_id]

        stats["requests"] += 1
        stats["tokens"] += tokens
        stats["cost_usd"] += cost_usd
        stats["models"][provider] += 1
        stats["last_seen"] = datetime.utcnow().isoformat()

    def get_user(self, user_id: str) -> Dict[str, Any]:
        if user_id not in self.user_stats:
            return {}

        stats = self.user_stats[user_id].copy()
        stats["models"] = dict(stats["models"])
        return stats

    def summary(self) -> Dict[str, Any]:
        total_requests = 0
        total_tokens = 0
        total_cost = 0.0
        providers = defaultdict(int)

        for stats in self.user_stats.values():
            total_requests += stats["requests"]
            total_tokens += stats["tokens"]
            total_cost += stats["cost_usd"]

            for model, count in stats["models"].items():
                providers[model] += count

        return {
            "users": len(self.user_stats),
            "requests": total_requests,
            "tokens": total_tokens,
            "cost_usd": round(total_cost, 6),
            "providers": dict(providers)
        }

    def reset(self) -> None:
        self.user_stats.clear()
