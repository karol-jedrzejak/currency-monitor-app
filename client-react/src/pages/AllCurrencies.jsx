import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';  
import { Loader } from "lucide-react";
import axiosInstance from '../axiosInstance';
import { MoveDown,MoveUp,X,Search } from 'lucide-react';

import { Link } from "react-router-dom"
import { useLocation } from 'react-router'

import Input from '../components/Input';
import Frame from '../components/Frame';
import TopCenter from '../layout/TopCenter';
import CenterCenter from '../layout/CenterCenter';
import Pagination from '../components/Pagination';

const AllCurrencies = () => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');

    const [params, setParams] = useState({
        page_num: 1,
        table: null,
        name: '',
        orderBy: "name",
    });
    const location = useLocation();
    const { hash, pathname, search_loc } = location;

    const updateParams = (update_params) => {
        let new_params = params;
        for (const param in update_params) {
            new_params[param] = update_params[param];
        }
        if(params.name != new_params.name || params.orderBy != new_params.orderBy)
        {
            new_params.page_num = 1;
        }
        setParams(new_params);
    }

    const fetch = async (update_params = null) => {
        if(update_params)
        {
            updateParams(update_params);
        }
        setSearch(params.name);
        let urlParams='';
        for (const param in params) {
            if(params[param])
            {
                urlParams += param+"="+params[param]+"&"
            }
        }
        let url = '/currencies_vs/?'+urlParams;
        setLoading(true);
        try {
            const response = await axiosInstance.get(url)
            setCurrencies(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            fetch({name: search, page_num: 1});
        }
    };

    useEffect(() => {
        fetch(params);
    }, []);

    return (
        <TopCenter>
            <Frame>
                <div className='flex flex-col sm:flex-row items-center justify-between mb-4'>
                    <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>WSZYSTKIE WALUTY</h2>
                    <div className='flex flex-col sm:flex-row items-center'>
                        <Input
                            label="Wyszukaj:"   
                            type = "text"
                            name="name"
                            value={search}
                            onChange={handleSearch}
                            placeholder = ""   
                            className = ""
                            onKeyDown={handleEnter}
                        ></Input>
                        <div className='flex flex-row items-center'>
                        <Search className="
                        rounded-md border-1 border-gray-500 p-2 w-[40px] h-[40px]
                        bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                        dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md dark:shadow-emerald-900 dark:hover:border-emerald-500
                        cursor-pointer" size={24} onClick={() => fetch({name: search, page_num: 1})}/>
                        <X className="
                        ms-2 rounded-md border-1 border-gray-500 p-2 w-[40px] h-[40px]
                        bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                        dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md dark:shadow-emerald-900 dark:hover:border-emerald-500
                        cursor-pointer" size={24} onClick={() => {
                                setSearch('');
                                fetch({name: ''});
                            }}/>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div className="text-emerald-500 flex flex-row justify-center items-center">
                        <Loader size={24}/><div  className="p-2">Ładowanie... </div>
                    </div>
                ) : (
                <>
                <table className="table-auto min-w-full">
                    <thead>
                        <tr className='bg-emerald-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200 text-sm sm:text-base text-center' >
                            <th className='cursor-pointer ps-3 pe-1 py-1 sm:px-6 sm:py-3 rounded-l-lg' onClick={() => {
                                if(params.orderBy == "name") {
                                    fetch({orderBy: "-name"});
                                } else {
                                    fetch({orderBy: "name"});
                                }
                                }}>
                                <div className='flex flex-row items-center'>
                                    <div>Nazwa</div>
                                    {params.orderBy == "name" && ( <><MoveUp size={14} /></>)}
                                    {params.orderBy == "-name" && ( <><MoveDown size={14} /></>)}
                                </div>
                            </th>
                            <th className='cursor-pointer px-1 py-1 sm:px-6 sm:py-3' onClick={() => {
                                if(params.orderBy == "code") {
                                    fetch({orderBy: "-code"});
                                } else {
                                    fetch({orderBy: "code"});
                                }
                            }}>
                                <div className='flex flex-row items-center'>
                                    <div>Kod</div>
                                    {params.orderBy == "code" && ( <><MoveUp size={14} /></>)}
                                    {params.orderBy == "-code" && ( <><MoveDown size={14} /></>)}
                                </div>
                            </th>
                            <th className='cursor-pointer px-1 py-1 sm:px-6 sm:py-3' onClick={() => {
                                if(params.orderBy == "table") {
                                    fetch({orderBy: "-table"});
                                } else {
                                    fetch({orderBy: "table"});
                                }
                            }}>
                                <div className='flex flex-row items-center'>
                                    <div>Tabela</div>
                                    {params.orderBy == "table" && ( <><MoveUp size={14} /></>)}
                                    {params.orderBy == "-table" && ( <><MoveDown size={14} /></>)}
                                </div>
                            </th>
                            <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Kurs</th>
                            <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Kraje</th>
                            <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3 rounded-r-lg'></th>
                        </tr>
                    </thead>
                    <tbody>
                    {currencies.results.map((currency, idx) => (
                        <tr key={idx} className="text-gray-700 dark:text-gray-100 text-xs sm:text-sm border-b-1 border-emerald-500">
                            <td className='ps-3 pe-1 py-1 sm:px-6 sm:py-4 '>{currency.name}</td>
                            <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{currency.code}</td>
                            <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{currency.table}</td>
                            <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{currency.rate}</td>
                            <td className='flex fle-row flex-wrap align-middle ps-1 pe-3 py-1 sm:px-6 sm:py-4'>
                                {currency.countries.map((country, idx) => (
                                    <span key={idx} className='p-1'><img src={country.flag+'#svgView(preserveAspectRatio(none))'} className='w-[30px] h-[20px]  border-1 border-gray-500 rounded-md'/></span>
                                ))}
                            </td>
                            <td><Link to={'/currency/'+currency.id} ><Search className="
                        rounded-md border-1 border-gray-500 p-1 w-[30px] h-[30px]
                        bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                        dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md dark:shadow-emerald-900 dark:hover:border-emerald-500
                        cursor-pointer" size={16}/></Link></td>
                        </tr>  
                    ))}
                    </tbody>
                </table> 
                <Pagination
                    prev={currencies.prev}
                    next={currencies.next}
                    pages={currencies.number_of_pages}
                    current={currencies.current}
                    fetch={fetch}
                />
                </>
                )}

            </Frame>
        </TopCenter>
    );
};

export default AllCurrencies;