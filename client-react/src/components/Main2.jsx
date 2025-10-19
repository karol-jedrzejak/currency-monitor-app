import React from "react";
import { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import { AuthContext } from '../AuthProvider';

import Welcome from "../pages/Welcome";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AllCurrencies from "../pages/AllCurrencies";
import ErrorPage from "../pages/ErrorPage";

const Main2 = () => {
  const isLoggedIn = useContext(AuthContext);

    return (
        <>
            {isLoggedIn.user ? (
                <Routes>
                    <Route path='*' element={<ErrorPage/>} />
                    <Route path="/" element={<Welcome/>} />
                    <Route path="/allCurrencies" element={<AllCurrencies/>} />
                </Routes>
              ):(
                <Routes>
                    <Route path='*' element={<ErrorPage/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login/>} />
                </Routes>
              )}
        </>
    );
};

export default Main2;