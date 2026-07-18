from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.models import User, Message
from database.database import db
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Devuelve las estadísticas para renderizar la barra lateral derecha del frontend."""
    user_id = get_jwt_identity()

    # Costo total y tokens
    stats = db.session.query(
        func.sum(Message.cost_usd).label('total_cost'),
        func.sum(Message.tokens_used).label('total_tokens'),
        func.avg(Message.latency_ms).label('avg_latency'),
        func.count(Message.id).label('total_requests')
    ).join(Message.chat).filter(Message.sender == 'ai', Chat.user_id == user_id).first()

    return jsonify({
        "system_status": "Online",
        "total_requests": stats.total_requests or 0,
        "total_tokens": stats.total_tokens or 0,
        "total_cost_usd": round(stats.total_cost or 0.0, 4),
        "average_latency_ms": round(stats.avg_latency or 0.0, 2),
        "models_status": {
            "openai": "Online",
            "gemini": "Online",
            "grok": "Online"
        }
    }), 200
