import React from "react";
import { useState,useMemo } from "react";

const MemoExample = () => {
    const [numbA,setNumbA] = useState(0);
    const [numbB,setNumbB] = useState(10);

    const incA = () => {
        setNumbA(numbA+1);
    }

    // Memo przydaje sie zeby w kazdym rerenderingu nie przejdzal i nie obliczal wartosci tej funkcji tylko zapamietal wynik
    const calcB = useMemo(() => {
        let sum = 0;
        for (let index = 1; index <= numbB; index++) {
            sum += index;            
        }
        console.log(sum);
        return sum;
    },[])

    console.log(`Sum of numbers from 1 to ${numbB} is: `, calcB);

    return (
        <>
        <div style={{paddingTop:"70px"}}>
            count: {numbA}
        </div>
        <div><button onClick={() => incA()}>Zwiększ A</button></div>

        </>
        
    );
};

export default MemoExample;