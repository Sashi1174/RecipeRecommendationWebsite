import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/Profile';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './pages/Navbar';
import RecommendForm from './pages/RecommendForm';
import AddRecipeForm from './pages/AddRecipeForm';
export default function App() {
  return (
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/recommend" element={<RecommendForm />} />
    <Route path="/add" element={<AddRecipeForm />} />
    <Route path="/profile" element={<Profile />} />
    
  </Routes>
  <Navbar />
  <ToastContainer position="top-middle" autoClose={3000} />
</BrowserRouter>


  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
