import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/login';
import Signup from './pages/signup';
import Navbar from './pages/Navbar';
import './App.css'; // this file with the styles above
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
                    <h1>Recipe Recommender</h1>
  return (
    <BrowserRouter>
    <h1>Recipe Recommender</h1>
     <Navbar/> {/* ✅ Navbar outside Routes */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
