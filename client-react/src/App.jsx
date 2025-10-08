import Head from "./components/Head"
import Test from "./components/Test"
import MemoExample from "./components/MemoExample"
import { createContext,useState } from "react"
import ContextA from "./components/ContextA"
import RefExample from "./components/RefExample"
import CustomHookExample from "./components/CustomHookExample"
import TestForm from "./components/TestForm"

const StockContext = createContext()
const UserContext = createContext()

 function App() {
 const [user,setUser] = useState({name:"karol", logged:"yes"})
  let masa = "mass"
  let price = 100

  const getStock = (data) => {
    console.log(data);
  }

  return (
    <>
      <Head/>
      <div className="bg-amber-800 text-red-600">test w app</div>
{/*       <Test mass={masa} getStock={getStock}/>
      <MemoExample />
      <StockContext value={{masa,price}}>
        <UserContext value={{user,setUser}}>
          <ContextA/>
        </UserContext>
      </StockContext> */}
      {/* <RefExample /> */}
      {/* <CustomHookExample/> */}
      <TestForm/>
    </>
  )
}

export default App
export {StockContext,UserContext}
