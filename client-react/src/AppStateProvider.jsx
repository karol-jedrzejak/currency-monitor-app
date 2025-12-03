import { createContext, useState } from 'react';

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

    return (
        <AppStateContext.Provider value={{ darkTheme,changeTheme }}>
            {children}
        </AppStateContext.Provider>
    );
};

export default AppStateProvider;
export { AppStateContext };