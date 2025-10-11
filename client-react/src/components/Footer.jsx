import React from "react"

const Footer = () => {
  return (
    <>
      <footer className="w-full static bottom-0 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-gray-50 pb-4">
          <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">Created by Karol Jędrzejak | 2025
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                  <a href="#" className="hover:underline me-4 md:me-6">Top</a>
              </li>
              <li>
                  <a href="#" className="hover:underline me-4 md:me-6">Waluty</a>
              </li>
              <li>
                  <a href="#" className="hover:underline me-4 md:me-6">Kontakt</a>
              </li>
          </ul>
          </div>
      </footer>
    </>
  )
}

export default Footer
