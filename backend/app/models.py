# backend/app/models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(20), nullable=False)  
    purchase_price = db.Column(db.Float, nullable=False)
    sale_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False)
