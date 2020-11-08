import Axios from 'axios';
import React, { useState } from 'react'
import  { useSelector } from 'react-redux';
import SingleComment from './SingleComment';

function Comment(props) {

    const user = useSelector(state => state.user)
    const videoId = props.postId
    const [commentValue, setCommentValue] = useState('');

    const handleClickEvent = (event) => {
        setCommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables ={
            content : commentValue,
            writer : user.userData._id,
            postId : videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then( response => {
                if(response.data.success) {
                        console.log(response.data.result)
                        setCommentValue('');
                        props.refreshComments(response.data.result)
                } else {
                    alert('댓글 저장하지 못했습니다.')
                }
            })

    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />

            { /* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => {
                 return (!comment.responseTo && <SingleComment refreshComments = { props.refreshComments } key = {`SingleComment-${index}`} comment = {comment} postId = {videoId} /> )
              
                /* map메서드를 사용할 때엔 return문이 필요함!!! */
            })}            

            { /* Root Comment Form */}

            <form style = {{ display: 'flex' }} onSubmit = { onSubmit }>
                <textarea
                    style = {{ width: '89%', borderRadius : '5px', marginRight : '0.5rem', marginLeft : '0.2rem'}}
                    onChange = { handleClickEvent }
                    value = { commentValue }
                    placeholder = "코멘트를 작성해 주세요"
                />   
                <button
                    style = {{ width: '9%' , borderRadius : '5px'}}
                    onClick = { onSubmit }
                    >
                        등록
                </button>
            </form>   
        </div>
    )
}

export default Comment
