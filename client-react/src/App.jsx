
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";

import Header from "./components/Header"
import Footer from "./components/Footer";
import Main2 from "./components/Main2";

import AuthProvider from "./AuthProvider";
import AppStateProvider from "./AppStateProvider";


function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppStateProvider>
            <Header/>
            <Main2/>
            <Footer/>
          </AppStateProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
