import { useState } from 'react';

import axios from 'axios';

import CenterCenter from '../layout/CenterCenter';
import Frame from '../components/Frame';
import Input from '../components/Input';
import Button from '../components/Button';

import { Loader } from "lucide-react";

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        setSuccess(false);
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', form);
            setSuccess(true);
            setForm({
                username: '',
                email: '',
                password: ''
            });
            setErrors({});
        } catch (error) {
            setErrors(error.response.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CenterCenter>
            <Frame>
            <form onSubmit={handleSubmit} >
                <h2 className='text-center p-6 text-3xl'>REJESTRACJA</h2>
                <Input
                    label="Login:"   
                    type = "text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder = ""   
                    className = ""
                    errors={errors.username}
                ></Input>
                <Input
                    label="Email:"   
                    type = "email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder = ""   
                    className = ""
                    errors={errors.email}
                ></Input>  
                <Input
                    label="Hasło:"   
                    type = "password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder = ""   
                    className = ""
                    errors={errors.password}
                    required
                ></Input>
                {success && <div className="text-emerald-800 dark:text-emerald-300 m-2 text-center">Rejestracja udana! Możesz się teraz zalogować.</div>}
                {loading ? (
                    <div className="text-emerald-800 dark:text-emerald-300 m-2 flex justify-center items-center text-center p-3"><Loader size={24}/><div  className="p-2">Przetwarzanie... </div></div>
                    ) : (
                    <div className='text-center p-6'><Button type = "submit">Zarejestruj</Button></div>
                    )}
                
            </form>
            </Frame>
        </CenterCenter>
    );
};

export default Register;