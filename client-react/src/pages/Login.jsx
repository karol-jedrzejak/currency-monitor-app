import React, { useState } from 'react';

import Input from '../components/Input';
import Button from '../components/Button';
import Frame from '../components/Frame';
import CenterCenter from '../layout/CenterCenter';

import axios from 'axios';
import { Loader } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from "../AuthProvider";

const Login = () => {
    const authData = useContext(AuthContext);
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', form);
            setLoading(false);
            authData.login(response.data,form.username);
        } catch (error) {
            setLoading(false);
            setError("Błędny login lub hasło");
        }
    };
    return (
        <CenterCenter>
            <Frame>
                <form onSubmit={handleSubmit}>
                    <h2 className='text-center p-6 text-3xl'>LOGOWANIE</h2>
                    <Input
                        label="Login:"   
                        type = "text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder = ""   
                        className = ""
                    ></Input> 
                    <Input
                        label="Hasło:"   
                        type = "password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder = ""   
                        className = ""
                        required
                    ></Input>
                    {error && <div className="text-red-600 m-2 text-center text-sm">{error}</div>}
                    {loading ? (
                        <div className="text-emerald-800 dark:text-emerald-300 m-2 flex justify-center items-center text-center p-3"><Loader size={24}/><div  className="p-2">Logowanie... </div></div>
                        ) : (
                        <div className='text-center p-6'><Button type = "submit">Zaloguj</Button></div>
                        )}
                </form>
            </Frame>
        </CenterCenter>
    );
};

export default Login;