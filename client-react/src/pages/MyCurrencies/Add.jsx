import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
import axiosInstance from '../../axiosInstance';

import Frame from '../../components/Frame';
import LoadingFrame from '../../components/LoadingFrame';

import TopCenter from '../../layout/TopCenter';
import CenterCenter from '../../layout/CenterCenter';

import Button from '../../components/Button';
import Input from '../../components/Input';

import Select from '../../components/Select';

const MyCurrenciesAdd = () => {
    const navigate = useNavigate();

    const [currencies,setCurrencies] = useState(null);
    const [form, setForm] = useState({
        currency: 34,
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
            const response = await axiosInstance.post('/user_transaction/', form);
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
                        <h2 className='text-center p-6 text-3xl'>Dodanie zmiany waluty</h2>
                        <Select
                            label="Waluta:"   
                            name="currency"
                            onChange={handleSelectChange}
                            placeholder = ""   
                            className = ""
                            errors={errors.currency}
                        >
                            {currencies.map((item,id) => (
                                 <option key={item.id} value={item.id}>{item.name} [{item.code}]</option>
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
                        <div className='text-center p-6'><Button type = "submit">Dodaj</Button></div>
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