//Next는 pages 폴더는 이름이 반드시 pages 폴더여야 함.
//pages 폴더 내 파일을 Next가 알아서 개별적인 페이지로 만들어 줌. 코드 스플릿팅된 컴포넌트로 만들어 줌.

//Next는 import React from 'react'; 필요 없음! 있어도 되고 없어도 되고
import React from 'react';
import { useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const Home = () => {
    const { me } = useSelector((state) => state.user);
    const { mainPosts } = useSelector((state) => state.post);

    return (
        <AppLayout>                     {/* 다른 레이아웃을 쓰고 싶으면 만들고 해당 레이아웃으로 감싸면 됨. */}
            { me && <PostForm /> }     {/* AppLayout 안쪽 부분이 children이 됨. */}
            { mainPosts.map((post) => <PostCard key={post.id} post={post} />) }    {/* index를 key로 쓰지 않는 것이 좋음. 특히 post가 순서가 바뀌거나 지워지거나 중간에 추가될 가능성이 있다면 더더욱. 바뀌지 않으면 크게 상관은 없음. */}
        </AppLayout>
    );
};

export default Home;