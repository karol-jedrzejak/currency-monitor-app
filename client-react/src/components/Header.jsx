import { useState,useContext } from "react";
import { Sun, Moon, Menu, X ,Camera} from "lucide-react";
import { ThemeContext } from "../App";

const Header = () => {
  const themeData = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    console.log("toggle");
  };

  return (
    <nav className="relative w-full border-b border-gray-900 dark:border-gray-500 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Currency Monitor APP</span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#home" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">Strona główna</a>
          <a href="#kursy" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">Kursy walut</a>
          <a href="#kontakt" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">Kontakt</a>

          <button onClick={() => themeData.changeTheme()} className="p-2 rounded-full bg-gray-100 text-black dark:bg-gray-900 dark:text-gray-100">
            {themeData.darkTheme ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-primary dark:text-accent">
          {menuOpen ? <X size={28}/> : <Menu size={28}/>}
        </button>
      </div>

      {/* Mobile menu full screen */}
      {menuOpen && (
        <div className="fixed inset-0 bg-background-light dark:bg-background-dark flex flex-col items-center justify-center space-y-6 text-2xl">
          <a href="#home" onClick={() => setMenuOpen(false)} className="hover:text-primary dark:hover:text-accent">Strona główna</a>
          <a href="#kursy" onClick={() => setMenuOpen(false)} className="hover:text-primary dark:hover:text-accent">Kursy walut</a>
          <a href="#kontakt" onClick={() => setMenuOpen(false)} className="hover:text-primary dark:hover:text-accent">Kontakt</a>
          <button onClick={toggleDark} className="p-3 rounded-full bg-primary text-white dark:bg-accent dark:text-gray-900">
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
        </div>
      )}
    </nav>
    
  )
}

export default Header
