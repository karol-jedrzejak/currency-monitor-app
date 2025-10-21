import React, { useState } from "react";
import { ChevronRight,ChevronLeft,ChevronLast,ChevronFirst } from "lucide-react";

const Pagination = ({pages,current,fetch}) => {
    


    const normal = "border-1 border-gray-800 dark:border-gray-100 rounded-md text-gray-700 hover:text-gray-900 hover:bg-emerald-300 hover:shadow-md dark:text-gray-300 dark:hover:text-gray-900 dark:hover:bg-emerald-500 dark:hover:shadow-md dark:shadow-emerald-900 cursor-pointer w-[26px] h-[26px] flex justify-center items-center";
    const active = "border-1 border-emerald-800 dark:border-gray-100 rounded-md text-gray-700 hover:text-gray-900 hover:bg-emerald-300 hover:shadow-md dark:text-gray-300 dark:hover:text-gray-900 dark:hover:bg-emerald-500 dark:hover:shadow-md dark:shadow-emerald-900 cursor-pointer w-[26px] h-[26px] flex justify-center items-center bg-emerald-200 dark:bg-emerald-800";
    const disabled = "border-1 border-gray-800 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-400 dark:shadow-emerald-900 w-[26px] h-[26px] flex justify-center items-center bg-gray-200 dark:bg-gray-800 cursor-not-allowed opacity-50";
    const dots = "rounded-md text-gray-900 dark:text-gray-400 dark:shadow-emerald-900 w-[26px] h-[26px] flex justify-center items-center opacity-50";
    
    return (
        <div className="flex items-center space-x-2 w-full justify-center mt-4">
            <button onClick={current > 1 ? () => fetch({page_num: 1}): null} className={(current > 1 ? normal : disabled)}>
                <ChevronFirst size={24} /> 
            </button>
            <button onClick={current >1  ? () => fetch({page_num: current-1}) : null} className={(current > 1 ? normal : disabled)}>
                <ChevronLeft size={24} /> 
            </button>
        {current-3 >= 1 && (
            <>
            <div className={dots}>
                ...
            </div>
            </>
        )}
        {current-2 >= 1 && (
            <>
            <button onClick={() => fetch({page_num: current-2})} className={normal}>
                {current-2}
            </button>
            </>
        )}
        {current-1 >= 1 && (
            <>
            <button onClick={() => fetch({page_num: current-1})} className={normal}>
                {current-1}
            </button>
            </>
        )}
        <button onClick={() => fetch({page_num: current})} className={active}>
            {current}
        </button>
        {current+1 <= pages && (
            <>
            <button onClick={() => fetch({page_num: current+1})} className={normal}>
                {current+1}
            </button>
            </>
        )}
        {current+2 <= pages && (
            <>
            <button onClick={() => fetch({page_num: current+2})} className={normal}>
                {current+2}
            </button>
            </>
        )}
        {current+3 <= pages && (
            <>
            <div className={dots}>
                ...
            </div>
            </>
        )}
            <button onClick={current < pages ? () => fetch({page_num: current+1}) : null} className={(current < pages ? normal : disabled)}>
                <ChevronRight size={24} />
            </button>
            <button onClick={current < pages ? () => fetch({page_num: pages}) : null} className={(current < pages ? normal : disabled)}>
                <ChevronLast size={24} />
            </button>
        </div>
    );
}

export default Pagination;
