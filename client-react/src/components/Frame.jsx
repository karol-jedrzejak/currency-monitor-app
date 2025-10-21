import React from 'react';

const Frame = ({ children }) => {
    return (
        <div className="
        text-gray-900 dark:text-gray-100
        p-6 rounded-2xl h-auto
        shadow-md dark:shadow-gray-950 
        bg-white dark:bg-gray-800 ">
            {children}
        </div>
    );
};

export default Frame;