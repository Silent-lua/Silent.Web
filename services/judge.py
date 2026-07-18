import json
from typing import Dict, Any
from services.providers.base import BaseProvider

class Judge:
    def __init__(self, judge_provider: BaseProvider):
        self.evaluator=judge_provider

    def evaluate_responses(self, original_prompt:str, responses:Dict[str,Any])->Dict[str,Any]:
        eval_prompt=f"Eres un juez imparcial. Evalúa las siguientes respuestas para el prompt: '{original_prompt}'.\n"
        eval_prompt+="Califica del 1 al 10 en: Correctitud, Claridad y Completitud.\n"
        eval_prompt+="Devuelve estrictamente un JSON con el nombre del modelo ganador y la justificación.\n\n"
        for model,data in responses.items():
            eval_prompt+=f"--- Respuesta {model} ---\n{data['content']}\n\n"
        messages=[{"role":"system","content":"You output only valid JSON."},{"role":"user","content":eval_prompt}]
        judge_result=self.evaluator.generate(messages,temperature=0.1)
        try:
            decision=json.loads(judge_result["content"])
            winner=decision.get("ganador",list(responses.keys())[0])
            reason=decision.get("justificacion","Elegido por algoritmo juez")
        except Exception:
            winner=list(responses.keys())[0]
            reason="Default fallback (Judge failed parsing)"
        winning=responses[winner]
        winning["decision_reason"]=f"Judge selected: {reason}"
        winning["judge_cost"]=judge_result["cost_usd"]
        return winning
