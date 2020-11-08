import React, {useEffect, useState} from 'react'
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Section/SideVideo';
import Subscribe from './Section/Subscribe';
import Comment from './Section/Comment';

function VideoDetailPage(props) {

  
    const videoId = props.match.params.videoId

    const [VideoDetail, setVideoDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const refreshComments = (newComments) => {
        setCommentLists(CommentLists.concat(newComments))
    }

    useEffect(() => {

        const videoVariable = { videoId: props.match.params.videoId }
        Axios.post('/api/video/getVideoDetail', videoVariable)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.videoDetail)
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오는데 실패하였습니다.')
                }
            })
        
        const commentVariable = { videoId: props.match.params.videoId }
        Axios.post('/api/comment/getComments', commentVariable)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.comments);
                    setCommentLists(response.data.comments);
                } else {
                    alert('코멘트 정보 취득에 실패하였습니다.')
                }
            })
    }, [])

    if (VideoDetail.writer){

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && 
        <Subscribe 
            userTo={VideoDetail.writer._id} 
            userFrom={localStorage.getItem('userId')} />

    return (
        <Row gutter = {[16, 16]}>
            <Col lg = {18} xs ={24}>
            <div style ={{width: '100%', padding: '3rem 4rem'}}>
            <video style ={{width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
            <List.Item
            actions={[ subscribeButton ]/* 이 부분은 Array<ReactNode>를 매개변수로 사용함 */}
            >
                <List.Item.Meta
                    avatar ={<Avatar src ={VideoDetail.writer.image}/>}
                    title ={VideoDetail.writer.name}
                    description ={VideoDetail.description}
                />

            </List.Item>
                <Comment refreshComments = {refreshComments} commentLists = {CommentLists} postId = {videoId}/>
            </div>
            </Col>
            <Col lg={6} xs={24}>
                <SideVideo/>
            </Col>
        </Row>
    )
} else {
    return (
        <div style = {{margin: '0 auto', marginTop: '20px'}}>Loading...</div>
    )
}
}

export default VideoDetailPage
