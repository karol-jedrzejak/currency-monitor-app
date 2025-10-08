import { useContext } from "react";
import React from "react";
import { StockContext, UserContext } from "../App";

const ContextB = () => {
    const StockData= useContext(StockContext);
    const UserData= useContext(UserContext);

    return (
        <>
            <div style={{marginTop:"20px"}}>Context B</div>
            <div>varName - {StockData.masa}, Price = {StockData.price}</div>
            <div>User : {UserData.user.name}</div>
        </>
        
    );
};

export default ContextB;