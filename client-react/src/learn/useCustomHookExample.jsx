import { useState } from 'react';

function useCustomHookExample(initVal=0)
{
    const [count,setCount] = useState(initVal)

    const inc = () => {setCount(count+1)}
    const dec = () => {setCount(count-1)}
    const rst = () => {setCount(initVal)}

    return {count,inc,dec,rst}
};

export default useCustomHookExample;