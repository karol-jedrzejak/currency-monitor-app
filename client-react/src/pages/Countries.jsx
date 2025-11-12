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

const Countries = () => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');

    const [params, setParams] = useState({
        page_num: 1,
        search: '',
        order_by: "name",
    });
    const location = useLocation();
    const { hash, pathname, search_loc } = location;

    const updateParams = (update_params) => {
        let new_params = params;
        for (const param in update_params) {
            new_params[param] = update_params[param];
        }
        if(params.name != new_params.name || params.order_by != new_params.order_by)
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
        let url = '/countries/?'+urlParams;
        setLoading(true);
        try {
            const response = await axiosInstance.get(url)
            setCountries(response.data);
             console.log(response.data);
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
            fetch({search: search, page_num: 1});
        }
    };

    useEffect(() => {
        fetch(params);
    }, []);

    return (
        <TopCenter>
            <Frame>
                <div className='flex flex-col sm:flex-row items-center justify-between mb-4'>
                    <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>KRAJE</h2>
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
                        cursor-pointer" size={24} onClick={() => fetch({search: search, page_num: 1})}/>
                        <X className="
                        ms-2 rounded-md border-1 border-gray-500 p-2 w-[40px] h-[40px]
                        bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                        dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md dark:shadow-emerald-900 dark:hover:border-emerald-500
                        cursor-pointer" size={24} onClick={() => {
                                setSearch('');
                                fetch({search: ''});
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
                                if(params.order_by == "name") {
                                    fetch({order_by: "-name"});
                                } else {
                                    fetch({order_by: "name"});
                                }
                                }}>
                                <div className='flex flex-row items-center'>
                                    <div>Nazwa</div>
                                    {params.order_by == "name" && ( <><MoveUp size={14} /></>)}
                                    {params.order_by == "-name" && ( <><MoveDown size={14} /></>)}
                                </div>
                            </th>
                            <th className='cursor-pointer ps-3 pe-1 py-1 sm:px-6 sm:py-3 rounded-l-lg' onClick={() => {
                                if(params.order_by == "official_name") {
                                    fetch({order_by: "-official_name"});
                                } else {
                                    fetch({order_by: "official_name"});
                                }
                                }}>
                                <div className='flex flex-row items-center'>
                                    <div>Oficjalna Nazwa</div>
                                    {params.order_by == "official_name" && ( <><MoveUp size={14} /></>)}
                                    {params.order_by == "-official_name" && ( <><MoveDown size={14} /></>)}
                                </div>
                            </th>
                            <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Flaga</th>
                            <th className='cursor-pointer px-1 py-1 sm:px-6 sm:py-3' onClick={() => {
                                if(params.order_by == "region") {
                                    fetch({order_by: "-region"});
                                } else {
                                    fetch({order_by: "region"});
                                }
                            }}>
                                <div className='flex flex-row items-center'>
                                    <div>Region</div>
                                    {params.order_by == "region" && ( <><MoveUp size={14} /></>)}
                                    {params.order_by == "-region" && ( <><MoveDown size={14} /></>)}
                                </div>
                            </th>
                            <th className='cursor-pointer ps-1 pe-3 py-1 sm:px-6 sm:py-3 rounded-r-lg'>Waluty</th>
                        </tr>
                    </thead>
                    <tbody>
                    {countries.results.map((country, idx) => (
                        <tr key={idx} className="text-gray-700 dark:text-gray-100 text-xs sm:text-sm border-b-1 border-emerald-500">
                            <td className='ps-3 pe-1 py-1 sm:px-6 sm:py-4 '>{country.name}</td>
                            <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{country.official_name}</td>
                            <td className='flex fle-row flex-wrap align-middle ps-1 pe-3 py-1 sm:px-6 sm:py-4'>
                              <span className='p-1'><img src={country.flag+'#svgView(preserveAspectRatio(none))'} className='w-[30px] h-[20px]  border-1 border-gray-500 rounded-md'/></span>
                            </td>
                            <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{country.region}</td>
                            <td>
                                <ul>
                                {country.currencies.map((currency,idc) => (
                                    <li key={idc}>
                                        <div className="flex items-center justify-between py-2">
                                            <div className='pe-2'>{currency.name} [{currency.code}]</div>
                                            <Link to={'/currency/'+currency.id} >
                                                <Search className="
                                                    rounded-md border-1 border-gray-500 p-1 w-[30px] h-[30px]
                                                    bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                                    dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md dark:shadow-emerald-900 dark:hover:border-emerald-500
                                                    cursor-pointer" size={16}/>
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                               </ul>
                            </td>
                          </tr>  
                    ))}
                    </tbody>
                </table> 
                <Pagination
                    prev={countries.prev}
                    next={countries.next}
                    pages={countries.number_of_pages}
                    current={countries.current}
                    fetch={fetch}
                />
                </>
                )}

            </Frame>
        </TopCenter>
    );
};

export default Countries;