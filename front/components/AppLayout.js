//component 폴더는 이름 강제 아님. 이 폴더에 component들 담으면 됨.
import React, { useState } from "react";
import propTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";
import styled from "styled-components";

import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';

const SearchInput = styled(Input.Search)`
    vertical-align: middle;
`

const AppLayout = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <>
            <Menu mode="horizontal">
                <Menu.Item key="home">
                    <Link href="/"><a>노드버드</a></Link>
                </Menu.Item>
                <Menu.Item key="profile">
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item key="mail">
                    <SearchInput enterButton/>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>                {/* 각 요소별 간격 = gutter */}
                <Col xs={24} md={6}>       {/* xs는 모바일, sm는 태블릿, md는 작은 데스크탑 */}
                    {isLoggedIn ? <UserProfile setIsLoggedIn={setIsLoggedIn}/> : <LoginForm setIsLoggedIn={setIsLoggedIn}/>}
                </Col>
                <Col xs={24} md={12}>       {/* antd는 한 줄이 24칸으로 구성. 24면 100% 차지, 12면 50% 차지, 6이면 25% 차지. 합계가 24가 넘으면 다음 줄*/}
                    {children}
                </Col>
                <Col xs={24} md={6}>       {/* 지금 같은 경우는 모바일일 때는  */}
                    <a href="https://www.zerocho.com" target="_blank" rel="noreferrer noopener">제로초 블로그 참조</a>
                </Col>
            </Row>
        </>
    );
}

AppLayout.propTypes = {
    children: propTypes.node.isRequired,

};

export default AppLayout;