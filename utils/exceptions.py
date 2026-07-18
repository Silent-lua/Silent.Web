from flask import jsonify
from werkzeug.exceptions import HTTPException
from utils.logger import system_logger


class APIError(Exception):
    """
    Excepción personalizada para errores controlados de la API.
    """

    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def handle_api_error(error: APIError):
    """
    Maneja errores personalizados de la aplicación.
    """
    return jsonify({
        "success": False,
        "error": error.message
    }), error.status_code


def handle_generic_error(error):
    """
    Maneja cualquier excepción no controlada.
    """

    if isinstance(error, HTTPException):
        return jsonify({
            "success": False,
            "error": error.description
        }), error.code

    system_logger.exception("Unhandled Exception")

    return jsonify({
        "success": False,
        "error": "Internal Server Error"
    }), 500
