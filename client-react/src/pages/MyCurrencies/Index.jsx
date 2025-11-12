import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom"

import axios from 'axios';  
import axiosInstance from '../../axiosInstance';

import TopCenter from '../../layout/TopCenter';
import CenterCenter from '../../layout/CenterCenter';
import Frame from '../../components/Frame';

import LoadingFrame from '../../components/LoadingFrame';

const MyCurrenciesIndex = () => {

    const [transactions, setTransactions] = useState(null);
    const [summary, setSummary] = useState(null);

    const fetch = async () => {

        let data_transactions = [];
        let data_summary = [];

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
                <Frame>
                    {summary.map((item)=>
                        <div>
                            {item.currency.id}-{item.currency.name}-{item.currency.code}: {item.total_amount}
                        </div>
                    )}
                </Frame>
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