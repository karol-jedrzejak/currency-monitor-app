import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom"

import axios from 'axios';  
import axiosInstance from '../../axiosInstance';

import Frame from '../../components/Frame';
import ErrorFrame from '../../components/ErrorFrame';
import LoadingFrame from '../../components/LoadingFrame';

import TopCenter from '../../layout/TopCenter';
import CenterCenter from '../../layout/CenterCenter';

import {Search } from 'lucide-react';

const MyCurrenciesIndex = () => {

    const [transactions, setTransactions] = useState(null);
    const [summary, setSummary] = useState(null);

    const fetch = async () => {

        let data_transactions = [];
        let data_summary = [];
        let data_rates = [];

        try {
            const response = await axiosInstance.get('/user_transactions/')
            data_transactions=response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        
        try {
            const response = await axiosInstance.get('/user_transactions/summary')
            data_summary=response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        try {
            const response = await axios.get("https://api.nbp.pl/api/exchangerates/tables/c/today/");
            data_rates=response.data[0].rates;
        } catch (err) {
            console.error("Błąd:", err);
        }

        data_summary.forEach(item => {
            let rate = data_rates.find(rate => rate.code === item.currency.code);       
            if(rate)
            {
                item.current_rate = rate.ask;
            }         
        });

        setTransactions(data_transactions);
        setSummary(data_summary);
        console.log(data_transactions,data_summary);
    }

    useEffect(() => {
        fetch();
    }, []);


    return (
    <>
        <TopCenter classNameIn={"lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 space-y-4"}>
            {summary && summary.length!=0 ? (
                <div>
                <Frame>
                    <div className='text-center mb-4'>
                        <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>TWOJE WALUTY - SUMA</h2>
                    </div>
                    <table className="table-auto min-w-full">
                        <thead>
                            <tr className='bg-emerald-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200 text-sm sm:text-base text-center' >
                                <th className='cursor-pointer ps-3 pe-1 py-1 sm:px-6 sm:py-3 rounded-l-lg'>Nazwa</th>
                                <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Ilość</th>
                                <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Wartość w PLN</th>
                                <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3 rounded-r-lg'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((item,id) => (
                                <tr key={id} className='text-center'>
                                    <td className='p-2'>{item.currency.name}</td>
                                    <td className='p-2'>{item.total_amount.toFixed(2)}</td>
                                    <td className='p-2'>{(item.total_amount*item.current_rate).toFixed(2)}</td>
                                    <td className='p-2'>
                                        <Link to={'/currency/'+item.currency.id} ><Search className="
                                        rounded-md border-1 border-gray-500 p-1 w-[30px] h-[30px]
                                        bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                        dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md dark:shadow-emerald-900 dark:hover:border-emerald-500
                                        cursor-pointer" size={16}/></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className='bg-emerald-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200 text-sm sm:text-base text-center font-bold' >
                                <td className='p-2 rounded-l-lg'></td>
                                <td className='p-2'>SUMA</td>
                                <td className='p-2'>{summary.reduce((acc, item) => acc + item.total_amount*item.current_rate, 0).toFixed(2)}</td>
                                <td className='p-2 rounded-r-lg'></td>
                            </tr>
                        </tfoot>
                    </table>
                </Frame>
                </div>
            ):(
                <LoadingFrame/>
            )}
            {transactions && summary.length!=0 ? (
                <Frame>
                    u wszystkie
                </Frame>
            ):(
                <LoadingFrame/>
            )}
        </TopCenter>
    </>
    );
};

export default MyCurrenciesIndex;