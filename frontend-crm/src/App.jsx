import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import AllCustomers from './pages/AllCustomers';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);

      axios.get('http://localhost:8081/api/auth/me', {
        headers: { 'Authorization': token }
      })
        .then(() => {
          console.log("Token is valid");
        })
        .catch((err) => {
          console.error("Token invalid or backend unreachable", err);

          localStorage.removeItem('authToken');
          setAuthToken(null);
        });
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  if (!authToken) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    );
  }

  const getHeaders = () => {
    return { headers: { 'Authorization': authToken } };
  };

  return (
    <div className="app-layout">
      <Navbar onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<AllCustomers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} SparkCRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;