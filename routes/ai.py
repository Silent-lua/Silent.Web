from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from services.orchestrator import AIOrchestrator
from database.models import Chat, Message
from database.database import db

ai_bp = Blueprint('ai', __name__)

# Nota: El limitador se inicializa en app.py, lo pasamos por contexto si es necesario,
# o usamos la instancia global decoradora.

@ai_bp.route('/chat', methods=['POST'])
@jwt_required()
def generate_response():
    data = request.get_json()
    prompt = data.get('prompt')
    model_mode = data.get('model', 'auto')
    chat_id = data.get('chat_id')
    user_id = get_jwt_identity()

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # 1. Manejo de Historial (DB)
    if not chat_id:
        chat = Chat(user_id=user_id, title=prompt[:30] + "...")
        db.session.add(chat)
        db.session.flush()
        chat_id = chat.id

    user_msg = Message(chat_id=chat_id, sender='user', content=prompt)
    db.session.add(user_msg)

    # 2. Obtener historial para contexto
    history_msgs = Message.query.filter_by(chat_id=chat_id).order_by(Message.created_at).all()
    formatted_history = [{"role": m.sender, "content": m.content} for m in history_msgs]

    # 3. Orquestador
    orchestrator = AIOrchestrator(current_app.config)
    ai_response = orchestrator.execute_prompt(prompt, model_mode, formatted_history)

    if not ai_response.get('success'):
        return jsonify({"error": "AI provider failed"}), 502

    # 4. Guardar respuesta y telemetría
    ai_msg = Message(
        chat_id=chat_id,
        sender='ai',
        content=ai_response['content'],
        model_used=ai_response['model'],
        tokens_used=ai_response['tokens'],
        latency_ms=ai_response['latency_ms'],
        cost_usd=ai_response['cost_usd']
    )
    db.session.add(ai_msg)
    db.session.commit()

    # 5. Retornar al frontend
    return jsonify({
        "chat_id": chat_id,
        "content": ai_response['content'],
        "telemetry": {
            "model": ai_response['model'],
            "tokens": ai_response['tokens'],
            "latency": ai_response['latency_ms']
        }
    }), 200
