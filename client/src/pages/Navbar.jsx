import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const userData = JSON.parse(localStorage.getItem('user'));

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top px-3 shadow">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Recipe Recommender
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                       
                    </ul>

                    <ul className="navbar-nav ms-auto">
                        {userData ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link text-light">
                                        {userData.email}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-outline-light" to="/login">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
