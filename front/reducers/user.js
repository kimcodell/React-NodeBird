export const initialState = {
    isLoggingIn: false,     //로그인 시도 중
    isLoggedIn: false,
    isLoggingOut: false,    //로그아웃 시도 중
    me: null,
    signUpData: {},
    loginData: {},
}

export const loginRequestAction = (data) => {
    return {
        type: 'LOG_IN_REQUEST',
        data,
    }
}

// export const loginSuccessAction = (data) => {    //success, failure action은 saga에서 put에 해주고 있기 때문에 딱히 만들 필요 없음.
//     return {
//         type: 'LOG_IN_SUCCESS',
//         data,
//     }
// }

export const logoutRequestAction = () => {
    return {
        type: 'LOG_OUT_REQUEST'
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN_REQUEST':
            console.log('리듀서 로그인 시도');
            return {
                ...state,
                isLoggingIn: true,
            };
        case 'LOG_IN_SUCCESS': 
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: true,
                me: {...action.data, nickname: "codell" },
            };
        case 'LOG_IN_FAILURE': 
            return {
                ...state,
                isLoggingIn: false,
                // isLoggedIn: false,
            };
        case 'LOG_OUT_REQUEST':
            return {
                ...state,
                isLoggingOut: true,
            };
        case 'LOG_OUT_SUCCESS':
            return {
                ...state,
                isLoggingOut: false,
                isLoggedIn: false,
                me: null,
            };
        case 'LOG_OUT_FAILURE':
            return {
                ...state,
                isLoggingOut: false,
            };
        default:
            return state;
    }
}

export default reducer;