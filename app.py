import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config import config_by_name
from database.database import db, migrate
from routes.auth import auth_bp
from routes.ai import ai_bp
from routes.dashboard import dashboard_bp
from utils.logger import system_logger

# Configuración del Limitador de Tasa (Rate Limiting) para evitar abusos
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Inicializar Extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    limiter.init_app(app)

    # Registrar Blueprints (Rutas)
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(ai_bp, url_prefix='/api/v1/ai')
    app.register_blueprint(dashboard_bp, url_prefix='/api/v1/dashboard')

    # Manejo de Errores Globales
    @app.errorhandler(Exception)
    def handle_exception(e):
        system_logger.error(f"Unhandled Exception: {str(e)}")
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "version": "1.0.0"}), 200

    system_logger.info(f"Silent AI Application started in {config_name} mode.")
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
