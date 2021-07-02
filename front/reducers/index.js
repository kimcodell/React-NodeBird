import { HYDRATE } from "next-redux-wrapper";

import user from './user'; 
import post from './post'; 
import { combineReducers } from "redux";

// const initialState = {
//     user: {
//     },
//     post: {
//     }
// }

//reducer는 (이전 상태, 액션) => 다음 상태
const rootReducer = combineReducers ({
    index: (state = {}, action) => {
        switch(action.type) {
            case HYDRATE:
                console.log(HYDRATE, action);
                return { ...state, ...action.payload };
            default:
                return state;
        }
    },
    user,   //combineReducers 로 user와 post를 합치는 거. 근데 ssr을 위한 HYDRATE를 추가하기 위해 index를 추가한 것.
    post,
});

export default rootReducer;