import re
from typing import Dict, Any

class PromptAnalyzer:
    def __init__(self):
        # Categorías y sus disparadores (keywords/regex)
        self.categories = {
            "Programación": r"\b(python|javascript|c\+\+|html|css|react|flask|api|código|debug|error|bug|sql)\b",
            "Matemáticas": r"\b(integral|derivada|ecuación|álgebra|calcula|probabilidad)\b",
            "Investigación": r"\b(historia|explica|ensayo|investiga|resumen|quién fue|teoría)\b",
            "Traducción": r"\b(traduce|en inglés|en español|francés|alemán)\b"
        }

    def analyze(self, prompt: str) -> Dict[str, Any]:
        """Clasifica el prompt y determina la complejidad."""
        prompt_lower = prompt.lower()
        detected_category = "General"
        complexity_score = 1.0

        for category, pattern in self.categories.items():
            if re.search(pattern, prompt_lower):
                detected_category = category
                break

        if len(prompt) > 500 or "comparar" in prompt_lower or "arquitectura" in prompt_lower:
            complexity_score = 3.0
        elif len(prompt) > 200:
            complexity_score = 2.0

        return {
            "category": detected_category,
            "complexity": complexity_score,
            "intent": "action" if "escribe" in prompt_lower or "crea" in prompt_lower else "information"
        }
