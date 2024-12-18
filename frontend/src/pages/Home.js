import React from 'react';
import '../styles/nav.css';
import '../styles/home.css';

function Home() {
    return (
        <div className="home-container">
            <h1 className="home-title">Bem-vindo ao Sistema de Gestão Automotiva</h1>
            <p className="home-subtitle">Gerencie seus veículos, finanças e relatórios de forma eficiente.</p>
            
           

            {/* Cards com Resumo Rápido */}
            <div className="summary-cards">
                <div className="card">
                    <h3>Total de Carros</h3>
                    <p>10</p>
                </div>
                <div className="card">
                    <h3>Lucro Total</h3>
                    <p>R$ 50.000</p>
                </div>
                <div className="card">
                    <h3>Receitas</h3>
                    <p>R$ 120.000</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
