import { all, fork, put, delay, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function logInAPI(data) {
    return axios.post('/api/login', data)
}

//yeild를 굳이 쓰는 이유는 test할 때 한 단계씩 해볼 수 있기 때문.
function* logIn(action) {   //이렇게 매개변수를 써주면 watchLogIn의 LOG_IN_REQUEST action이 전달됨. 그러면 action의 data도 사용가능.
    try {
        console.log('사가 로그인 시도');
        yield delay(1000);
        console.log("1초 기다림");
        // const result = yield call(logInAPI, action.data);    //call을 fork로 하면 비동기라 결과와 관계없이 바로 다음으로 넘어감. logInAPI에 인수 넣고 싶으면 이렇게 펼쳐서 넣어야 함.
        //call, fork의 첫번째 인수 이후부터는 인자
        yield put({         //put은 dispatch
            type: 'LOG_IN_SUCCESS',
            data: action.data           //성공결과는 result.data에, 실패결과는 err.response.data에 담겨있음.
        });
    } catch(err) {
        yield put({
            type: 'LOG_IN_FAILURE',
            data: err.response.data
        })
    }
}

function logOutAPI() {
    return axios.post('/api/logout')
}

function* logOut() {
    try {
        yield delay(1000);
        // const result = yield call(logOutAPI);
        yield put({
            type: 'LOG_OUT_SUCCESS',
            // data: result.data
        });
    } catch(err) {
        yield put({
            type: 'LOG_OUT_FAILURE',
            data: err.response.data
        })
    }
}

function* watchLogIn() {
    yield takeLatest('LOG_IN_REQUEST', logIn);      //LOG_IN action이 실행되면 logIn 함수가 실행됨.
}

function* watchLogOut() {
    yield takeLatest('LOG_OUT_REQUEST', logOut);    //take는 LOG_OUT이라는 action이 실행될 때까지 기다리겠다 라는 것. 근데 take는 1회용이라 한번 실행되면 사라짐.
}                                                   //그래서 take를 while(true)로 감싸거나, takeEvery()를 사용. while은 동기적, takeEvery는 비동기적

export default function* userSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut)
    ]);
}