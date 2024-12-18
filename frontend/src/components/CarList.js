import React, { useState } from 'react';
import '../styles/registro.css';

const VehicleRegistry = () => {
    const [vehicles, setVehicles] = useState([
        { id: 1, brand: 'Fiat', model: 'Uno', year: 2020, color: 'Preto', purchasePrice: 20000, salePrice: 25000 },
        { id: 2, brand: 'Volkswagen', model: 'Gol', year: 2019, color: 'Branco', purchasePrice: 30000, salePrice: 35000 },
    ]);

    const [form, setForm] = useState({
        brand: '',
        model: '',
        year: '',
        color: '',
        purchasePrice: '',
        salePrice: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const addVehicle = () => {
        if (form.brand && form.model && form.year && form.color && form.purchasePrice && form.salePrice) {
            setVehicles([
                ...vehicles,
                {
                    id: vehicles.length + 1,
                    ...form,
                    purchasePrice: parseFloat(form.purchasePrice),
                    salePrice: parseFloat(form.salePrice),
                },
            ]);
            setForm({
                brand: '',
                model: '',
                year: '',
                color: '',
                purchasePrice: '',
                salePrice: '',
            });
        }
    };

    const deleteVehicle = (id) => {
        setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    };

    return (
        <div className="vehicle-container">
            <h1 className="vehicle-title">Registro de Veículos</h1>

            {/* Formulário */}
            <div className="form-container">
                <div className="form-group">
                    <label>Marca</label>
                    <input name="brand" value={form.brand} onChange={handleInputChange} placeholder="Digite a marca" />
                </div>
                <div className="form-group">
                    <label>Modelo</label>
                    <input name="model" value={form.model} onChange={handleInputChange} placeholder="Digite o modelo" />
                </div>
                <div className="form-group">
                    <label>Ano</label>
                    <input name="year" value={form.year} onChange={handleInputChange} placeholder="Digite o ano" />
                </div>
                <div className="form-group">
                    <label>Cor</label>
                    <input name="color" value={form.color} onChange={handleInputChange} placeholder="Digite a cor" />
                </div>
                <div className="form-group">
                    <label>Preço de Compra</label>
                    <input
                        name="purchasePrice"
                        value={form.purchasePrice}
                        onChange={handleInputChange}
                        placeholder="Digite o preço de compra"
                    />
                </div>
                <div className="form-group">
                    <label>Preço de Venda</label>
                    <input
                        name="salePrice"
                        value={form.salePrice}
                        onChange={handleInputChange}
                        placeholder="Digite o preço de venda"
                    />
                </div>
                <div className="form-group">
                    <button onClick={addVehicle}>Adicionar</button>
                </div>
            </div>

            {/* Tabela */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Ano</th>
                            <th>Cor</th>
                            <th>Preço de Compra</th>
                            <th>Preço de Venda</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.id}</td>
                                <td>{vehicle.brand}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.year}</td>
                                <td>{vehicle.color}</td>
                                <td>R$ {vehicle.purchasePrice.toFixed(2)}</td>
                                <td>R$ {vehicle.salePrice.toFixed(2)}</td>
                                <td>
                                    <button onClick={() => deleteVehicle(vehicle.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VehicleRegistry;
