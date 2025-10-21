import { useState,useContext } from "react";
import { Sun, Moon, Menu, X , BadgeCent } from "lucide-react";
import { AppStateContext } from "../AppStateProvider";
import { AuthContext } from "../AuthProvider";
import { Link } from "react-router-dom"
import { useLocation } from 'react-router'

const Header = () => {
  const appState = useContext(AppStateContext);
  const authData = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { hash, pathname, search } = location;

  const activeClass = "text-sm font-medium px-3 py-2 rounded-xl text-gray-700 hover:text-gray-900 bg-emerald-100 border-1 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-300 hover:shadow-md dark:text-gray-300 dark:bg-gray-900 dark:hover:text-gray-900 dark:hover:bg-emerald-500 dark:hover:shadow-md dark:shadow-emerald-900";
  const notActiveClass = "text-sm font-medium px-3 py-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-emerald-300 hover:shadow-md dark:text-gray-300 dark:hover:text-gray-900 dark:hover:bg-emerald-500 dark:hover:shadow-md dark:shadow-emerald-900";

  return (
    <nav className="relative w-full z-50 shadow-md dark:shadow-gray-950 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/powitanie">
          <div className="flex font-medium items-center space-x-2"><span></span>
            <BadgeCent className="text-emerald-500  drop-shadow-lg" size={24} /> 
            <span className="text-xl text-slate-800 dark:text-slate-200 m-0">Currency</span><span className="text-xl text-emerald-500 dark:text-emerald-500">Monitor</span>
            <span className="text-xl text-slate-800 dark:text-slate-200"> APP</span>
          </div>
        </Link>
        
        {/* Desktop menu */}
        <div className="hidden lg:flex items-center space-x-6">
            {authData.user ? ( 
              <> 
                <Link to="/allCurrencies" className={(pathname=="/allCurrencies" ? activeClass : notActiveClass)}>Waluty</Link>
                <Link to="/currency" className={(pathname=="/currency" ? activeClass : notActiveClass)}>Waluta</Link>
                <Link to="/countries" className={(pathname=="/countries" ? activeClass : notActiveClass)}>Kraje</Link>
                <Link to="/aiPrediction" className={(pathname=="/aiPrediction" ? activeClass : notActiveClass)}>Predykcja AI</Link>
                <Link to="/myCurrencies" className={(pathname=="/myCurrencies" ? activeClass : notActiveClass)}>Moje Waluty</Link>
                <button className="
                    cursor-pointer
                    text-sm font-medium
                    px-3 py-2
                    rounded-xl
                    text-gray-700 
                    hover:text-gray-900 hover:bg-emerald-300 hover:shadow-md
                    dark:text-gray-300 
                    dark:hover:text-gray-900 dark:hover:bg-emerald-500 dark:hover:shadow-md dark:shadow-emerald-900
                " onClick={() => authData.logout()}>Wyloguj</button>
              </>
            ) : (
              <>
                <Link to="/register" className={(pathname=="/register" ? activeClass : notActiveClass)}>Rejestracja</Link>
                <Link to="/login" className={(pathname=="/login" ? activeClass : notActiveClass)}>Zaloguj</Link>
              </>
            )}
          {/* Theme switch */}
          <div className="inline-flex items-stretch p-2 rounded-xl">
            <button onClick={() => appState.changeTheme()} className="
              p-2 cursor-pointer rounded-xl
              text-gray-700
              hover:text-gray-900 hover:bg-emerald-300 hover:shadow-md
              dark:text-gray-300 
              dark:hover:text-gray-900 dark:hover:bg-emerald-500 dark:hover:shadow-md dark:shadow-emerald-900">
              {appState.darkTheme ? <Sun size={24}/> : <Moon size={24}/>}
            </button>
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="flex space-x-4 lg:hidden">
          <button onClick={() => appState.changeTheme()} className="rounded-full bg-primary text-gray-900 dark:bg-accent dark:text-gray-100 cursor-pointer">
                {appState.darkTheme ? <Sun size={24}/> : <Moon size={24}/>}
              </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-800 dark:text-slate-200 cursor-pointer">
            {menuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu full screen */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-gray-50 flex flex-col items-center justify-center space-y-6 text-2xl">
          <div  className="absolute top-[14px] right-6 flex space-x-4">
            <button onClick={() => appState.changeTheme()} className="rounded-full bg-primary text-gray-900 dark:bg-accent dark:text-gray-100 cursor-pointer">
              {appState.darkTheme ? <Sun size={24}/> : <Moon size={24}/>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-800 dark:text-slate-200 cursor-pointer">
              {menuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
          {authData.user ? ( 
            <>
              <Link to="/allCurrencies" onClick={() => setMenuOpen(false)} className="">Waluty</Link>
              <Link to="/currency" onClick={() => setMenuOpen(false)} className="">Waluta</Link>
              <Link to="/countries" onClick={() => setMenuOpen(false)} className="">Kraje</Link>
              <Link to="/aiPrediction" onClick={() => setMenuOpen(false)} className="">Predykcja AI</Link>
              <Link to="/myCurrencies" onClick={() => setMenuOpen(false)} className="">Moje Waluty</Link>
              <button className="cursor-pointer" onClick={() => {
                setMenuOpen(false);
                authData.logout();
              }}>Wyloguj</button>
            </>
          ) : (
            <> 
              <Link to="/login" onClick={() => setMenuOpen(false)} className="">Zaloguj</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="">Rejestracja</Link>
            </>
            )}
        </div>
      )}
    </nav>
    
  )
}

export default Header
