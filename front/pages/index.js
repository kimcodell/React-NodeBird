//Next는 pages 폴더는 이름이 반드시 pages 폴더여야 함.
//pages 폴더 내 파일을 Next가 알아서 개별적인 페이지로 만들어 줌. 코드 스플릿팅된 컴포넌트로 만들어 줌.

//Next는 import React from 'react'; 필요 없음! 있어도 되고 없어도 되고
import AppLayout from "../components/AppLayout";

const Home = () => {
    return (
        <AppLayout>                     {/* 다른 레이아웃을 쓰고 싶으면 만들고 해당 레이아웃으로 감싸면 됨. */}
            <div>Hello, Next!</div>     {/* AppLayout 안쪽 부분이 children이 됨. */}
        </AppLayout>
    );
}

export default Home;