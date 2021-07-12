import React, { useCallback, useState } from "react";
import propTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Popover, Avatar, List, Comment } from "antd";
import { EllipsisOutlined, MessageOutlined, HeartOutlined, HeartTwoTone, RetweetOutlined } from "@ant-design/icons";

import PostImages from './PostImages';
import FollowButton from './FollowButton';
import PostCardContent from './PostCardContent';
import CommentForm from './CommentForm';
import { REMOVE_POST_REQUEST } from "../reducers/post";

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const [liked , setLiked] = useState(false);
    const [commentFormOpened , setCommentFormOpened] = useState(false);
    
    const onToggleLike = useCallback(() => {
        setLiked((prev) => !prev);
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev)
    }, []);

    const onRemovePost = useCallback(() => {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        })
    }, []);

    const id = useSelector((state) => state.user.me?.id);
    // const id = me?.id;  //옵셔널 체이닝
    const { removePostLoading } = useSelector((state) => state.post);

    return (
        <div style={{marginBottom: 20}}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images}/>}
                actions={[                  //jsx에서 배열 안에 값 넣을 때는 key 필수
                    <RetweetOutlined key="rwtweet"/>,
                    liked ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike}/> : <HeartOutlined key="heart" onClick={onToggleLike}/>,
                    <MessageOutlined key="comment" onClick={onToggleComment}/>,
                    <Popover key="more" content={(
                        <Button.Group>
                            {(id && post.User.id === id) ? (
                                <>
                                    <Button >수정</Button>
                                    <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                                </>
                            ) : <Button>신고</Button>}
                        </Button.Group>
                    )}>
                        <EllipsisOutlined />
                    </ Popover>
                ]}
                extra={id && <FollowButton post={post} />}
            >
                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content}/>}
                />
            </Card>
            {commentFormOpened && (
                <div>
                    <CommentForm post={post} />
                    <List
                        header={`${post.Comments ? post.Comments.length : 0}개의 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments}
                        renderItem={item => (           //post.Comments 안의 요소 각각이 item으로 들어감. 꼭 {}가 아니라 ()로 해줘야 함. 왜지...?
                            <li>
                                <Comment
                                    author={item.User.nickname}
                                    avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

PostCard.propTypes = {
    post: propTypes.shape({     //shape으로 더 자세하게 정해줄 수 있음. 하위의 object도 shape으로 또 더 자세히 써줄 수 있음.
        id: propTypes.number,
        User: propTypes.object,
        content: propTypes.string,
        createdAt: propTypes.object,
        Comments: propTypes.arrayOf(propTypes.object),
        Images: propTypes.arrayOf(propTypes.object),
    }).isRequired,
}

export default PostCard;