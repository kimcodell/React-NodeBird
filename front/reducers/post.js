import shortId from 'shortid';
import { ADD_POST_TO_ME } from './user';

export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '코델',
        },
        content: "리액트 노드 버드 #첫게시글 #Next",
        Images: [{
            id: shortId.generate(),
            src: "https://cdn.pixabay.com/photo/2021/06/29/19/11/kittens-6375012_960_720.jpg",
        }, {
            id: shortId.generate(),
            src: "https://cdn.pixabay.com/photo/2021/05/18/08/07/buildings-6262595_960_720.jpg",
        }, {
            id: shortId.generate(),
            src: "https://cdn.pixabay.com/photo/2021/05/23/21/57/mountains-6277391_960_720.jpg",
        }],
        Comments: [{
            id: shortId.generate(),
            User: {
                id: shortId.generate(),
                nickname: 'min',
            },
            content: '안녕~',
        }, {
            id: shortId.generate(),
            User: {
                id: shortId.generate(),
                nickname: 'mon',
            },
            content: '반가워!!',
        }]
    }],
    imagePaths: [],
    
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
    
    removePostLoading: false,
    removePostDone: false,
    removePostError: null,

    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
}

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

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

const dummyPost = (data) => ({
    id: data.id,
    content: data.content,
    User: {
        id: 1,
        nickname: "코델",
    },
    Images: [],
    Comments: [],   //s 빠뜨려서 에러났었음.
});

const dummyComment = (data) => ({
    id: shortId.generate(),     //임의의 id를 만들어주는 라이브러리
    content: data,
    User: {
        id: 1,
        nickname: "코델",
    },
});

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
                mainPosts: [dummyPost(action.data), ...state.mainPosts],     //이렇게 해야 가장 위에 글이 추가되어 올라감.
                addPostLoading: false,
                addPostDone: true,
            };
        case ADD_POST_FAILURE:
            return {
                ...state,
                addPostLoading: false,
                addPostError: action.error,
            }
        case REMOVE_POST_REQUEST:
            return {
                ...state,
                removePostLoading: true,
                removePostDone: false,
                removePostError: null,
            }
        case REMOVE_POST_SUCCESS:
            return {
                ...state,
                mainPosts: state.mainPosts.filter((v) => v.id !== action.data),     //지울 때는 주로 filter로 불변성 지키면서 지움.
                removePostLoading: false,
                removePostDone: true,
            };
        case REMOVE_POST_FAILURE:
            return {
                ...state,
                removePostLoading: false,
                removePostError: action.error,
            }
        case ADD_COMMENT_REQUEST:
            return {
                ...state,
                addCommentLoading: true,
                addCommentDone: false,
                addCommentError: null,
            }
        case ADD_COMMENT_SUCCESS: {
            const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
            const post = { ...state.mainPosts[postIndex] };
            post.Comments = [dummyComment(action.data.content), ...post.Comments];
            const mainPosts = [...state.mainPosts];
            mainPosts[postIndex] = post;
            return {
                ...state,
                mainPosts,
                addCommentLoading: false,
                addCommentDone: true,
            };
        }
        case ADD_COMMENT_FAILURE:
            return {
                ...state,
                addCommentLoading: false,
                addCommentError: action.error,
            }
        default: 
            return state;
    };
};

export default reducer;