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

const Main = () => {
  const authData = useContext(AuthContext);

    return (
        <>
          {authData.user ? (
            <Routes>
                <Route path='*' element={<ErrorPage/>} />
                <Route path="/powitanie" element={<Welcome/>} />
                <Route path="/allCurrencies" element={<AllCurrencies/>} />
                <Route path="/countries" element={<Countries/>} />
                <Route path="/currency/*" element={<Currency/>} />
                <Route path="/myCurrencies" element={<MyCurrencies/>} />
                <Route path="/aiPrediction" element={<AIPrediction/>} />
            </Routes>
          ):(
            <Routes>
                <Route path='*' element={<ErrorPage/>} />
                <Route path="/powitanie" element={<Welcome/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
          )}
        </>
    );
};

export default Main;
