import Axios from 'axios';
import React, { useState } from 'react'
import  { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    const user = useSelector(state => state.user)
    const videoId = props.postId
    const [Comment, setComment] = useState('');

    const handleClickEvent = (event) => {
        setComment(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables ={
            content : Comment,
            writer : user.userData._id,
            postId : props.postId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then( response => {
                if(response.data.success) {
                        console.log(response.data.result)
                        setComment('');
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
                 return (!comment.responseTo &&
                    <React.Fragment key ={ `Comment-${index}`}>
                        <SingleComment refreshComments = { props.refreshComments } 
                                       comment = {comment} postId = {videoId} 
                                       />
                        <ReplyComment refreshComments = { props.refreshComments } 
                                      parentcommentId = {comment._id} 
                                      CommentLists = {props.commentLists} postId = {videoId}
                                    />
                    </React.Fragment> 
                    )
              
                /* map메서드를 사용할 때엔 return문이 필요함!!! */
            })}            

            { /* Root Comment Form */}

            <form style = {{ display: 'flex' }} onSubmit = { onSubmit }>
                <textarea
                    style = {{ width: '89%', borderRadius : '5px', marginRight : '0.5rem', marginLeft : '0.2rem'}}
                    onChange = { handleClickEvent }
                    value = { Comment }
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
