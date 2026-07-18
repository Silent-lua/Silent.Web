import concurrent.futures
from typing import Dict, List, Any
from utils.logger import system_logger

class ParallelExecutor:
    def __init__(self, providers: Dict[str, Any]):
        self.providers = providers

    def execute_parallel(self, models: List[str], messages: List[Dict[str, str]]) -> Dict[str, Any]:
        results = {}
        def fetch(model_name):
            provider = self.providers.get(model_name)
            if provider:
                return model_name, provider.generate(messages)
            return model_name, {"success": False, "error": "Provider not found"}

        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            futures = [executor.submit(fetch, model) for model in models]
            for future in concurrent.futures.as_completed(futures):
                model_name, response = future.result()
                if response["success"]:
                    results[model_name] = response
                else:
                    system_logger.warning(f"{model_name} falló en ejecución paralela: {response['error']}")
        return results

    def execute_with_fallback(self, ranked_models, messages):
        for model_name, score in ranked_models:
            provider = self.providers.get(model_name)
            if not provider:
                continue
            response = provider.generate(messages)
            if response["success"]:
                response["decision_reason"] = f"Fallback success on {model_name}"
                return response
            system_logger.warning(f"Fallback activado: {model_name} falló.")
        return {"success": False, "error": "All providers failed."}