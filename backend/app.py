# backend/app.py
from flask import Flask
from app.models import db
from app.routes import main
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cars.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)  # Permite chamadas do frontend
db.init_app(app)
app.register_blueprint(main)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
