import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Button from './Button';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Spark<span style={{ color: 'var(--primary-600)' }}>CRM</span>
                </Link>

                <div className="navbar-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/customers"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Customers
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        About Us
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        Contact Us
                    </NavLink>
                </div>

                <div className="navbar-actions">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onLogout}
                    >
                        Log Out
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
