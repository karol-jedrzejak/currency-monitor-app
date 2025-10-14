import React from 'react';
import { useEffect, useState } from 'react';

const AllCurrencies = () => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/currencies_vs/')
            .then(res => res.json())
            .then(data => {
                setCurrencies(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>All Currencies</h2>
            <ul>
                {currencies.results.map((currency, idx) => (
                    <li key={idx}>{currency.name} ({currency.code})</li>
                ))}
            </ul>
        </div>
    );
};

export default AllCurrencies;