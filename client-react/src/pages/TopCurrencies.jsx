import React from 'react';
import { useEffect, useState, useContext } from 'react';

import axios from 'axios';  
import axiosInstance from '../axiosInstance';

import Frame from '../components/Frame';
import TopCenter from '../layout/TopCenter';

import { AppStateContext } from "../AppStateProvider";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
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

    const get_from_nbp_api = async (currency_code) => {
        try {
            const response = await axios.get("https://api.nbp.pl/api/exchangerates/rates/a/"+currency_code+"/last/255/");
            return {
                ok: true,
                data: response.data.rates
            };
        } catch (error) {
            return { ok: false,error};
        }
    }

    const get_from_app_api = async(currency_id) => {
        try {
            const response = await axiosInstance.get('/currencies_vs/'+currency_id);
            return {
                ok: true,
                data: response.data
            };
        } catch (error) {
            return {
                ok: false,
                data: error
            };
        }
    }

    const fetch = async () => {

        let data = []

        for (const currency of top_currencies) {
            try {
            const response1 = await axiosInstance.get('/currencies_vs/' + currency.id);
            const response2 = await axios.get("https://api.nbp.pl/api/exchangerates/rates/a/" + currency.code + "/last/255/");

            data.push({
                ...response1.data,
                rates: response2.data.rates,
                borderColor: currency.borderColor,
                backgroundColor: currency.backgroundColor,
            });
            } catch (err) {
            console.error("Błąd:", err);
            }
        }

        console.log(data);
        setCurrencies(data);
        

        let chart = {};

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
            title: {
                display: true,
                text: 'Kurs',
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
            title: {
                display: true,
                text: 'Kurs Dark',
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



    }

    useEffect(() => {
        fetch();
        console.log(currencies);
    }, []);

    return (
        <TopCenter>
            <Frame>
                <div className='flex flex-col sm:flex-row items-center justify-between mb-4'>
                    <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>TOP WALUTY</h2>
                </div>
            </Frame>
        {currencies ? (
            <>
            {chartsData && (
                <Frame className="relative w-[100%]">
                    <Line className="w-[800px] h-[600px]" 
                    //options={chartsData.options}
                    options={appState.darkTheme ? chartsData.options_dark : chartsData.options_light}
                    data={chartsData.data} />
                </Frame>
            )}
            </>
        ):(
            <>
                <div>Loading</div>
            </>
        )}
        </TopCenter>
    );
};

export default TopCurrencies;