import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';

import useInput from '../hooks/useInput';
import AppLayout from "../components/AppLayout";

const ErrorMessage = styled.div`
    color: red;
`;

const Signup = () => {
    const [id, onChangeId] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
    const [password, onChangePassword] = useInput('');
    
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setPasswordError(e.target.value !== password);
    }, [password])

    const [term, setTerm] = useState(false);
    const [termError, setTermError] = useState(false);
    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    })

    const onSubmit = useCallback(() => {
        if (password !== passwordCheck) {       //사용자에게 입력받는 부분은 여러 번 체크해도 무리가 아님.
            setPasswordError(true);
            return;
        }
        if (!term) {
            setTermError(true);
            return;
        }
        console.log(id, nickname, password);
    }, [id, password, passwordCheck, term]);

    return (
        <AppLayout>
            <Head>
                <title>회원가입 | NodeBird</title>
            </Head>
            <Form onFinish={onSubmit}>
                <div>
                    <label htmlFor="user-id">아이디</label><br/>
                    <Input name="user-id" value={id} required onChange={onChangeId}/>
                </div>
                <div>
                    <label htmlFor="user-nickname">닉네임</label><br/>
                    <Input name="user-nickname" value={nickname} required onChange={onChangeNickname}/>
                </div>
                <div>
                    <label htmlFor="user-password">비밀번호</label><br/>
                    <Input name="user-password" type="password" value={password} required onChange={onChangePassword}/>
                </div>
                <div>
                    <label htmlFor="user-password-check">비밀번호 체크</label><br/>
                    <Input name="user-password-check" type="password" value={passwordCheck} required onChange={onChangePasswordCheck}/>
                </div>
                {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
                <div>
                    <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>개인정보처리방침에 동의합니다.</Checkbox><br/>
                    {termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
                </div>
                <div style={{marginTop: 10}}>
                    <Button type='primary' htmlType="submit">가입하기</Button>
                </div>
            </Form>
        </AppLayout>
    )
}

export default Signup;