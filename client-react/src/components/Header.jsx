import { useState,useContext } from "react";
import { Sun, Moon, Menu, X , BadgeCent } from "lucide-react";
import { AppStateContext } from "../App";

const Header = () => {
  const appState = useContext(AppStateContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = ["Top","Waluty","Kontakt"]

  return (
    <nav className="relative w-full border-b border-gray-900 dark:border-gray-100 z-50 shadow-md dark:shadow-gray-800">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex font-medium items-center space-x-2">
          <BadgeCent className="text-emerald-800 dark:text-emerald-500" size={24} /> 
          <span className="text-xl  text-slate-800 dark:text-slate-200">Currency Monitor APP</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
            {menu.map((name)=>(
                <a key={name} href={"#"+name} className="
                text-sm font-medium
                px-3 py-2
                rounded-xl
                text-gray-700 
                hover:text-gray-900 hover:bg-emerald-300 hover:shadow-md
                dark:text-gray-300 
                dark:hover:text-gray-900 dark:hover:bg-emerald-500 dark:hover:shadow-md dark:shadow-emerald-900">{name}</a>
            ))}

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
        <div className="flex space-x-4 md:hidden">
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
        <div className="md:hidden fixed inset-0 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-gray-50 flex flex-col items-center justify-center space-y-6 text-2xl">
          <div  className="absolute top-[14px] right-6 flex space-x-4">
            <button onClick={() => appState.changeTheme()} className="rounded-full bg-primary text-gray-900 dark:bg-accent dark:text-gray-100 cursor-pointer">
              {appState.darkTheme ? <Sun size={24}/> : <Moon size={24}/>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-800 dark:text-slate-200 cursor-pointer">
              {menuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
          <a href="#home" onClick={() => setMenuOpen(false)} className="hover:text-primary dark:hover:text-accent">Strona główna</a>
          <a href="#kursy" onClick={() => setMenuOpen(false)} className="hover:text-primary dark:hover:text-accent">Kursy walut</a>
          <a href="#kontakt" onClick={() => setMenuOpen(false)} className="hover:text-primary dark:hover:text-accent">Kontakt</a>
        </div>
      )}
    </nav>
    
  )
}

export default Header
