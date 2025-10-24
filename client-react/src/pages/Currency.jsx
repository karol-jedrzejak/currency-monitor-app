import React from "react"

import axios from 'axios';  
import axiosInstance from '../axiosInstance';

import { useEffect, useState } from 'react';

import TopCenter from '../layout/TopCenter';
import Frame from '../components/Frame';

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
  const path_id = location.pathname.split("/")[2];
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [chartsOptions, setChartsOptions] = useState(null);

  const fetch = async (path_id) => {

/*     const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Add 1 to month
    const year = today.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate); */

    let data = {}

    // Currency Info
    let url_info = '/currencies_vs/'+path_id;
    try {
      const response_info = await axiosInstance.get(url_info)
      data.info = response_info.data
    } catch (error) {
      setError(true);
    }

    // Rates MID
    let url_rates_mid = 'https://api.nbp.pl/api/exchangerates/rates/'+data.info.table+'/'+data.info.code+'/last/255/';
    try {
      const response_rates_mid = await axios.get(url_rates_mid)
      data.rates_mid = response_rates_mid.data.rates
    } catch (error) {
      setError(true);
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
        setError(true);
      }
    }

    if(Object.hasOwn(data, "info") &&  Object.hasOwn(data, "rates_mid"))
    {
      setCurrency(data);
      console.log(data);

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
      
      setLoading(false);
      
    } else {
      setError(true);
    }

  }

  useEffect(() => {
      const path_id = location.pathname.split("/")[2];
      if(Number.isInteger(parseInt(path_id)))
      {
        fetch(path_id);      
      } else {
        setError(true);
      }

  }, []);

/*   if (!chartData) return <p>Brak danych do wyświetlenia.</p>;
 */
  return (
    <>
      <TopCenter classNameIn={"lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 space-y-4"}>
        {error ? (
          <>
          Błąd
          </>
          ) : (
          <>
            {loading ? (
              <>
                Ładowanie
              </>
              ) : (
              <>
                <Frame>
                  <div className="pb-4">Nazwa: {currency.info.name}</div>
                  <div>Kod: {currency.info.code}</div>
                  <div className="pb-4">Tabela: {currency.info.table}</div>
                  <div className="pb-4">W ilu krajach: {currency.info.countries.length}</div>
                  <div className="pb-4">Zmiana w ostatnich 255 dniach: {currency.rates_mid[0].mid - currency.rates_mid[currency.rates_mid.length-1].mid}</div>
                  {currency.rates_trade && (
                    <>
                      <div>Kupno (NBP): {currency.rates_trade[0].bid}</div>
                      <div>Sprzedaż (NBP): {currency.rates_trade[0].ask}</div>
                    </>
                  )}
                </Frame>
                <Frame className="relative w-[100%]">
                  <Line className="w-[100%]" options={chartsOptions} data={chartsData} />
                </Frame>
                <Frame className="col-span-2">
                  <div className="text-center">Kraje:</div>
                  <div className="flex fle-row flex-wrap align-middle">
                    {currency.info.countries.map((country, idx) => (
                      <span key={idx} className='p-1  text-xs'><img src={country.flag+'#svgView(preserveAspectRatio(none))'} className='w-[60px] h-[40px] lg:w-[100px] lg:h-[60px] border-1 border-gray-500 rounded-sm'/></span>
                    ))}
                  </div>
                </Frame>
              </>
            )}
          </>
        )}
      </TopCenter>
    </>
  )
}

export default Currency

//className="max-w-[600px] min-w-[400px] min-h-[200px] max-h-[400px]"