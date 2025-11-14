import React from "react"

import TopCenter from '../layout/TopCenter';
import Frame from '../components/Frame';

import { BadgeCent } from "lucide-react";

const Welcome = () => {
  return (
    <>
        <TopCenter>
            <Frame>
                <div className="max-w-[800px] p-2 sm:p-0">
                    <div className="flex font-medium items-center space-x-2 pb-4">
                        <BadgeCent className="text-emerald-500  drop-shadow-lg" size={24} /> 
                        <span className="text-xl text-slate-800 dark:text-slate-200 m-0">Currency</span><span className="text-xl text-emerald-500 dark:text-emerald-500">Monitor</span>
                        <span className="text-xl text-slate-800 dark:text-slate-200"> APP</span>
                    </div>
                    <div className="indent-8 pt-4">
                        Serdecznie witam państwa na stronie internetowej "CurrencyMonitor APP". Jest to strona do śledzenia kursów walut jak również predykcji przyszłych kursów walut dzięki wykorzystaniu sztucznej inteligenji. Strona została stworzona z użyciem technologi i narzędzi takich jak: python, django, postresql, react, tailwind.
                    </div>
                    <div className="text-right pr-8 pt-4 text-gray-900 dark:text-gray-100"><b>Pozdrawiam</b></div>
                    <div className="text-right pr-8 text-emerald-900 dark:text-emerald-700"><b>Karol Jędrzejak</b></div>
                    <div className="text-right pr-8 text-gray-800 dark:text-gray-500 hover:text-emerald-500"><a href="mailto:karol.jedrzejak@gmail.com">karol.jedrzejak@gmail.com</a></div>
                </div>
            </Frame>
        </TopCenter>
    </>
  )
}

export default Welcome
