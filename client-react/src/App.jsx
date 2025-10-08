
import { createContext,useState } from "react"

import Header from "./components/Header"
import Main from "./components/Main";
import Footer from "./components/Footer";

const ThemeContext = createContext()

 function App() {

 const [darkTheme, setDarkTheme] = useState(() => {
    if (localStorage.darkTheme !== null) {
      console.log("jest darkTheme")
      if (localStorage.darkTheme=="true")
      {
        document.documentElement.classList.add("dark");
        console.log("jest darkTheme true")
        return true;
      } else{
        console.log("jest darkTheme false")
        return false;
      }
    } else{
      console.log("nie ma darkTheme i jest set na false")
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
    <>
      <ThemeContext value={{darkTheme,changeTheme}}>
        <Header/>
        <Main/>
        <Footer/> 
      </ThemeContext>
    </>
  )
}

export default App
export {ThemeContext}
