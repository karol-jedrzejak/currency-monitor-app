import React from "react";
import ContextB from "./ContextB";

const ContextA = () => {

    return (
        <>
            <div style={{paddingTop:"100px"}}>Context A</div>
            <ContextB/>
        </>
        
    );
};

export default ContextA;