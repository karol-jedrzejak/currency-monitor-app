
import { createContext,useState,useEffect } from "react"

import Head from "./learn/Head"
import Test from "./learn/Test"
import MemoExample from "./learn/MemoExample"
import ContextA from "./learn/ContextA"
import RefExample from "./learn/RefExample"
import CustomHookExample from "./learn/CustomHookExample"
import TestForm from "./learn/TestForm"

const StockContext = createContext()
const UserContext = createContext()

 function App() {

  useEffect(() => {
/*     const lastTheme = localStorage.theme;
    if (lastTheme !== null) {
      if(localStorage.theme === "dark")
      {
        setTheme("dark");
      } else {
        setTheme("");
      }
    } else {
      localStorage.theme = "light";
      setTheme("");
    } */
  }, []);

 const [user,setUser] = useState({name:"karol", logged:"yes"})
  let masa = "mass"
  let price = 100

 //const [theme,setTheme] = useState(localStorage.theme)

 const [theme, setTheme] = useState(() => {
    return localStorage.theme || "dark";
  });

  const changeTheme = () => {
     if (theme === "dark") {
      setTheme("");
      localStorage.theme = "light";
     } else{
      setTheme("dark");
      localStorage.theme = "dark";
     }
  }


  const getStock = (data) => {
    console.log(data);
  }

  return (
    <>
    <div
      className={`${theme ? "dark" : ""}`}
    >
      <Head/>
        {theme=="dark" ? (
            <div className="p-6 m-6  bg-red-600 text-red-100 dark:bg-black dark:text-white">Dark</div>
        ):(
            <div className="p-6 m-6 bg-white text-black dark:bg-red-600 dark:text-red-100">Light</div>
        )}
      {/* <div className="bg-amber-800 text-red-600 dark:bg-amber-300 dark:text-blue-700">test w app</div> */}
{/*       <Test mass={masa} getStock={getStock}/>
      <MemoExample />
      <StockContext value={{masa,price}}>
        <UserContext value={{user,setUser}}>
          <ContextA/>
        </UserContext>
      </StockContext> */}
      {/* <RefExample /> */}
      {/* <CustomHookExample/> */}
      {/* <TestForm/> */}
      <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => changeTheme()}>Switcxh</button>
     {/*  <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => localStorage.theme = "dark"}>Dark V1</button>
      <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => localStorage.theme = "light"}>light V1</button>
      <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => setTheme("dark")}>Dark V2</button>
      <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => setTheme("")}>light V2</button> */}
    </div>
    </>
  )
}

export default App
export {StockContext,UserContext}
