from typing import List, Dict, Any


class ConversationManager:
    """
    Gestiona el historial de conversación y controla el contexto enviado
    a los modelos de IA.
    """

    def __init__(self, max_messages: int = 20):
        self.max_messages = max_messages

    def trim_history(self, history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Mantiene únicamente los últimos mensajes configurados."""
        if len(history) <= self.max_messages:
            return history
        return history[-self.max_messages:]

    def build_messages(
        self,
        history: List[Dict[str, Any]],
        prompt: str,
        system_prompt: str | None = None
    ) -> List[Dict[str, str]]:
        """Construye la lista de mensajes para enviar al proveedor."""
        messages: List[Dict[str, str]] = []

        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })

        messages.extend(self.trim_history(history))

        messages.append({
            "role": "user",
            "content": prompt
        })

        return messages

    def estimate_tokens(self, messages: List[Dict[str, str]]) -> int:
        """
        Estimación simple del número de tokens.
        Sustituible por tiktoken u otro tokenizer.
        """
        chars = sum(len(m.get("content", "")) for m in messages)
        return max(1, chars // 4)

    def needs_summary(
        self,
        messages: List[Dict[str, str]],
        max_tokens: int = 12000
    ) -> bool:
        return self.estimate_tokens(messages) >= max_tokens

    def create_summary_prompt(
        self,
        messages: List[Dict[str, str]]
    ) -> List[Dict[str, str]]:
        conversation = "\n".join(
            f"{m['role']}: {m['content']}"
            for m in messages
        )

        return [
            {
                "role": "system",
                "content": (
                    "Resume la conversación conservando únicamente "
                    "el contexto importante para continuar."
                )
            },
            {
                "role": "user",
                "content": conversation
            }
        ]
