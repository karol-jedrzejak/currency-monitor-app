import React from 'react';

const TopCenter = ({ children }) => {
    return (
        <div className="flex-grow flex justify-center">
            <div className="py-4 px-1 sm:pt-4 sm:px-4 sm:pb-8">
                {children}
            </div>
        </div>
    );
};

export default TopCenter;