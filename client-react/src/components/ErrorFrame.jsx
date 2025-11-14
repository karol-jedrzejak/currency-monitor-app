import React from 'react';
import { TriangleAlert } from 'lucide-react';

const ErrorFrame = ({ text = "" }) => {
    return (
        <div className='bg-white dark:bg-gray-950 flex justify-center items-center p-6 shadow-md rounded-2xl'>
            <div className="text-red-600 p-2">{text}</div>
            <div className="text-red-600 p-2"><TriangleAlert size={48}/></div>
        </div>
    );
}

export default ErrorFrame;