import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';  
import { Loader } from "lucide-react";
import axiosInstance from '../axiosInstance';

const AllCurrencies = () => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/currencies_vs/')
                setCurrencies(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex-grow flex justify-center items-center text-emerald-800 dark:text-emerald-300">
                <Loader size={24}/><div  className="p-2">Ładowanie... </div>
            </div>;
    }

    return (
        <div className="p-6 text-gray-900 dark:text-gray-100">
            <h2>All Currencies</h2>
            <ul>
                {currencies.results.map((currency, idx) => (
                    <li key={idx}>- {currency.name} ({currency.code})</li>
                ))}
            </ul>
        </div>
    );
};

export default AllCurrencies;