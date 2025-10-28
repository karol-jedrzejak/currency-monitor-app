import React from 'react';
import { Loader } from 'lucide-react';

const LoadingFrame = () => {
    return (
        <div className='bg-white dark:bg-gray-800 flex justify-center items-center p-6 shadow-md rounded-2xl'>
            <div className="text-emerald-800 dark:text-emerald-300 p-2">Ładowanie</div>
            <div className="text-emerald-800 dark:text-emerald-300 p-2"><Loader size={48}/></div>
        </div>
    );
}

export default LoadingFrame;