import os
import time
import shutil
from typing import Dict, Any

try:
    import psutil
except ImportError:
    psutil = None


class HealthMonitor:
    """
    Monitorea el estado general del servidor y servicios.
    """

    def __init__(self):
        self.started_at = time.time()

    def get_status(self) -> Dict[str, Any]:
        return {
            "status": "healthy",
            "uptime_seconds": round(time.time() - self.started_at, 2),
            "cpu_percent": self._cpu(),
            "memory": self._memory(),
            "disk": self._disk(),
            "environment": os.getenv("FLASK_ENV", "development")
        }

    def _cpu(self):
        if psutil:
            return psutil.cpu_percent(interval=0.2)
        return None

    def _memory(self):
        if psutil:
            vm = psutil.virtual_memory()
            return {
                "total": vm.total,
                "used": vm.used,
                "available": vm.available,
                "percent": vm.percent
            }
        return None

    def _disk(self):
        usage = shutil.disk_usage("/")
        total = usage.total
        used = usage.used
        free = usage.free
        return {
            "total": total,
            "used": used,
            "free": free,
            "percent": round((used / total) * 100, 2)
        }
