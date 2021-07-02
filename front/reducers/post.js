export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '코델',
        },
        content: "리액트 노드 버드",
        Images: [{
            src: "https://cdn.pixabay.com/photo/2021/06/29/19/11/kittens-6375012_960_720.jpg",
        }, {
            src: "https://cdn.pixabay.com/photo/2021/05/18/08/07/buildings-6262595_960_720.jpg",
        }, {
            src: "https://cdn.pixabay.com/photo/2021/05/23/21/57/mountains-6277391_960_720.jpg",
        }],
        Comment: [{
            User: {
                nickname: 'min',
            },
            content: '안녕~',
        }, {
            User: {
                nickname: 'mon',
            },
            content: '반가워!!',
        }]
    }],
    imagePaths: [],
    postAdded: false,
}

const ADD_POST = 'ADD_POST';

export const addPost = {
    type: ADD_POST,

}

const dummyPost = {
    id: 2,
    content: "더미 데이터임.",
    User: {
        id: 1,
        nickname: "코델",
    },
    Images: [],
    Comment: [],
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],     //이렇게 해야 가장 위에 글이 추가되어 올라감.
                postAdded: true,
            }
        default: 
            return state;
    }
}

export default reducer;