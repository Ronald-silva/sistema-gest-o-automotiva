import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/nav.css';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/reports" className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}>
                        Gestão Financeira
                    </Link>
                </li>
                <li>
                    <Link to="/cars" className={`nav-link ${location.pathname === '/cars' ? 'active' : ''}`}>
                        Registro de Veículos
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
