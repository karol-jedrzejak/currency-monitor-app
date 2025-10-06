import React from 'react';
import { useState, useEffect } from 'react';

const h2Element = React.createElement("h2",null,"learn Element")

const Test = (props) => {
    const [num,numSet] = useState(0);
    const [stockPrice,setStockPrice] = useState({stock: "apple", price: 100})
    console.log(stockPrice);

    const handleClick = (param) => {
        let stock = "apple";
        props.getStock(stock);
    }

    const add = () => {
        let number = num;
        numSet(number+1);
    }

    const updateStockPrice = () => {
        setStockPrice({...stockPrice, price: 200})
    }

    useEffect(()=>{
        console.log("wywolano use effect")

        return ()=>{
            console.log("the cleanup function was called")
        }
    })


    return (
        <>
        {h2Element}
        <div>{props.mass}</div>
        <div><button onClick={() => handleClick("test")}>Click Me</button></div>
        <div><button onClick={() => props.getStock("tesla")}>Click Me</button></div>

        <div style={{paddingTop:"10px"}}><button onClick={() => add()}>Click Me</button></div>
        <div><button onClick={() => console.log(num)}>Click Me</button></div>

        <div style={{paddingTop:"10px"}}>Stock: {stockPrice.stock}, Price {stockPrice.price}</div>
        <div><button onClick={() => updateStockPrice()}>Click Me</button></div>
        </>
        
    );
};

export default Test;