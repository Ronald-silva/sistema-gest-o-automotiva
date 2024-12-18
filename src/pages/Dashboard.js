import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';

import '../styles/dashboard.css'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function Dashboard() {
    const [cars, setCars] = useState([]);
    const [totals, setTotals] = useState({});

    // Função para buscar os dados da API
    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/cars');
            setCars(response.data);
            calculateTotals(response.data);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }, []);

    // Função para calcular totais e métricas
    const calculateTotals = (data) => {
        const totalPurchase = data.reduce((sum, car) => sum + parseFloat(car.purchase_price), 0);
        const totalSale = data.reduce((sum, car) => sum + parseFloat(car.sale_price), 0);
        const profit = totalSale - totalPurchase;
        const profitMargin = totalSale ? ((profit / totalSale) * 100).toFixed(2) : 0;

        setTotals({
            totalCars: data.length,
            totalPurchase,
            totalSale,
            profit,
            profitMargin,
        });
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Gráfico de Barras
    const barData = {
        labels: [...new Set(cars.map((car) => car.brand))],
        datasets: [
            {
                label: 'Quantidade de Carros por Marca',
                data: [...new Set(cars.map((car) => car.brand))].map(
                    (brand) => cars.filter((car) => car.brand === brand).length
                ),
                backgroundColor: '#36A2EB',
            },
        ],
    };

    // Gráfico de Pizza
    const pieData = {
        labels: [...new Set(cars.map((car) => car.brand))],
        datasets: [
            {
                label: 'Distribuição de Carros por Marca',
                data: [...new Set(cars.map((car) => car.brand))].map(
                    (brand) => cars.filter((car) => car.brand === brand).length
                ),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    // Gráfico de Linhas
    const lineData = {
        labels: ['Custo Total', 'Receita Total', 'Lucro Total'],
        datasets: [
            {
                label: 'Evolução Financeira',
                data: [totals.totalPurchase, totals.totalSale, totals.profit],
                fill: false,
                borderColor: '#36A2EB',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <h2 className="page-title">Panorama geral</h2>

            {/* Cards de Métricas */}
            <div className="cards-container">
                <div className="card">
                    <h3>Total de Carros</h3>
                    <p>{totals.totalCars}</p>
                </div>
                <div className="card">
                    <h3>Total de Gastos</h3>
                    <p>R$ {totals.totalPurchase?.toFixed(2)}</p>
                </div>
                <div className="card">
                    <h3>Total de Receitas</h3>
                    <p>R$ {totals.totalSale?.toFixed(2)}</p>
                </div>
                <div className="card">
                    <h3>Lucro Bruto</h3>
                    <p>R$ {totals.profit?.toFixed(2)}</p>
                </div>
                <div className="card">
                    <h3>Margem de Lucro</h3>
                    <p>{totals.profitMargin}%</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="chart-container">
                <h3 className="chart-title">Evolução Financeira</h3>
                <Line data={lineData} />
            </div>

            <div className="chart-container">
                <h3 className="chart-title">Carros por Marca</h3>
                <Bar data={barData} />
            </div>

            <div className="chart-container">
                <h3 className="chart-title">Distribuição de Carros por Marca</h3>
                <Pie data={pieData} />
            </div>
        </div>
    );
}

export default Dashboard;
