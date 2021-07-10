export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '코델',
        },
        content: "리액트 노드 버드 #첫게시글 #Next",
        Images: [{
            src: "https://cdn.pixabay.com/photo/2021/06/29/19/11/kittens-6375012_960_720.jpg",
        }, {
            src: "https://cdn.pixabay.com/photo/2021/05/18/08/07/buildings-6262595_960_720.jpg",
        }, {
            src: "https://cdn.pixabay.com/photo/2021/05/23/21/57/mountains-6277391_960_720.jpg",
        }],
        Comments: [{
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
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
}

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const addPost = (data) => ({     //action을 생성해주는 action creator
    type: ADD_POST_REQUEST,
    data,
});

export const addComment = (data) => ({
    type: ADD_COMMENT_REQUEST,
    data,
});

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
        case ADD_POST_REQUEST:
            return {
                ...state,
                addPostLoading: true,
                addPostDone: false,
                addPostError: null,
            }
        case ADD_POST_SUCCESS:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],     //이렇게 해야 가장 위에 글이 추가되어 올라감.
                addPostLoading: false,
                addPostDone: true,
            };
        case ADD_POST_FAILURE:
            return {
                ...state,
                addPostLoading: false,
                addPostError: action.error,
            }
        case ADD_COMMENT_REQUEST:
            return {
                ...state,
                addCommentLoading: true,
                addCommentDone: false,
                addCommentError: null,
            }
        case ADD_COMMENT_SUCCESS:
            return {
                ...state,
                addCommentLoading: false,
                addCommentDone: true,
            };
        case ADD_COMMENT_FAILURE:
            return {
                ...state,
                addCommentLoading: false,
                addCommentError: action.error,
            }
        default: 
            return state;
    }
}

export default reducer;