import React from 'react';

const TopCenter = ({ children }) => {
    return (
        <div className="flex-grow flex justify-center">
            <div className="pt-4 px-4 pb-8">
                {children}
            </div>
        </div>
    );
};

export default TopCenter;