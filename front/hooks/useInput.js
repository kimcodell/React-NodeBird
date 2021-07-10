import { useState, useCallback } from "react";

// export default (initialValue = null) => {
//     const [value, setValue] = useState(initialValue);
//     const handler = useCallback((e) => {
//         setValue(e.target.value)
//     }, []);
//     return [value, handler];
// }

const useInput = (initialValue = null) => {
    const [value, setValue] = useState(initialValue);
    const handler = useCallback((e) => {
        setValue(e.target.value)
    }, []);
    return [value, handler, setValue];  //세번째 인자로 setState도 제공.
}

export default useInput;