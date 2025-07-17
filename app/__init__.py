from flask import Flask
from .routes import messages_bp
from .db import create_table

def create_app():
    app = Flask(__name__)
    app.register_blueprint(messages_bp)
    create_table()
    return app
