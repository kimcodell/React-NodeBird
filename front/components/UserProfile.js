import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';  
import { Card, Avatar, Button } from 'antd';

import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { me, isLoggingOut } = useSelector(state => state.user);

    const onLogOut = useCallback(() => {
        dispatch(logoutRequestAction());
    }, []);


    return (
        <Card
            actions={[
                <div key='twit'>짹짹<br/>0</div>,
                <div key='followings'>팔로잉<br/>0</div>,
                <div key='followers'>팔로워<br/>0</div>
            ]}
        >
            <Card.Meta
                avatar={<Avatar>{me.nickname[0]}</Avatar>}
                title={me.nickname}
            />
            <Button onClick={onLogOut} loading={isLoggingOut}>로그아웃</Button>     {/* loading이 true면 로딩 버튼으로 됨.*/}
        </Card>
    );
}

export default UserProfile;