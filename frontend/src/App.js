import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FinanceManagement from './pages/FinanceManagement';
import CarList from './components/CarList';

import './styles/home.css';
import './styles/dashboard.css';
import './styles/gestao.css';
import './styles/registro.css';
import './styles/nav.css';




function App() {
    return (
        <Router>
            <Navbar /> {/* Barra de navegação visível em todas as rotas */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<FinanceManagement />} />
                <Route path="/cars" element={<CarList />} />
            </Routes>
        </Router>
    );
}

export default App;
