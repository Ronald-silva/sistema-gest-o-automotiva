import React, { useState, useEffect } from 'react';
import '../styles/gestao.css';

const FinanceManagement = () => {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        type: '',
        category: '',
        subcategory: '',
        description: '',
        value: '',
        date: '',
    });

    // Carregar transações do Local Storage ao iniciar
    useEffect(() => {
        const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
        setTransactions(savedTransactions);
    }, []);

    // Salvar transações no Local Storage sempre que o estado for atualizado
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddTransaction = () => {
        if (formData.type && formData.category && formData.value) {
            const newTransactions = [...transactions, formData];
            setTransactions(newTransactions);
            setFormData({
                type: '',
                category: '',
                subcategory: '',
                description: '',
                value: '',
                date: '',
            });
        }
    };

    const handleDeleteTransaction = (index) => {
        const updatedTransactions = transactions.filter((_, i) => i !== index);
        setTransactions(updatedTransactions);
    };

    return (
        <div className="vehicle-container">
            <h2 className="vehicle-title">Gestão Financeira</h2>

            {/* Formulário */}
            <div className="form-container">
                <div className="form-group">
                    <label>Tipo</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="">Selecione o Tipo</option>
                        <option value="Receita">Receita</option>
                        <option value="Despesa">Despesa</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Categoria</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="">Selecione a Categoria</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Lazer">Lazer</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Subcategoria</label>
                    <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                    >
                        <option value="">Selecione a Subcategoria</option>
                        <option value="Supermercado">Supermercado</option>
                        <option value="Combustível">Combustível</option>
                        <option value="Remédios">Remédios</option>
                        <option value="Cinema">Cinema</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Descrição</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Descrição"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Valor</label>
                    <input
                        type="number"
                        name="value"
                        placeholder="Valor"
                        value={formData.value}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Data</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>
                <div id='btn-ad' className="form-group">
                    <button onClick={handleAddTransaction}>Adicionar</button>
                </div>
            </div>

            {/* Tabela */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Categoria</th>
                            <th>Subcategoria</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.type}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.subcategory}</td>
                                <td>{transaction.description}</td>
                                <td>R$ {transaction.value}</td>
                                <td>{transaction.date}</td>
                                <td>
                                    <button onClick={() => handleDeleteTransaction(index)}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinanceManagement;
