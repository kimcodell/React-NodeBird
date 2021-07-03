import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import propTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

import useInput from "../hooks/useInput";

const CommentForm = ({ post }) => {
    const id = useSelector(state => state.user.me?.id);
    const [commentText, onChangeCommentText] = useInput('');
    const onSubmitComment = useCallback(() => {
        console.log(post.id, commentText);
    }, [commentText]);

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