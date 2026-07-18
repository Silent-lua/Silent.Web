import logging
import os
from logging.handlers import RotatingFileHandler

# Crear directorio de logs si no existe
if not os.path.exists('logs'):
    os.makedirs('logs')

system_logger = logging.getLogger('SilentAI')
system_logger.setLevel(logging.INFO)

handler = RotatingFileHandler('logs/system.log', maxBytes=10485760, backupCount=5)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
system_logger.addHandler(handler)
