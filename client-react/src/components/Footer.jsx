import React from "react"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../AuthProvider";

const Footer = () => {
  const authData = useContext(AuthContext);

  return (
    <>
      <footer className="shadow-[0_-2px_1px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_1px_rgba(0,1,1,0.7)] w-full static bottom-0 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-gray-50 pb-4 border-t border-emerald-700 dark:border-emerald-300">
          <div className="w-full mx-auto max-w-screen-xl p-4 xl:flex xl:items-center xl:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">Created by Karol Jędrzejak | 2025
          </span>
          <ul className="flex flex-wrap sm:flex-row flex-col sm:items-center items-left mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 mt-3 xl:mt-0">
            {authData.user ? ( 
              <> 
                <li className="sm:my-0 my-2">
                  <Link className="hover:underline me-4 md:me-6" to="/allCurrencies">Waluty</Link>
                </li>
                <li className="sm:my-0 my-2">
                    <Link to="/currency" className="hover:underline me-4 md:me-6">Waluta</Link>
                </li>
                <li className="sm:my-0 my-2">
                    <Link to="/countries" className="hover:underline me-4 md:me-6">Kraje</Link>
                </li>
                <li className="sm:my-0 my-2">
                    <Link to="/aiPrediction" className="hover:underline me-4 md:me-6">Predykcja AI</Link>
                </li>
                <li className="sm:my-0 my-2">
                    <Link to="/myCurrencies" className="hover:underline me-4 md:me-6">Moje Waluty</Link>
                </li>
                <li className="sm:my-0 my-2">
                    <button onClick={() => authData.logout()} className="hover:underline me-4 md:me-6">Wyloguj</button>
                </li>
              </>
            ) : (
              <>
                <li className="sm:my-0 my-2">
                  <Link to="/register" className="hover:underline me-4 md:me-6">Rejestracja</Link>
                </li>
                <li className="sm:my-0 my-2">
                  <Link to="/login" className="hover:underline me-4 md:me-6">Login</Link>
                </li>
              </>
            )}
          </ul>
          </div>
      </footer>
    </>
  )
}

export default Footer
