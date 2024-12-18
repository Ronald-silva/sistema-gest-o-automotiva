#app/database.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    """
    Função para inicializar o banco de dados com o Flask app.
    """
    db.init_app(app)
