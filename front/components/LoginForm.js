import React, { useCallback, useState } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { loginACtion } from '../reducers/user';
import useInput from '../hooks/useInput';


const ButtonWrapper = styled.div`
    margin-top: 10px;
`

const FormWrapper = styled(Form)`
    padding: 10px;
`

const LoginForm = () => {
    const dispatch = useDispatch();
    const [id, onChangeId] = useInput('');      //커스텀 훅 사용
    const [password, onChangePassword] = useInput('');

    const onSubmitForm = useCallback(() => {
        //preventDefault 이미 적용되어 있음.
        console.log(id, password);
        dispatch(loginACtion({ id, password }));
    }, [id, password]);

    return (
        <FormWrapper onFinish={onSubmitForm}>     {/* submit 타입일 때는 onFinish 필요*/}
            <div>
                <label htmlFor='user-id'>아이디</label>
                <br/>
                <Input name="user-id" value={id} onChange={onChangeId} required/>
            </div>
            <div>
                <label htmlFor='user-password'>비밀번호</label>
                <br/>
                <Input name="user-password" type="password" value={password} onChange={onChangePassword} required/>
            </div>
            {/* 그냥 <div style={{marginTop: '10px'}}> 이렇게 쓰면 style을 쓴 객체가 렌더링할 때 변경된 것으로 인식되어서 여기도 리렌더링 됨.
            따라서 styled-components 사용. 만약 쓰기 싫으면 useMemo로 style값 기억 */}
            <ButtonWrapper>
                <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </ButtonWrapper>
        </FormWrapper>
    )
}

export default LoginForm;