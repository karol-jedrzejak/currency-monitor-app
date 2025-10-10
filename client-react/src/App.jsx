
import { createContext,useState } from "react"

import Header from "./components/Header"
import Main from "./components/Main";
import Footer from "./components/Footer";

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
      <AppStateContext value={{darkTheme,changeTheme,menu,setMenu}}>
        <Header/>
        <Main/>
        <Footer/>
      </AppStateContext>
    </>
  )
}

export default App
export {AppStateContext}
