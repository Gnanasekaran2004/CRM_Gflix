import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import AllCustomers from './pages/AllCustomers';
import About from './pages/About';
import Contact from './pages/Contact';
import Requests from './pages/Requests';
import Login from './Login';
import Register from './Register';

import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';
import API_URL from './config';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);

      const apiUrl = API_URL;
      axios.get(`${apiUrl}/api/auth/me`, {
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
    localStorage.removeItem('username');
    setAuthToken(null);
  };

  if (!authToken) {
    return (
      <ThemeProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </ThemeProvider>
    );
  }

  const getHeaders = () => {
    return { headers: { 'Authorization': authToken } };
  };

  return (
    <ThemeProvider>
      <div className="app-layout dark:bg-gray-900 dark:text-white transition-colors duration-200">
        <Navbar onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<AllCustomers />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/requests" element={<Requests />} />
          </Routes>
        </main>
        <footer className="app-footer dark:bg-gray-800 dark:border-t dark:border-gray-700">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} SparkCRM. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;