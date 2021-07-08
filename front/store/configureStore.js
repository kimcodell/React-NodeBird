import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, createStore, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
// import thunkMiddleware from 'redux-thunk';   //아래 middlewares 안에 thunkMiddleware 넣어주면 됨.
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers';
import rootSaga from '../sagas';

//이렇게 직접 만들어줄 수 있음.
const loggerMiddleware = ({dispatch, getState}) => (next) => (action) => {      //thunk는 3단 고차함수
    // if (typeof action === 'function') {     //원래 redux에서 action은 객체였는데 thunk에서는 함수
    //     return action(dispatch, getState);
    // }
    console.log(action);
    return next(action);    //(action)을 안써서 로그인 시도 시 reducer가 동작안하는 문제 있었음.
}

const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware, loggerMiddleware];
    const enhancer = process.env.NODE_ENV === 'production' ? compose(applyMiddleware(...middlewares)) : composeWithDevTools(applyMiddleware(...middlewares));
    const store = createStore(reducer, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga)
    return store;
};

const wrapper = createWrapper(configureStore, {debug: process.env.NODE_ENV === 'development'}); //두번째는 옵션 객체. debug가 true면 더 자세한 설명나옴.

export default wrapper;