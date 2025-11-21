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

const Countries = () => {
    const [error, setError] = useState(false);
    const [search, setSearch] = useState("");
    const [countries, setCountries] = useState(null);

    const [params, setParams] = useState({
        page_num: 1,
        search: "",
        order_by: "name",
    });

    const updateParams = (update_params) => {
        setParams(prev => {
            const new_params = {
                ...prev,
                ...update_params,
            };

            if (
                prev.search !== new_params.search ||
                prev.order_by !== new_params.order_by
            ) {
                new_params.page_num = 1;
            }

            return new_params;
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            let urlParams = "";
            for (const p in params) {
                if (params[p] !== "" && params[p] !== null && params[p] !== undefined) {
                    urlParams += `${p}=${params[p]}&`;
                }
            }

            try {
                const response = await axiosInstance.get(`/countries/?${urlParams}`);
                setCountries(response.data);
            } catch (error) {
                setError("Błąd przy pobieraniu danych.");
            }
        };

        fetchData();
    }, [params]); 


    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            updateParams({ search: search });
        }
    };

    return (
        <>
            {countries ? (
                <TopCenter>
                    <Frame>

                        {/* Wyszukiwarka */}
                        <div className='flex flex-col sm:flex-row items-center justify-between mb-4'>
                            <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>
                                KRAJE
                            </h2>

                            <div className='flex flex-col sm:flex-row items-center'>
                                <Input
                                    label="Wyszukaj:"
                                    type="text"
                                    name="name"
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder=""
                                    onKeyDown={handleEnter}
                                />

                                <div className='flex flex-row items-center'>
                                    <Search
                                        className="rounded-md border-1 border-gray-500 p-2 w-[40px] h-[40px]
                                                bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                                dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md
                                                cursor-pointer"
                                        onClick={() => updateParams({ search: search })}
                                    />
                                    <X
                                        className="ms-2 rounded-md border-1 border-gray-500 p-2 w-[40px] h-[40px]
                                                bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                                dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md
                                                cursor-pointer"
                                        onClick={() => {
                                            setSearch("");
                                            updateParams({ search: "" });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tabela */}
                        <table className="table-auto min-w-full">
                            <thead>
                                <tr className='bg-emerald-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200 text-center'>
                                    {/* Sortowanie Name */}
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

                                    {/* Sortowanie Official Name */}
                                    <th
                                        className='cursor-pointer ps-3 pe-1 py-1 sm:px-6 sm:py-3'
                                        onClick={() =>
                                            updateParams({
                                                order_by:
                                                    params.order_by === "official_name"
                                                        ? "-official_name"
                                                        : "official_name",
                                            })
                                        }
                                    >
                                        <div className='flex flex-row items-center'>
                                            <div>Oficjalna Nazwa</div>
                                            {params.order_by === "official_name" && <MoveUp size={14} />}
                                            {params.order_by === "-official_name" && <MoveDown size={14} />}
                                        </div>
                                    </th>

                                    <th className='px-1 py-1 sm:px-6 sm:py-3'>Flaga</th>

                                    {/* Sortowanie Region */}
                                    <th
                                        className='cursor-pointer px-1 py-1 sm:px-6 sm:py-3'
                                        onClick={() =>
                                            updateParams({
                                                order_by:
                                                    params.order_by === "region" ? "-region" : "region",
                                            })
                                        }
                                    >
                                        <div className='flex flex-row items-center'>
                                            <div>Region</div>
                                            {params.order_by === "region" && <MoveUp size={14} />}
                                            {params.order_by === "-region" && <MoveDown size={14} />}
                                        </div>
                                    </th>

                                    <th className='ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Waluty</th>
                                </tr>
                            </thead>

                            <tbody>
                                {countries.results.map((country, idx) => (
                                    <tr key={idx} className="text-gray-700 dark:text-gray-100 border-b-1 border-emerald-500">
                                        <td className='ps-3 pe-1 py-1 sm:px-6 sm:py-4'>{country.name}</td>
                                        <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{country.official_name}</td>

                                        <td className='ps-1 pe-3 py-1 sm:px-6 sm:py-4'>
                                            <img
                                                src={country.flag + '#svgView(preserveAspectRatio(none))'}
                                                className='w-[30px] h-[20px] border-1 border-gray-500 rounded-md'
                                            />
                                        </td>

                                        <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{country.region}</td>

                                        <td>
                                            <ul>
                                                {country.currencies.map((currency, idc) => (
                                                    <li key={idc} className="py-2 flex items-center justify-between">
                                                        <div>{currency.name} [{currency.code}]</div>
                                                        <Link to={`/currency/${currency.id}`}>
                                                            <Search
                                                                className="rounded-md border-1 border-gray-500 p-1 w-[30px] h-[30px]
                                                                    bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                                                    dark:bg-gray-800 dark:hover:bg-emerald-600 dark:hover:text-gray-900 dark:hover:shadow-md
                                                                    cursor-pointer"
                                                                size={16}
                                                            />
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Paginacja */}
                        <Pagination
                            prev={countries.prev}
                            next={countries.next}
                            pages={countries.number_of_pages}
                            current={countries.current}
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

export default Countries;