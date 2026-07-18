import os
from datetime import timedelta


class Config:
    """
    Configuración base de SilentAI Enterprise.
    """

    # Seguridad
    SECRET_KEY = "0029283834600"
    JWT_SECRET_KEY = "0024928383600"

    # JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # Base de datos
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///silent_ai_dev.db"
    )

    # Redis
    REDIS_URL = os.getenv(
        "REDIS_URL",
        "redis://localhost:6379/0"
    )

    # Uploads
    MAX_CONTENT_LENGTH = 15 * 1024 * 1024
    UPLOAD_FOLDER = "uploads"

    # APIs IA
    OPENAI_API_KEY = None

    GEMINI_API_KEY = "AQ.Ab8RN6JdxYZ_2RExSEKnfYOk-Yc5FoudQs4cRXH9rsGf0s0ZVQ"

    GROQ_API_KEY = "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"

    # CORS
    CORS_ORIGINS = ["*"]


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig
}