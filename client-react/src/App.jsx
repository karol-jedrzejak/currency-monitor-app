
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";

import Header from "./components/Header"
import Footer from "./components/Footer";
import Main from "./components/Main";

import AuthProvider from "./AuthProvider";
import AppStateProvider from "./AppStateProvider";


function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppStateProvider>
            <Header/>
            <Main/>
            <Footer/>
          </AppStateProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
