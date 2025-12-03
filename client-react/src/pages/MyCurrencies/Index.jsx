import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

import axios from 'axios';  
import axiosInstance from '../../axiosInstance';

import Frame from '../../components/Frame';
import LoadingFrame from '../../components/LoadingFrame';

import TopCenter from '../../layout/TopCenter';

import Input from '../../components/Input';
import Pagination from '../../components/Pagination';

import {Plus,MoveDown,MoveUp,X,Search,PencilLine,Trash2} from 'lucide-react';

const MyCurrenciesIndex = () => {

    const [transactions, setTransactions] = useState(null);
    const [summary, setSummary] = useState(null);

    const [search, setSearch] = useState('');
    const [params, setParams] = useState({
        page_num: 1,
        name: '',
        order_by: "-created_at",
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



    const fetch = async () => {
        let urlParams = "";
        for (const param in params) {
            if (params[param] !== null && params[param] !== "") {
                urlParams += `${param}=${params[param]}&`;
            }
        }
        let data_transactions = [];
        let data_summary = [];
        let data_rates_a = [];
        let data_rates_b = [];

        try {
            const response = await axiosInstance.get(`/user_transaction/?${urlParams}`)
            data_transactions=response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        
        try {
            const response = await axiosInstance.get('/user_transaction/summary')
            data_summary=response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        try {
            const response = await axios.get("https://api.nbp.pl/api/exchangerates/tables/a/");
            data_rates_a=response.data[0].rates;
        } catch (err) {
            console.error("Błąd:", err);
        }

        try {
            const response = await axios.get("https://api.nbp.pl/api/exchangerates/tables/b/");
            data_rates_b=response.data[0].rates;
        } catch (err) {
            console.error("Błąd:", err);
        }

        data_summary.forEach(item => {
            let rate = data_rates_a.find(rate => rate.code === item.currency.code);       
            if(rate)
            {
                item.current_rate = rate.mid;
            }   else {
                rate = data_rates_b.find(rate => rate.code === item.currency.code);   
                if(rate)  
                {
                    item.current_rate = rate.mid;  
                } else{
                    item.current_rate = 0;
                }
            }       
        });

        setTransactions(data_transactions);
        setSummary(data_summary);
        console.log(data_transactions,data_summary);
    }

    useEffect(() => {
        fetch();
    }, [params]);


    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') updateParams({ name: search });
    };
    return (
    <>
        <TopCenter >
            <div className='xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0 space-y-4'>
            {summary && summary.length!=0 ? (
                <div>
                <Frame>
                    <div className='text-center mb-4'>
                        <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>TWOJE WALUTY - SUMA</h2>
                    </div>
                    <table className="table-auto min-w-full">
                        <thead>
                            <tr className='bg-emerald-100 text-gray-700 dark:bg-emerald-800 dark:text-gray-200 text-sm sm:text-base text-center' >
                                <th className='ps-3 pe-1 py-1 sm:px-6 sm:py-3 rounded-l-lg'>Nazwa</th>
                                <th className='ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Ilość</th>
                                <th className='ps-1 pe-3 py-1 sm:px-6 sm:py-3'>Wartość w PLN</th>
                                <th className='ps-1 pe-3 py-1 sm:px-6 sm:py-3 rounded-r-lg'></th>
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
                    <div className='flex flex-col sm:flex-row items-center justify-between mb-4'>
                        <Link to="/addMyCurrency">
                            <Plus
                                className="rounded-md border-1 border-gray-500 p-2 w-[40px] h-[40px]
                                    bg-emerald-100 hover:bg-emerald-400 hover:shadow-md
                                    dark:bg-gray-800 dark:hover:bg-emerald-600
                                    cursor-pointer"
                            />
                        </Link>

                        <h2 className='text-center text-emerald-800 dark:text-emerald-300 text-lg font-bold mx-4'>
                            WSZYSTKIE TRANSAKCJE
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
                                                params.order_by === "currency_name" ? "-currency_name" : "currency_name",
                                        })
                                    }
                                >
                                    <div className='flex flex-row items-center'>
                                        <div>Nazwa</div>
                                        {params.order_by === "currency_name" && <MoveUp size={14} />}
                                        {params.order_by === "-currency_name" && <MoveDown size={14} />}
                                    </div>
                                </th>
                                <th
                                    className='cursor-pointer px-1 py-1 sm:px-6 sm:py-3'
                                    onClick={() =>
                                        updateParams({
                                            order_by:
                                                params.order_by === "currency_code" ? "-currency_code" : "currency_code",
                                        })
                                    }
                                >
                                    <div className='flex flex-row items-center min-w-[50px]'>
                                        <div>Kod</div>
                                        {params.order_by === "currency_code" && <MoveUp size={14} />}
                                        {params.order_by === "-currency_code" && <MoveDown size={14} />}
                                    </div>
                                </th>
                                <th className='px-1 py-1 sm:px-6 sm:py-3'>Zmiana</th>
                                <th
                                    className='cursor-pointer px-1 py-1 sm:px-6 sm:py-3'
                                    onClick={() =>
                                        updateParams({
                                            order_by:
                                                params.order_by === "created_at" ? "-created_at" : "created_at",
                                        })
                                    }
                                >
                                    <div className='flex flex-row items-center'>
                                        <div>Data</div>
                                        {params.order_by === "created_at" && <MoveUp size={14} />}
                                        {params.order_by === "-created_at" && <MoveDown size={14} />}
                                    </div>
                                </th>
                                <th className='px-1 py-1 sm:px-6 sm:py-3'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.results.map((transaction, idx) => (
                                <tr key={idx} className="text-gray-700 dark:text-gray-100 border-b-1 border-emerald-500">
                                    <td className='ps-3 pe-1 py-1 sm:px-6 sm:py-4'>{transaction.currency.name}</td>
                                    <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{transaction.currency.code}</td>
                                    <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>
                                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                        </td>
                                    <td className='px-1 py-1 sm:px-6 sm:py-4 text-center'>{new Date(transaction.created_at).toLocaleString("pl-PL")}</td>
                                    <td className='text-center'>
                                        <div className='flex p-2'>
                                            <Link className='px-1' to={`/editMyCurrency/${transaction.id}`}>
                                                <PencilLine
                                                    className="rounded-md border-1 border-gray-500 p-1 w-[30px] h-[30px]
                                                        bg-orange-100 hover:bg-orange-400 hover:shadow-md
                                                        dark:bg-orange-900 dark:hover:bg-prange-600
                                                        cursor-pointer"
                                                    size={16}
                                                />
                                            </Link>
                                            <Link className='px-1' to={`/delMyCurrency/${transaction.id}`}>
                                                <Trash2
                                                    className="rounded-md border-1 border-gray-500 p-1 w-[30px] h-[30px]
                                                        bg-red-100 hover:bg-red-400 hover:shadow-md
                                                        dark:bg-red-950 dark:hover:bg-red-600
                                                        cursor-pointer"
                                                    size={16}
                                                />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        prev={transactions.prev}
                        next={transactions.next}
                        pages={transactions.number_of_pages}
                        current={transactions.current}
                        fetch={(params) => updateParams(params)}
                    />
                </Frame>
            ):(
                <LoadingFrame/>
            )}
            </div>
        </TopCenter>
    </>
    );
};

export default MyCurrenciesIndex;