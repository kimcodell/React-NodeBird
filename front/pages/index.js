//Next는 pages 폴더는 이름이 반드시 pages 폴더여야 함.
//pages 폴더 내 파일을 Next가 알아서 개별적인 페이지로 만들어 줌. 코드 스플릿팅된 컴포넌트로 만들어 줌.

//Next는 import React from 'react'; 필요 없음! 있어도 되고 없어도 되고
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

    useEffect(() => {
        dispatch({
            type: LOAD_POSTS_REQUEST
        });
    }, []);

    useEffect(() => {
        function onScroll() {
            console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
            //scrollY: 현재 스크롤 위치, clientHeight: 한 화면 높이, scrollHeight: 맨 위 ~ 맨 아래. scrollY + clientHeight = scrollHeight.
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (hasMorePosts && !loadPostsLoading) {
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                    });
                };
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);     //useEffect에서 window 이벤트 넣었으면 마지막에 반드시 return으로 이벤트 없애줘야 함. 안 하면 계속 메모리에 쌓임.
        }
    }, [hasMorePosts, loadPostsLoading]);


    return (
        <AppLayout>                     {/* 다른 레이아웃을 쓰고 싶으면 만들고 해당 레이아웃으로 감싸면 됨. */}
            { me && <PostForm /> }     {/* AppLayout 안쪽 부분이 children이 됨. */}
            { mainPosts.map((post) => <PostCard key={post.id} post={post} />) }    {/* index를 key로 쓰지 않는 것이 좋음. 특히 post가 순서가 바뀌거나 지워지거나 중간에 추가될 가능성이 있다면 더더욱. 바뀌지 않으면 크게 상관은 없음. */}
        </AppLayout>
    );
};

export default Home;