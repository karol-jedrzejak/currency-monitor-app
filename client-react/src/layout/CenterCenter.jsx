import React from 'react';

const CenterCenter = ({ children }) => {
    return (
        <div className="flex-grow flex justify-center items-center">
            {children}
        </div>
    );
};

export default CenterCenter;