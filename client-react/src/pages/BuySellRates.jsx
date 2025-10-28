import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom"

import {Search } from 'lucide-react';

import axios from 'axios';  
import axiosInstance from '../axiosInstance';

import Frame from '../components/Frame';
import TopCenter from '../layout/TopCenter';
import CenterCenter from '../layout/CenterCenter';

import LoadingPage from '../components/LoadingFrame';

const BuySellRates = () => {

    const [currencies, setCurrencies] = useState(null);
    const fetch = async () => {

        let data = []

        try {
            const response = await axios.get("https://api.nbp.pl/api/exchangerates/tables/c/today/");
            data=response.data[0].rates;
        } catch (err) {
            console.error("Błąd:", err);
        }

        setCurrencies(data);
        console.log(data);
    }

    useEffect(() => {
        fetch();
    }, []);

    return (
        <>
            {currencies ? (
                <TopCenter>
                    <Frame>
                        <div className='text-center mb-4'>
                            <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>WALUTY WYMIENIALNE</h2>
                        </div>
                        <table className="table-auto min-w-full">
                            <thead>
                                <tr className='bg-emerald-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200 text-sm sm:text-base text-center' >
                                    <th className='cursor-pointer ps-3 pe-1 py-1 sm:px-6 sm:py-3 rounded-l-lg'>Kurs</th>
                                    <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Kod</th>
                                    <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Kupno</th>
                                    <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Sprzedaż</th>
                                    {/* <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3 rounded-r-lg'></th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {currencies.map((country,id) => (
                                    <tr key={id} className='text-center'>
                                        <td className='p-2'>{country.currency}</td>
                                        <td className='p-2'>{country.code}</td>
                                        <td className='p-2'>{country.bid}</td>
                                        <td className='p-2'>{country.ask}</td>
{/*                                         <td className='p-2'>
                                            <Link to={'/currency/'+country.id} ><Search className="
                                            rounded-md border-1 border-gray-500 p-1 w-[30px] h-[30px]
                                            bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                            dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md dark:shadow-emerald-900 dark:hover:border-emerald-500
                                            cursor-pointer" size={16}/></Link>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Frame>
                </TopCenter>
                
            ):(
                <>
                    <CenterCenter>
                        <LoadingPage/>
                    </CenterCenter>
                </>
            )}
        </>
    );
};

export default BuySellRates;