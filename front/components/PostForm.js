import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button } from 'antd';

import { addPost } from "../reducers/post";
import useInput from "../hooks/useInput";

const PostForm = () => {
    const { imagePaths, addPostDone } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const [text, onChangeText, setText] = useInput('');
    
    useEffect(() => {
        if (addPostDone) {
            setText('');
        }
    }, [addPostDone]);
    
    const onSubmit = useCallback(() => {
        dispatch(addPost(text));
        // setText('');     //dispatch 하다가 서버에 문제가 생겨 다시 시도해야 하는 경우에도 게시글이 날아가버리므로 여기에 하면 안됨. 따라서 useEffect로 처리.
    }, [text]);
    
    const imageInput = useRef();
    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);

    return (
        <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="게시글을 입력하세요." />
            <div>
                <input type="file" multiple hidden ref={imageInput} />
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type="primary" style={{ float: 'right' }} htmlType="submit">작성</Button>
            </div>
            <div>
                {imagePaths.map((v) => (
                    <div key={v} style={{ display: 'inline-block' }}>
                        <img src={v} style={{ width: '200px' }} alt={v} />
                        <div>
                            <Button>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
};

export default PostForm;