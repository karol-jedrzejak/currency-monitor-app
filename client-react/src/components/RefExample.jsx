import React from "react";
import { useState,useRef } from "react";

const RefExample = () => {
    const [name,setName] = useState("");
    const refElement = useRef('');
    const prevNameRef = useRef('');

    const clearText = () => {
        setName("");
        refElement.current.focus();
    }

    const setText = (txt) => {
        setName(txt);
    }

    const handleInput = (e) => {
        prevNameRef.current = name
        setName(e.target.value)
    }

    return (
        <>
        <div style={{paddingTop:"70px"}}>Use Ref Example</div>
        <div>
            Name: {name}
        </div>
        <div>
            Prev Name: {prevNameRef.current}
        </div>
        <div><input ref={refElement} type="text" value={name} onChange={handleInput}></input></div>
        <div><button onClick={() => clearText()}>Button</button></div>
        </>
        
    );
};

export default RefExample;