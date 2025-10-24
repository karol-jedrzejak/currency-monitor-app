import React from 'react';

const TopCenter = ({ children,classNameIn,classNameOut }) => {
    return (
        <div className={`flex-grow flex justify-center ${classNameOut || ''}`}>
            <div className={`py-4 px-1 sm:pt-4 sm:px-4 sm:pb-8 ${classNameIn || ''}`}>
                {children}
            </div>
        </div>
    );
};

export default TopCenter;