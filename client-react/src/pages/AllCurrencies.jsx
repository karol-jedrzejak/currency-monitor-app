import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';  
import { Loader } from "lucide-react";
import axiosInstance from '../axiosInstance';

import Frame from '../components/Frame';
import TopCenter from '../layout/TopCenter';
import CenterCenter from '../layout/CenterCenter';
import Pagination from '../components/Pagination';

const AllCurrencies = () => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);

    //let params = {};

    useEffect(() => {
        const initFetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/currencies_vs/')
                setCurrencies(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        initFetchData();
    }, []);

    const prevNext = async (url) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(url)
            setCurrencies(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

//?id_max=&id_min=&name=dol&page_num=2&table=

    const fetch = async (params) => {
        let urlParams = "";
        for (const param in params) {
            urlParams += `${param}=${params[param]}&`;
        }
        setLoading(true);
        try {
            const response = await axiosInstance.get('/currencies_vs/?'+urlParams)
            setCurrencies(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    if (loading) {
        return  <CenterCenter>
                    <Frame>
                        <div className="text-emerald-500 flex flex-row justify-center items-center">
                            <Loader size={24}/><div  className="p-2">Ładowanie... </div>
                        </div>
                    </Frame>
                </CenterCenter>;
    }

    return (
        <TopCenter>
            <Frame>
                <h2 className='text-center pb-4 text-emerald-800 dark:text-emerald-300 text-lg font-bold'>WSZYSTKIE WALUTY</h2>
                <table className="table-auto">
                    <thead>
                        <tr className='bg-emerald-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200 text-base text-center' >
                            <th className='px-6 py-3 rounded-l-lg'>Nazwa</th>
                            <th className='px-6 py-3'>Kod</th>
                            <th className='px-6 py-3'>Tabela</th>
                            <th className='px-6 py-3 rounded-r-lg'>Kraje</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currencies.results.map((currency, idx) => (
                        <tr key={idx} className="text-gray-700 dark:text-gray-100 text-sm">
                            <td className='px-6 py-4 '>{currency.name}</td>
                            <td className='px-6 py-4 text-center'>{currency.code}</td>
                            <td className='px-6 py-4 text-center'>{currency.table}</td>
                            <td className='flex fle-row flex-wrap align-middle px-6 py-4'>
                                {currency.countries.map((country, idx) => (
                                    <span key={idx} className='p-1'><img src={country.flag+'#svgView(preserveAspectRatio(none))'} className='w-[30px] h-[20px]'/></span>
/*                                     <div key={idx}>{country.name}</div> */
                                ))}
                            </td>
                        </tr>  
                    ))}
                    </tbody>
                </table> 
                <Pagination
                    prev={currencies.prev}
                    next={currencies.next}
                    pages={currencies.number_of_pages}
                    current={currencies.current}
                    prevNext={prevNext}
                    fetch={fetch}
                />
            </Frame>
        </TopCenter>
    );
};

export default AllCurrencies;