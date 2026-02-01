import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('customerToken'));
    const [isLoading, setIsLoading] = useState(true);

    

    const apiBaseUrl = API_URL;

    useEffect(() => {
        if (token) {
            const storedUser = localStorage.getItem('customerUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setIsLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${apiBaseUrl}/api/auth/customer-login`, { email, password });
            const { token, name, role } = response.data;

            localStorage.setItem('customerToken', token);
            localStorage.setItem('customerUser', JSON.stringify({ name, email, role }));

            setToken(token);
            setUser({ name, email, role });
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, message: error.response?.data || "Login failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerUser');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
