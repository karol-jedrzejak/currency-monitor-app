import Head from "./components/Head"
import Test
 from "./components/Test"

 
function App() {
  let masa = "mass"

  const getStock = (data) => {
    console.log(data);
  }

  return (
    <>
      <Head/>
      <div>test w app</div>
      <Test mass={masa} getStock={getStock}/>
    </>
  )
}

export default App
