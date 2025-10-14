
import { createContext,useState } from "react"

import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";

import Header from "./components/Header"
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";

import Register from "./components/Register";
import Login from "./components/Login";
import AuthProvider from "./AuthProvider";
import AllCurrencies from "./components/AllCurrencies";

const AppStateContext = createContext()

 function App() {

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
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppStateContext value={{darkTheme,changeTheme,menu,setMenu}}>
            <Header/>
            <Routes>
              <Route path="/" element={<Welcome/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/allCurrencies" element={<AllCurrencies/>} />
            </Routes>
            <Footer/>
          </AppStateContext>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
export {AppStateContext}
