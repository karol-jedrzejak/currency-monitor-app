import React from "react";
import { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import { AuthContext } from '../AuthProvider';

import Welcome from "../pages/Welcome";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AllCurrencies from "../pages/AllCurrencies";
import Countries from "../pages/Countries";
import Currency from "../pages/Currency";
import MyCurrencies from "../pages/MyCurrencies";
import AIPrediction from "../pages/AIPrediction";
import ErrorPage from "../pages/ErrorPage";
import TopCurrencies from "../pages/TopCurrencies";
import LoadingPage from "../pages/LoadingPage";
import BuySellRates from "../pages/BuySellRates";

const Main = () => {
  const authData = useContext(AuthContext);

    return (
        <>
          {authData.loadingUser ? (
              <>
                <LoadingPage/>
              </>
          ):(
            <>
            {authData.user ? (
              <Routes>
                  <Route path="/powitanie" element={<Welcome/>} />
                  <Route path="/topCurrencies" element={<TopCurrencies/>} />
                  <Route path="/allCurrencies" element={<AllCurrencies/>} />
                  <Route path="/buySellRates" element={<BuySellRates/>} />
                  <Route path="/currency/*" element={<Currency/>} />
                  <Route path="/countries" element={<Countries/>} />
                  <Route path="/myCurrencies" element={<MyCurrencies/>} />
                  <Route path="/aiPrediction" element={<AIPrediction/>} />
                  <Route path='*' element={<ErrorPage/>} />
              </Routes>
            ):(
              <Routes>
                  <Route path="/powitanie" element={<Welcome/>} />
                  <Route path="/register" element={<Register/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route path='*' element={<ErrorPage/>} />
              </Routes>
            )}
            </>
          )}
        </>
    );
};

export default Main;
