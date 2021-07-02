import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, createStore, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from '../reducers';

const configureStore = () => {
    const middlewares = [];
    const enhancer = process.env.NODE_ENV === 'production' ? compose(applyMiddleware(...middlewares)) : composeWithDevTools(applyMiddleware(...middlewares));
    const store = createStore(reducer, enhancer);
    return store;
};

const wrapper = createWrapper(configureStore, {debug: process.env.NODE_ENV === 'development'}); //두번째는 옵션 객체. debug가 true면 더 자세한 설명나옴.

export default wrapper;