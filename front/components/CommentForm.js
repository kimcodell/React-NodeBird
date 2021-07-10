import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import propTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

import useInput from "../hooks/useInput";
import { ADD_COMMENT_REQUEST } from "../reducers/post";

const CommentForm = ({ post }) => {
    const dispatch = useDispatch();
    const id = useSelector((state) => state.user.me?.id);
    const { addCommentDone } = useSelector((state) => state.post);
    const [commentText, onChangeCommentText, setCommentText] = useInput('');

    useEffect(() => {
        if (addCommentDone) {
            setCommentText('');
        }
    }, [addCommentDone]);

    const onSubmitComment = useCallback(() => {
        console.log(post.id, commentText);
        dispatch({      //동적 action creator로 만들어도 되고, 그냥 직접 넣을지 결정. 전자는 재사용성 높음. 어차피 한곳에서만 쓰면 후자도 괜찮음.
            type: ADD_COMMENT_REQUEST,
            data: { content: commentText, postId: post.id, userId: id}
        })
    }, [commentText, id]);

    return (
        <Form onFinish={onSubmitComment}>
            <Form.Item style={{ position: 'relative', margin: 0 }}>
                <Input.TextArea value={commentText} onChange={onChangeCommentText} row={4} />
                <Button style={{ position:'absolute', right: 0, bottom: -40 }} type="primary" htmlType="submit">작성</Button>
            </Form.Item>
        </Form>
    );
}

CommentForm.propTypes = {
    post: propTypes.object.isRequired,
}

export default CommentForm;