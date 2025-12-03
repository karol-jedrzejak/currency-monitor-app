import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import axiosInstance from '../../axiosInstance';

import Frame from '../../components/Frame';
import LoadingFrame from '../../components/LoadingFrame';

import TopCenter from '../../layout/TopCenter';
import CenterCenter from '../../layout/CenterCenter';

import Button from '../../components/Button';
import Input from '../../components/Input';

import Select from '../../components/Select';

const MyCurrenciesAdd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const id = location.pathname.split("/").pop();

    const [currencies,setCurrencies] = useState(null);
    const [form, setForm] = useState({
        currency: 1,
        amount: 0,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (e) => {
        const value = parseInt(e.target.value);
        setForm({
            ...form,
            [e.target.name]: value
        });
    };

    const fetch = async () => {
        try {
            const response = await axiosInstance.get('/user_transaction/'+id)
            setForm({
                ...form,
                id: response.data.id,
                user: response.data.user,
                amount: response.data.amount,
                currency: response.data.currency.id
            });
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        try {
            const response = await axiosInstance.get('/all_currencies')
            setCurrencies(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetch();
    },[]);

    const handleSubmit = async (e) => {
        setErrors({});
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axiosInstance.put('/user_transaction/'+id+'/', form);
            navigate('/myCurrencies');
        } catch (error) {
            setErrors(error.response.data);
        } finally {
            setLoading(false);
        }
    };

    return (
    <>
        {currencies ?   (
            <TopCenter>
                <Frame>
                    <form onSubmit={handleSubmit} >
                        <h2 className='text-center p-6 text-3xl'>Aktualizacja zmiany waluty</h2>
                        <Select
                            label="Waluta:"   
                            name="currency"
                            onChange={handleSelectChange}
                            placeholder = ""   
                            className = ""
                            errors={errors.currency}
                            defaultValue={form.currency}
                        >
                            {currencies.map((item,id) => (
                                <option key={item.id} value={item.id} className={`text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-200`} >{item.name} [{item.code}]</option>
                            ))}
                        </Select>
                        <Input
                            label="Wartość:"   
                            type = "number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder = ""   
                            className = ""
                            errors={errors.amount}
                        ></Input>
                        <div className='text-center p-6'><Button type = "submit">Zmień</Button></div>
                    </form>
                </Frame>
            </TopCenter>
        ):(
            <CenterCenter>
                <LoadingFrame/>
            </CenterCenter>
        )}
    </>
    );
};

export default MyCurrenciesAdd;