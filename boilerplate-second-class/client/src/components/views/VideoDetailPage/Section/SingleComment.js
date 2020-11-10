import React, { useState } from 'react'
import { Comment, Avatar } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';

function SingleComment(props) {
    
    const user = useSelector(state => state.user)
    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState('')

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables ={
            content : CommentValue,
            writer : user.userData._id,
            postId : props.postId,
            responseTo : props.commentOne._id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then( response => {
                if(response.data.success) {
                        console.log(response.data.result)
                        setCommentValue('');
                        setOpenReply(false)
                        props.refreshComments(response.data.result)
                } else {
                    alert('댓글 저장하지 못했습니다.')
                }
            })

    }
    
    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
        <span onClick = { onClickReplyOpen } key = "comment-basic-reply-to" style ={{ cursor : 'pointer' }}>Reply to</span>
    ]


    return (
        <div>
            <Comment
            actions = {actions}
            author = {props.comment.writer.name}
            avatar={<Avatar src={props.comment.writer.image} alt="Avatar Picture" />}
            content ={<p> {props.comment.content}</p>}

            />

            {OpenReply && <form style = {{ display: 'flex', marginBottom : '1rem'}} onSubmit = { onSubmit }>
                <textarea
                    style = {{ width: '89%', borderRadius : '5px', marginRight : '0.5rem', marginLeft : '0.2rem'}}
                    onChange = { onHandleChange }
                    value = {CommentValue}
                    placeholder = "답글 코멘트를 작성해 주세요"
                />   
                <button
                    style = {{ width: '9%' , borderRadius : '5px'}}
                    onClick = { onSubmit }
                    >
                        등록
                </button>
            </form>  }
             
        </div>
    )
}

export default SingleComment
