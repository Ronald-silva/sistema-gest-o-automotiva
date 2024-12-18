# backend/app/_init_.py
import os
from flask import Flask
from .database import db

def create_app():
    app = Flask(__name__)

    # Caminho ABSOLUTO do banco de dados SQLite
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, '../instance/cars.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicializa o banco de dados
    db.init_app(app)

    with app.app_context():
        db.create_all()  # Cria todas as tabelas no banco de dados

    return app
