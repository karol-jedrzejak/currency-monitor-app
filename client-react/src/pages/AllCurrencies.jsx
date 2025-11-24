import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

import axiosInstance from '../axiosInstance';

import Frame from '../components/Frame';
import ErrorFrame from '../components/ErrorFrame';
import LoadingFrame from '../components/LoadingFrame';

import TopCenter from '../layout/TopCenter';
import CenterCenter from '../layout/CenterCenter';

import Input from '../components/Input';
import Pagination from '../components/Pagination';

import { MoveDown,MoveUp,X,Search } from 'lucide-react';

const AllCurrencies = () => {
    const [currencies, setCurrencies] = useState(null);
    const [error, setError] = useState(false);

    const [search, setSearch] = useState('');

    const [params, setParams] = useState({
        page_num: 1,
        table: null,
        name: '',
        order_by: "name",
    });

    const updateParams = (update_params) => {
        setParams(prev => {
            const new_params = { ...prev, ...update_params };

            if (prev.name !== new_params.name || prev.order_by !== new_params.order_by) {
                new_params.page_num = 1;
            }

            return new_params;
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            let urlParams = "";
            for (const param in params) {
                if (params[param] !== null && params[param] !== "") {
                    urlParams += `${param}=${params[param]}&`;
                }
            }
            try {
                const response = await axiosInstance.get(`/currencies/?${urlParams}`);
                setCurrencies(response.data);
                console.log(response.data);
            } catch {
                setError("Błąd przy pobieraniu danych.");
            }
        };

        fetchData();
    }, [params]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') updateParams({ name: search });
    };

    return (
        <>
            {currencies ? (
                <TopCenter>
                    <Frame>
                        <div className='flex flex-col sm:flex-row items-center justify-between mb-4'>
                            <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>
                                WSZYSTKIE WALUTY
                            </h2>

                            <div className='flex flex-col sm:flex-row items-center'>
                                <Input
                                    label="Wyszukaj:"
                                    type="text"
                                    name="name"
                                    value={search}
                                    onChange={handleSearch}
                                    onKeyDown={handleEnter}
                                />

                                <div className='flex flex-row items-center'>
                                    <Search
                                        className="rounded-md border-1 border-gray-500 p-2 w-[40px] h-[40px]
                                            bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                            dark:bg-gray-800 dark:hover:bg-emerald-600
                                            cursor-pointer"
                                        onClick={() => updateParams({ name: search })}
                                    />

                                    <X
                                        className="ms-2 rounded-md border-1 border-gray-500 p-2 w-[40px] h-[40px]
                                            bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                            dark:bg-gray-800 dark:hover:bg-emerald-600
                                            cursor-pointer"
                                        onClick={() => {
                                            setSearch('');
                                            updateParams({ name: '' });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <table className="table-auto min-w-full">
                            <thead>
                                <tr className='bg-emerald-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200 text-center'>
                                    <th
                                        className='cursor-pointer ps-3 pe-1 py-1 sm:px-6 sm:py-3'
                                        onClick={() =>
                                            updateParams({
                                                order_by:
                                                    params.order_by === "name" ? "-name" : "name",
                                            })
                                        }
                                    >
                                        <div className='flex flex-row items-center'>
                                            <div>Nazwa</div>
                                            {params.order_by === "name" && <MoveUp size={14} />}
                                            {params.order_by === "-name" && <MoveDown size={14} />}
                                        </div>
                                    </th>
                                    <th
                                        className='cursor-pointer px-1 py-1 sm:px-6 sm:py-3'
                                        onClick={() =>
                                            updateParams({
                                                order_by:
                                                    params.order_by === "code" ? "-code" : "code",
                                            })
                                        }
                                    >
                                        <div className='flex flex-row items-center'>
                                            <div>Kod</div>
                                            {params.order_by === "code" && <MoveUp size={14} />}
                                            {params.order_by === "-code" && <MoveDown size={14} />}
                                        </div>
                                    </th>
                                    <th
                                        className='cursor-pointer px-1 py-1 sm:px-6 sm:py-3'
                                        onClick={() =>
                                            updateParams({
                                                order_by:
                                                    params.order_by === "table" ? "-table" : "table",
                                            })
                                        }
                                    >
                                        <div className='flex flex-row items-center'>
                                            <div>Tabela</div>
                                            {params.order_by === "table" && <MoveUp size={14} />}
                                            {params.order_by === "-table" && <MoveDown size={14} />}
                                        </div>
                                    </th>

                                    <th className='px-1 py-1 sm:px-6 sm:py-3'>Kurs</th>
                                    <th className='px-1 py-1 sm:px-6 sm:py-3'>Kraje</th>
                                    <th className='px-1 py-1 sm:px-6 sm:py-3'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currencies.results.map((currency, idx) => (
                                    <tr key={idx} className="text-gray-700 dark:text-gray-100 border-b-1 border-emerald-500">
                                        <td className='ps-3 pe-1 py-1 sm:px-6 sm:py-4'>{currency.name}</td>
                                        <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{currency.code}</td>
                                        <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{currency.table}</td>
                                        <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{currency.rate}</td>

                                        <td className='flex flex-row flex-wrap ps-1 pe-3 py-1 sm:px-6 sm:py-4'>
                                            {currency.countries.map((country, i) => (
                                                <span key={i} className='p-1'>
                                                    <img
                                                        src={country.flag + '#svgView(preserveAspectRatio(none))'}
                                                        className='w-[30px] h-[20px] border-1 border-gray-500 rounded-md'
                                                    />
                                                </span>
                                            ))}
                                        </td>

                                        <td className='text-center'>
                                            <Link to={`/currency/${currency.id}`}>
                                                <Search
                                                    className="rounded-md border-1 border-gray-500 p-1 w-[30px] h-[30px]
                                                        bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                                        dark:bg-gray-800 dark:hover:bg-emerald-600
                                                        cursor-pointer"
                                                    size={16}
                                                />
                                            </Link>
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
                            fetch={(params) => updateParams(params)}
                        />
                    </Frame>
                </TopCenter>
            ) : (
                <>
                    {error ? (
                        <CenterCenter>
                            <ErrorFrame text={error} />
                        </CenterCenter>
                    ) : (
                        <CenterCenter>
                            <LoadingFrame />
                        </CenterCenter>
                    )}
                </>
            )}
        </>
    );
};

export default AllCurrencies;