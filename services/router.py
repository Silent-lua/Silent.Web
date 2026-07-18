from typing import Dict, Any, List
from services.prompt_analyzer import PromptAnalyzer


class IntelligentRouter:
    """
    Router inteligente encargado de decidir qué proveedor de IA utilizar
    dependiendo del tipo y complejidad del prompt.
    """

    def __init__(self):
        self.analyzer = PromptAnalyzer()

        # Afinidad inicial de cada modelo según el tipo de tarea.
        self.affinity_matrix = {
            "Programación": {
                "openai": 0.98,
                "gemini": 0.95,
                "grok": 0.92
            },
            "Matemáticas": {
                "gemini": 0.98,
                "openai": 0.95,
                "grok": 0.88
            },
            "Investigación": {
                "gemini": 0.97,
                "openai": 0.95,
                "grok": 0.90
            },
            "Traducción": {
                "openai": 0.96,
                "gemini": 0.94,
                "grok": 0.90
            },
            "General": {
                "openai": 0.95,
                "gemini": 0.95,
                "grok": 0.95
            }
        }

    def determine_route(self, prompt: str) -> Dict[str, Any]:

        analysis = self.analyzer.analyze(prompt)

        category = analysis["category"]
        complexity = analysis["complexity"]
        intent = analysis["intent"]

        scores = self.affinity_matrix.get(
            category,
            self.affinity_matrix["General"]
        )

        ranked_models = sorted(
            scores.items(),
            key=lambda item: item[1],
            reverse=True
        )

        requires_triple = False

        if complexity >= 3:
            requires_triple = True

        if len(prompt) > 1200:
            requires_triple = True

        if intent == "information" and complexity >= 2.8:
            requires_triple = True

        if any(
            word in prompt.lower()
            for word in [
                "comparar",
                "analiza",
                "investiga",
                "consenso",
                "profesional",
                "arquitectura",
                "enterprise"
            ]
        ):
            requires_triple = True

        return {
            "category": category,
            "complexity": complexity,
            "intent": intent,
            "primary_target": ranked_models[0][0],
            "ranked_models": ranked_models,
            "requires_triple": requires_triple
        }

    def available_models(self) -> List[str]:
        return [
            "openai",
            "gemini",
            "grok"
        ]