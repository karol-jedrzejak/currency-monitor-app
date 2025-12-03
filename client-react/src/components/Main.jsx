import { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import { AuthContext } from '../AuthProvider';

import Welcome from "../pages/Welcome";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AllCurrencies from "../pages/AllCurrencies";
import Countries from "../pages/Countries";
import Currency from "../pages/Currency";
import ErrorPage from "../pages/ErrorPage";
import TopCurrencies from "../pages/TopCurrencies";
import LoadingPage from "../pages/LoadingPage";
import BuySellRates from "../pages/BuySellRates";

import MyCurrenciesIndex from "../pages/MyCurrencies/Index";
import MyCurrenciesAdd from "../pages/MyCurrencies/Add";
import MyCurrenciesEdit from "../pages/MyCurrencies/Edit";
import MyCurrenciesDel from "../pages/MyCurrencies/Del";

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
              <Routes>
                {authData.user ? (
                  <>
                      <Route path="/powitanie" element={<Welcome/>} />
                      <Route path="/topCurrencies" element={<TopCurrencies/>} />
                      <Route path="/allCurrencies" element={<AllCurrencies/>} />
                      <Route path="/buySellRates" element={<BuySellRates/>} />
                      <Route path="/currency/*" element={<Currency/>} />
                      <Route path="/countries" element={<Countries/>} />
                      <Route path="/myCurrencies" element={<MyCurrenciesIndex />} />
                      <Route path="/addMyCurrency" element={<MyCurrenciesAdd />} />
                      <Route path="/editMyCurrency/*" element={<MyCurrenciesEdit/>} />
                      <Route path="/delMyCurrency/*" element={<MyCurrenciesDel/>} />
                  </>
                ):(
                  <>
                      <Route path="/powitanie" element={<Welcome/>} />
                      <Route path="/register" element={<Register/>} />
                      <Route path="/login" element={<Login/>} />
                  </>
                )}
                <Route path='*' element={<ErrorPage/>} />
              </Routes>
            </>
          )}
        </>
    );
};

export default Main;
