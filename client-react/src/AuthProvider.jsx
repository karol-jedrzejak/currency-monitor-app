import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Example: Load user from localStorage or API
    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');
        if (access_token && refresh_token) {
            setUser({
                token: access_token,
                refresh_token: refresh_token
            }); // Replace with real user data
        }
        setLoading(false);
    }, []);

    // Example: Login function
    const login = (data) => {
        setUser({
                token:  data.access,
                refresh_token: data.refresh
            })
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        navigate('/');
    };

    // Example: Logout function
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext };