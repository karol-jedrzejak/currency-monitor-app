import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom"


import { AppStateContext } from "../AppStateProvider";

import axios from 'axios';  
import axiosInstance from '../axiosInstance';


import Frame from '../components/Frame';
import ErrorFrame from '../components/ErrorFrame';
import LoadingFrame from '../components/LoadingFrame';

import TopCenter from '../layout/TopCenter';
import CenterCenter from '../layout/CenterCenter';


import {Search } from 'lucide-react';
import { Line } from 'react-chartjs-2';


const TopCurrencies = () => {

    const appState = useContext(AppStateContext);
    const [error, setError] = useState(false);
    const [currencies, setCurrencies] = useState(null);
    const [chartsData, setChartsData] = useState(null);

    const top_currencies = [
        {
            id: 2,
            code: "USD",
            borderColor: 'rgb(9,255,0)',
            backgroundColor: 'rgba(9,255,0, 0.5)',
        },
        {
            id: 8,
            code: "EUR",
            borderColor: 'rgb(0, 234, 255)',
            backgroundColor: 'rgba(0, 234, 255, 0.5)',
        },
        {
            id: 10,
            code: "CHF",
            borderColor: 'rgb(255, 13, 0)',
            backgroundColor: 'rgba(255, 13, 0, 0.5)',
        },
        {
            id: 11,
            code: "GBP",
            borderColor: 'rgb(72, 0, 255)',
            backgroundColor: 'rgba(72, 0, 255, 0.5)',
        },
    ];

    const fetch = async () => {

        let data = []

        for (const currency of top_currencies) {
            try {
            const response1 = await axiosInstance.get('/currencies/' + currency.id);
            const response2 = await axios.get("https://api.nbp.pl/api/exchangerates/rates/a/" + currency.code + "/last/255/");
            const response3 = await axios.get('https://api.nbp.pl/api/exchangerates/rates/C/' + currency.code + '/');

            data.push({
                ...response1.data,
                rates: response2.data.rates,
                buySell: response3.data.rates[0],
                borderColor: currency.borderColor,
                backgroundColor: currency.backgroundColor,
            });
            } catch (err) {
                setError("Błąd przy pobieraniu danych.");
                console.error("Błąd:", err);
            }
        }

        if(data.length === top_currencies.length)
        {
            setCurrencies(data);

            const chart_labels = data[0].rates.map(item => item.effectiveDate);
        
            const chart_data = {
                labels: chart_labels,
                datasets: [
                {
                    label: data[0].code,
                    data: data[0].rates.map(item => item.mid),
                    borderColor: data[0].borderColor,
                    backgroundColor: data[0].backgroundColor,
                },
                {
                    label: data[1].code,
                    data: data[1].rates.map(item => item.mid),
                    borderColor: data[1].borderColor,
                    backgroundColor: data[1].backgroundColor,
                },
                {
                    label: data[2].code,
                    data: data[2].rates.map(item => item.mid),
                    borderColor: data[2].borderColor,
                    backgroundColor: data[2].backgroundColor,
                },
                {
                    label: data[3].code,
                    data: data[3].rates.map(item => item.mid),
                    borderColor: data[3].borderColor,
                    backgroundColor: data[3].backgroundColor,
                },
                ],
            };

            const chart_options_light = {
                color: "#000000",
                responsive: true,
                plugins: {
                legend: {
                    position: 'top',
                },
                },
                responsive:true,
                maintainAspectRatio:true,
                pointRadius: 1,
                scales: {
                    x: {
                        ticks: {
                            color: '#181818',
                        }
                    },
                    y: {
                        ticks: {
                            color: '#181818',
                        }
                    }
                }
            };

            const chart_options_dark = {
                color: "#FFFFFF",
                responsive: true,
                plugins: {
                legend: {
                    position: 'top',
                },
                },
                responsive:true,
                maintainAspectRatio:true,
                pointRadius: 1,
                scales: {
                    x: {
                        ticks: {
                            color: '#F2F2F2',
                        }
                    },
                    y: {
                        ticks: {
                            color: '#F2F2F2',
                        }
                    }
                }
            };
        
            setChartsData({
                data: chart_data,
                options_light: chart_options_light,
                options_dark: chart_options_dark
            });
        } else{
            setError("Błąd przy pobieraniu danych.");
        }
    }

    useEffect(() => {
        fetch();
    }, []);

    return (
        <>
            {currencies ? (
                <TopCenter classNameIn={"lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 space-y-4"}>
                    <div>
                        <Frame>
                            <div className='text-center mb-4'>
                                <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>TOP WALUTY</h2>
                            </div>
                            <table className="table-auto min-w-full">
                                <thead>
                                    <tr className='bg-emerald-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200 text-sm sm:text-base text-center' >
                                        <th className='cursor-pointer ps-3 pe-1 py-1 sm:px-6 sm:py-3 rounded-l-lg'>Kurs</th>
                                        <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Kod</th>
                                        <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Kupno</th>
                                        <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Sprzedaż</th>
                                        <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3 rounded-r-lg'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currencies.map((country, id) => (
                                        <tr key={id} className='text-center'>
                                            <td className='p-2'>{country.name}</td>
                                            <td className='p-2'>{country.code}</td>
                                            <td className='p-2'>{country.buySell.bid}</td>
                                            <td className='p-2'>{country.buySell.ask}</td>
                                            <td className='p-2'>
                                                <Link to={'/currency/'+country.id} ><Search className="
                                                rounded-md border-1 border-gray-500 p-1 w-[30px] h-[30px]
                                                bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                                dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md dark:shadow-emerald-900 dark:hover:border-emerald-500
                                                cursor-pointer" size={16}/></Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Frame>
                    </div>
                    <div>
                        <Frame className="relative w-[100%]">
                            <div>
                                <h2 className="text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mb-4">
                                    WYKRES ZMIANY WALUT
                                </h2>
                            </div>
                            <Line className="w-[800px] h-[600px] p-2" 
                            options={appState.darkTheme ? chartsData.options_dark : chartsData.options_light}
                            data={chartsData.data} />
                        </Frame>
                    </div>
                </TopCenter>
                
            ):(
                <>
                    {error ? (
                        <>
                            <CenterCenter>
                                <ErrorFrame text={error}/>
                            </CenterCenter>
                        </>
                    ):(
                        <>
                            <CenterCenter>
                                <LoadingFrame/>
                            </CenterCenter>
                        </>
                    )}
                </>      
            )}
        </>
    );
};

export default TopCurrencies;