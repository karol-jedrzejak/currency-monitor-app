import React from 'react';

const CenterCenter = ({ children,className }) => {
    return (
        <div className={`flex-grow flex justify-center items-center ${className || ''}`}>
            {children}
        </div>
    );
};

export default CenterCenter;