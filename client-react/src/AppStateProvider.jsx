import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Axis3D } from 'lucide-react';
import axiosInstance from './axiosInstance';

// Create the Auth Context
const AppStateContext = createContext();

// AuthProvider component
const AppStateProvider = ({ children }) => {

    const [darkTheme, setDarkTheme] = useState(() => {
        if (localStorage.darkTheme !== null) {
            if (localStorage.darkTheme=="true")
            {
                document.documentElement.classList.add("dark");
                return true;
            } else{
                return false;
            }
        } else{
            localStorage.darkTheme=false;
            return false;
        }
    });

    const changeTheme = () => {
        if (darkTheme===true) {
            setDarkTheme(false);
            localStorage.darkTheme = false;
        } else{
            setDarkTheme(true);
            localStorage.darkTheme = true;
        }
        document.documentElement.classList.toggle("dark")
    }

    const [menu, setMenu] = useState({
        name: "Top",
        active: true,
        link: "#Top"
    },
    {
        name: "Waluty",
        active: false,
        link: "#Waluty"
    },
    {
        name: "Moje Waluty",
        active: false,
        link: "#MojeWaluty"
    });

    return (
        <AppStateContext.Provider value={{ darkTheme,changeTheme,menu,setMenu }}>
            {children}
        </AppStateContext.Provider>
    );
};

export default AppStateProvider;
export { AppStateContext };