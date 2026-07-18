from collections import defaultdict
from datetime import datetime
from typing import Dict, Any


class CostTracker:
    """
    Controla costos por usuario, proveedor y fecha.
    """

    def __init__(self):
        self.users = defaultdict(lambda: {
            "total_cost": 0.0,
            "total_tokens": 0,
            "providers": defaultdict(lambda: {
                "cost": 0.0,
                "tokens": 0,
                "requests": 0
            }),
            "history": []
        })

    def record(
        self,
        user_id: str,
        provider: str,
        tokens: int,
        cost_usd: float
    ) -> None:

        user = self.users[user_id]

        user["total_cost"] += cost_usd
        user["total_tokens"] += tokens

        provider_stats = user["providers"][provider]
        provider_stats["cost"] += cost_usd
        provider_stats["tokens"] += tokens
        provider_stats["requests"] += 1

        user["history"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "provider": provider,
            "tokens": tokens,
            "cost_usd": round(cost_usd, 8)
        })

    def get_user_report(self, user_id: str) -> Dict[str, Any]:
        if user_id not in self.users:
            return {}

        report = self.users[user_id].copy()
        report["providers"] = dict(report["providers"])
        return report

    def get_global_report(self) -> Dict[str, Any]:
        total_cost = 0.0
        total_tokens = 0
        provider_totals = defaultdict(float)

        for user in self.users.values():
            total_cost += user["total_cost"]
            total_tokens += user["total_tokens"]

            for provider, stats in user["providers"].items():
                provider_totals[provider] += stats["cost"]

        return {
            "users": len(self.users),
            "total_cost_usd": round(total_cost, 6),
            "total_tokens": total_tokens,
            "provider_costs": dict(provider_totals)
        }

    def reset(self) -> None:
        self.users.clear()
