import React from "react";
import { useState,useRef } from "react";
import useCustomHookExample from "./useCustomHookExample"
import image_example from '../assets/image_example.jpg'

const CustomHookExample = () => {

    const {count,inc,dec,rst} =useCustomHookExample(5)
    const [czyjest,setCzyjest] = useState(true)
    const test = "OK"
    const names = ['Adam','Jacek','Grzegorz']
    const profiles = [
        {
            name: "Grzegorz",
            age: 20,
            gender: "male"
        },
        {
            name: "Kasia",
            age: 76,
            gender: "female"
        },
        {
            name: "Antek",
            age: 46,
            gender: "male"
        },
        {
            name: "Ania",
            age: 18,
            gender: "female"
        }]
    const style={
        color:"red"
    }


    return (
        <>
        <style>
            {`
            .test{
            color:blue;
            margin:10px;
            }
            `}
        </style>
        <div className="test">Custom Hook</div>
        <div>Count = {count}</div>
        {count==5 ? (
            <div>Jest 5 :)</div>
        ):(
            <div>Nie ma 5 :(</div>
        )}
        {czyjest && (
            <div style={style}>TEST</div>
        )}
        <div><button onClick={inc}>INC</button></div>
        <div><button onClick={dec}>DEC</button></div>
        <div><button onClick={rst}>RST</button></div>
        <div>tu ma być ok - {test}</div>
        <div>
            <ul>
            {names.map((name,index)=>(
                <li key={index}>{name}</li>
            ))}
            </ul>
        </div>
        <div>
            <ul>
            {profiles.map((obj,index)=>{ return(
                <li key={index}>name: {obj.name}, age: {obj.age}, gender: {obj.gender};</li>
            )})}
            </ul>
        </div>
        <div>
            <img width="200px" src={image_example}/>
        </div>
        </>
        
    );
};

export default CustomHookExample;