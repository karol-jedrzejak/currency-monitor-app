import React from 'react';
import { useEffect } from 'react';

import axiosInstance from '../axiosInstance';

import TopCenter from '../layout/TopCenter';
import Frame from '../components/Frame';

const AIPrediction = () => {

    const fetch = async () => {
        let url = '/stock_prediction/';
        try {
            const response = await axiosInstance.post(url,{
                ticker: "usd"
            })
            console.log(response.data);
;        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetch();
    }, []);


    return (
    <TopCenter>
        <Frame>
            Predykcja AI TEST
        </Frame>
    </TopCenter>
    );
};

export default AIPrediction;