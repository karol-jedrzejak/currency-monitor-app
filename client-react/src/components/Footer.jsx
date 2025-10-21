import React from "react"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../AuthProvider";

const Footer = () => {
  const authData = useContext(AuthContext);

  return (
    <>
      <footer className="shadow-[0_-2px_1px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_1px_rgba(0,1,1,0.7)] w-full static bottom-0 dark:shadow-gray-800 bg-white dark:bg-gray-800 text-gray-950 dark:text-gray-50">
          <div className="w-full mx-auto max-w-screen-xl p-2">
            <ul className="flex flex-wrap sm:flex-row flex-col sm:justify-center items-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {authData.user ? ( 
                <> 
                  <li className="my-1">
                    <Link className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 me-4 md:me-6" to="/allCurrencies">Waluty</Link>
                  </li>
                  <li className="my-1">
                      <Link to="/currency" className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 me-4 md:me-6">Waluta</Link>
                  </li>
                  <li className="my-1">
                      <Link to="/countries" className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 me-4 md:me-6">Kraje</Link>
                  </li>
                  <li className="my-1">
                      <Link to="/aiPrediction" className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 me-4 md:me-6">Predykcja AI</Link>
                  </li>
                  <li className="my-1">
                      <Link to="/myCurrencies" className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 me-4 md:me-6">Moje Waluty</Link>
                  </li>
                  <li className="my-1">
                      <button onClick={() => authData.logout()} className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 me-4 md:me-6">Wyloguj</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="my-2">
                    <Link to="/register" className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 me-4 md:me-6">Rejestracja</Link>
                  </li>
                  <li className="my-2">
                    <Link to="/login" className="hover:underline hover:text-gray-900 dark:hover:text-gray-100 me-4 md:me-6">Login</Link>
                  </li>
                </>
              )}
            </ul>
            <div className="my-2 text-sm text-emerald-800 dark:text-emerald-500 text-center">Created by Karol Jędrzejak | 2025</div>
          </div>
      </footer>
    </>
  )
}

export default Footer
