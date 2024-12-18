# backend/app/routes.py

from flask import request, jsonify
from .models import Car, db
from flask import Blueprint
import csv
from flask import Response

main = Blueprint('main', __name__)

# Obter todos os carros
@main.route('/cars', methods=['GET'])
def get_cars():
    cars = Car.query.all()
    car_list = [
        {
            "id": car.id,
            "brand": car.brand,
            "model": car.model,
            "year": car.year,
            "color": car.color,  # Incluindo cor
            "purchase_price": car.purchase_price,
            "sale_price": car.sale_price,
            "status": car.status
        }
        for car in cars
    ]
    return jsonify(car_list)

# Adicionar carro
@main.route('/cars', methods=['POST'])
def add_car():
    data = request.json
    print(data)
    new_car = Car(
        brand=data['brand'],
        model=data['model'],
        year=data['year'],
        color=data['color'],  # Incluindo cor
        purchase_price=data['purchase_price'],
        sale_price=data['sale_price'],
        status=data['status']
    )
    db.session.add(new_car)
    db.session.commit()
    return jsonify({"message": "Carro adicionado com sucesso!"}), 201

# Editar carro
@main.route('/cars/<int:car_id>', methods=['PUT'])
def edit_car(car_id):
    data = request.json
    car = Car.query.get_or_404(car_id)
    car.brand = data.get('brand', car.brand)
    car.model = data.get('model', car.model)
    car.year = data.get('year', car.year)
    car.color = data.get('color', car.color)  # Editar cor
    car.purchase_price = data.get('purchase_price', car.purchase_price)
    car.sale_price = data.get('sale_price', car.sale_price)
    car.status = data.get('status', car.status)

    db.session.commit()
    return jsonify({"message": "Carro atualizado com sucesso!"})

# Deletar carro
@main.route('/cars/<int:car_id>', methods=['DELETE'])
def delete_car(car_id):
    car = Car.query.get_or_404(car_id)
    db.session.delete(car)
    db.session.commit()
    return jsonify({"message": "Carro excluído com sucesso!"})

@main.route('/cars/export', methods=['GET'])
def export_cars():
    cars = Car.query.all()

    # Define o cabeçalho do CSV
    def generate():
        data = [['ID', 'Marca', 'Modelo', 'Ano', 'Cor', 'Preço de Compra', 'Preço de Venda']]
        for car in cars:
            data.append([
                car.id,
                car.brand,
                car.model,
                car.year,
                car.color,
                car.purchase_price,
                car.sale_price
            ])
        output = ""
        for row in data:
            output += ",".join(map(str, row)) + "\n"
        return output

    headers = {
        "Content-Disposition": "attachment; filename=relatorio_carros.csv",
        "Content-Type": "text/csv"
    }

    return Response(generate(), headers=headers)
