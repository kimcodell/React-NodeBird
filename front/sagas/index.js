import { all, fork } from 'redux-saga/effects';

import postSaga from './post';
import userSaga from './user';

// function* watchLogIn() {
//     yield takeLatest('LOG_IN_REQUEST', logIn);    //LOG_IN action이 실행되면 logIn 함수가 실행됨.
// }

// function* watchLogOut() {
//     yield takeLatest('LOG_OUT_REQUEST', logOut); //take는 LOG_OUT이라는 action이 실행될 때까지 기다리겠다 라는 것. 근데 take는 1회용이라 한번 실행되면 사라짐.
// }                                                //그래서 take를 while(true)로 감싸거나, takeEvery()를 사용. while은 동기적, takeEvery는 비동기적

// function* watchAddPost() {
//     yield throttle('ADD_POST_REQUEST', addPost, 3000);  //takeEvery는 여러번 클릭하면 클릭한 수만큼 실행됨. takeLatest는 동시에 여러번 클릭해도 가장 마지막 것만 인식(실행). 이미 완료된 걸 취소하진 않음.
// }                                                       //but, takeLatest는 응답만 취소하는 거지 요청까지 취소하진 않음. 즉, 백엔드 서버에는 데이터가 2번 들어갈 수 있음.
//                                                         //takeLeading은 여러번 클릭해도 가장 첫번째 것만 인식(실행).
//                                                         //따라서 throttle을 쓰면 한번 요청하면 지정한 시간 동안은 요청X.
//                                                         //보통은 takeLatest를 씀. 

//reducer는 쪼개면 combine을 해야했지만 saga는 combine 안해도 됨.
export default function* rootSaga() {
    yield all([     //all은 배열을 받음. 배열 안에 있는 것들을 한번에 모두 실행.
        fork(postSaga),   //fork는 해당 함수를 실행.
        fork(userSaga),  //fork 대신 call로 실행도 가능. fork와 call은 차이점이 있음. fork는 비동기적 실행(논 블로킹), call은 동기적 실행(블로킹).
    ])
}