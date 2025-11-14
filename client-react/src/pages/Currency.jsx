import React from "react"
import { useEffect, useState } from 'react';

import formatDate_d_m_y from "../utilities/formatDate";

import axios from 'axios';  
import axiosInstance from '../axiosInstance';

import Frame from '../components/Frame';
import ErrorFrame from '../components/ErrorFrame';
import LoadingFrame from '../components/LoadingFrame';

import TopCenter from '../layout/TopCenter';
import CenterCenter from '../layout/CenterCenter';

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Currency = () => {
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [chartsOptions, setChartsOptions] = useState(null);

  const fetch = async (path_id) => {

    let data = {}

    // Currency Info
    let url_info = '/currencies/'+path_id;
    try {
      const response_info = await axiosInstance.get(url_info)
      data.info = response_info.data
    } catch (error) {
      setError("Błąd przy pobieraniu danych.");
    }

    if(data)
    {
      // Rates MID
      let url_rates_mid = 'https://api.nbp.pl/api/exchangerates/rates/'+data.info.table+'/'+data.info.code+'/last/255/';
      try {
        const response_rates_mid = await axios.get(url_rates_mid)
        data.rates_mid = response_rates_mid.data.rates
      } catch (error) {
         setError("Błąd przy pobieraniu danych.");
      }

      const CODES_FOR_C_TABLE = ['USD','AUD','CAD','EUR','HUF','CHF','GBP','JPY','CZK','DKK','NOK','SEK','XDR']
      if(CODES_FOR_C_TABLE.indexOf(data.info.code) > -1)
      {
        // Rates Trade
        let url_rates_trade = 'https://api.nbp.pl/api/exchangerates/rates/C/'+data.info.code+'/';
        try {
          const response_rates_trade = await axios.get(url_rates_trade)
          data.rates_trade = response_rates_trade.data.rates
        } catch (error) {
          setError("Błąd przy pobieraniu danych.");
        }
      }

      try {
          const response = await axiosInstance.post('/stock_prediction/',{
              ticker: data.info.code
          })
          if (response.data.status =="ok")
          {
            data.prediction = response.data.tomorrow_price;
          }
      } catch (error) {
          setError("Błąd przy pobieraniu danych.");
      }

      if(Object.hasOwn(data, "info") &&  Object.hasOwn(data, "rates_mid"))
      {

        data.percentage_change = calc_percentage(data.rates_mid[0].mid,data.rates_mid[data.rates_mid.length-1].mid)
        setCurrency(data);

        const chart_labels_mid = data.rates_mid.map(item => item.effectiveDate);
        
        const chart_data_mid = {
          labels: chart_labels_mid,
          datasets: [
            {
              label: data.info.code,
              data: data.rates_mid.map(item => item.mid),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        };

        const chart_options_mid = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Kurs MID',
            },
          },
          responsive:true,
          maintainAspectRatio:true,
          pointRadius: 1,
        };
    
        setChartsData(chart_data_mid);
        setChartsOptions(chart_options_mid)
      } else {
        setError("Błąd przy pobieraniu danych.");
      }
    } else {
       setError("Błąd przy pobieraniu danych.");
    }
  }

  const calc_percentage = (start,end) => {
    let percentage = (end/start-1)*100;
    return percentage.toFixed(2);
  }

  useEffect(() => {
      const path_id = location.pathname.split("/")[2];
      if(Number.isInteger(parseInt(path_id)))
      {
        fetch(path_id);      
      } else {
        setError("Błąd przy pobieraniu danych.");
      }
  }, []);

  return (
    <>
      {currency ? (
        <>
          <TopCenter classNameIn={"lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 space-y-4"}>
            <div>
              <Frame>
                <div className="text-center text-2xl font-semibold pb-8">{currency.info.code}</div>
                <div className="pb-4"><span className="font-semibold">Nazwa:</span> {currency.info.name}</div>
                <div><span className="font-semibold">Kod:</span> {currency.info.code}</div>
                <div className="pb-4"><span className="font-semibold">Tabela:</span> {currency.info.table}</div>
                <div className="pb-4"><span className="font-semibold">W ilu krajach:</span> {currency.info.countries.length}</div>
                <div className="pb-4"><span className="font-semibold">Aktualny kurs:</span> {currency.rates_mid[currency.rates_mid.length-1].mid} <span className="text-gray-500 italic text-xs">[z dnia {formatDate_d_m_y(currency.rates_mid[currency.rates_mid.length-1].effectiveDate)}]</span></div>
                {currency.info.table=="A" && (
                  <>
                    <div className="pb-4"><span className="font-semibold">Predykcja AI na jutro:</span> <span className="text-purple-600 dark:text-purple-300">{currency.prediction.toFixed(4)}</span></div>
                  </>
                )}
                <div className="pb-4"><span className="font-semibold">Zmiana w ostatnich 255 kursach:</span>
                  <span className={`${currency.percentage_change>0 ? 'text-green-500' : 'text-red-500'}`+" px-2"}>{currency.percentage_change}%</span>
                  <span className="text-gray-500 italic text-xs">[{formatDate_d_m_y(currency.rates_mid[0].effectiveDate)} do {formatDate_d_m_y(currency.rates_mid[currency.rates_mid.length-1].effectiveDate)}]</span>
                </div>
                {currency.rates_trade && (
                  <>
                    <div><span className="font-semibold">Kupno (NBP):</span> {currency.rates_trade[0].bid}</div>
                    <div><span className="font-semibold">Sprzedaż (NBP):</span> {currency.rates_trade[0].ask}</div>
                  </>
                )}
              </Frame>
            </div>
            <div>
              <Frame className="relative w-[100%]">
                <Line className="w-[100%]" options={chartsOptions} data={chartsData} />
              </Frame>
            </div>
            <div className="col-span-2">
              <Frame>
                <div className="text-center">Kraje:</div>
                <div className="flex fle-row flex-wrap align-middle">
                  {currency.info.countries.map((country, idx) => (
                    <span key={idx} className='p-1  text-xs'><img src={country.flag+'#svgView(preserveAspectRatio(none))'} className='w-[60px] h-[40px] lg:w-[100px] lg:h-[60px] border-1 border-gray-500 rounded-sm'/></span>
                  ))}
                </div>
              </Frame>
            </div>
          </TopCenter>
        </>
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
  )
}

export default Currency

