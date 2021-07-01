//공통된 내용은 pages 폴더 안의 _app.js에 작성.
//_app.js는 pages들의 공통 부분.
import React from 'react';
import propTypes from 'prop-types';
import Head from 'next/head';   //next에서 head를 수정하고 싶으면 이 컴포넌트를 이용.
import 'antd/dist/antd.css';

const NodeBird = ({ Component }) => {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>NodeBird</title>
            </Head>
            <Component />
        </>
    )
}

NodeBird.propTypes = {
    Component: propTypes.elementType.isRequired,
}

export default NodeBird;