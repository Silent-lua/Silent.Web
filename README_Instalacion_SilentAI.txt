# Instalación de Silent AI

## 1. Crear entorno virtual
python -m venv venv

## 2. Activar entorno virtual

### Mac/Linux
source venv/bin/activate

### Windows
venv\Scripts\activate

## 3. Instalar dependencias
pip install -r requirements.txt

## 4. Configurar variables de entorno
cp .env.example .env

Edita el archivo .env con tus claves API reales.

## 5. Inicializar la base de datos
flask --app app.py db init
flask --app app.py db migrate -m "Migración inicial"
flask --app app.py db upgrade

## 6. Ejecutar el servidor
flask --app app.py run --debug
