import React, { useState, useEffect } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {
        let commentNumber = 0;
        props.CommentLists.map((each, index) => {
            if (each.responseTo === props.parentcommentId) { 
                commentNumber++ 
                }
            return index;
        })
        setChildCommentNumber(commentNumber)
    }, [props.CommentLists, props.parentcommentId])

    const renderReplyComment = (parentcommentId) => {
        return props.CommentLists.map((comment, index)=> (
             <React.Fragment key = {`Reply-${index}`}>
                {
                    comment.responseTo === parentcommentId &&
                    <div style = {{ width : '80%', marginLeft : '40px'}}>
                        <SingleComment refreshComments = { props.refreshComments } 
                                       comment = {comment} postId = {props.postId} />
                        <ReplyComment refreshComments = { props.refreshComments } 
                                      parentcommentId = {comment.writer._id} 
                                      CommentLists = {props.CommentLists} postId = {props.postId}/>
                    </div>
                }
            </React.Fragment> 
         ))
    }

    const handleChange = () =>{
        setOpenReplyComments(!OpenReplyComments);
    }

    return (
        <div>
            { ChildCommentNumber > 0 && 
            <p style = {{ fontSize: '14px', margin: 0, color:'gray',  }} >
            <span style = {{ cursor : 'pointer'}} onClick={handleChange}>View {ChildCommentNumber} more comment(s)</span>
            </p>}
            
           { OpenReplyComments && 
           renderReplyComment(props.parentcommentId) }
        </div>
    )
}

export default ReplyComment
