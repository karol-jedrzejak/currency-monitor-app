import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Axis3D } from 'lucide-react';
import axiosInstance from './axiosInstance';

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState(null);

        // Login function
        const login = (data,username) => {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user', username);
            setUser({
                    token:  data.access,
                    refresh_token: data.refresh,
                    user: username,
                })
            navigate('/powitanie');
            setLoadingUser(false);
        };

        // Logout function
        const logout = () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
            setLoadingUser(false);
        };

        // Function to check if token is expired
        const isTokenExpired = (token) => {
            if (!token) return true;
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const exp = payload.exp * 1000;
                return Date.now() > exp;
            } catch {
                return true;
            }
        };

        const refreshTokens = async () => {
            try{
                const response = await axiosInstance.post('/token/refresh/', {refresh: refresh_token});
                if (response.status === 200) {
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);
                    axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;                    
                } else {
                    logout();
                }
            } catch (err) {
                logout();
            }  
        };


    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');

        const accessExpired = isTokenExpired(access_token);
        const refreshExpired = isTokenExpired(refresh_token);

        if(!accessExpired) {
            setUser({
                token: access_token,
                refresh_token: refresh_token,
                user: localStorage.getItem('user'),       
            });
            setLoadingUser(false);
        } else if (!refreshExpired) {
            refreshTokens().then(() => {
                setUser({
                    token: localStorage.getItem('access_token'),
                    refresh_token: localStorage.getItem('refresh_token'),
                    user: localStorage.getItem('user'),
                });
                setLoadingUser(false);
            });
        } else {
            logout();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user,loadingUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext };