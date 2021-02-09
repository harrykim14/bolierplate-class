import React, { useState } from 'react'
import { useSelector } from 'react-redux';

// react-bootstrap
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



// load firbase
import firebase from '../../../firebase';

// load css file
import "./style.css";


function MessageForm() {

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)

    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)

    const messagesRef = firebase.database().ref("messages")
    const createMessage = (fileURL = null) => {

        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        }

        if(fileURL !== null) {
            message["image"] = fileURL;
        } else {
            message["content"] = content;
        }

        return message;

    }

    const handleSubmit = async () => {
        if(!content) {
            setErrors(prev => prev.concat("내용을 입력해주세요"))
            return;
        }

        setLoading(true);

        try {
            await messagesRef.child(chatRoom.id).push().set(createMessage())
            setLoading(false)
            setContent("")
            setErrors([])
        } catch (err) {
            setErrors(prev => prev.concat(err.message))
            setLoading(false)
            setTimeout(() => {
                setErrors([])
            }, 5000)
        }
        
    }

    const handleChange = (e) => {
        setContent(e.target.value);
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control 
                        value={content}
                        onChange={handleChange}
                        style={{width: "100%"}}
                        as="textarea" rows={3} />
                </Form.Group>
            </Form>

            <ProgressBar variant="warning" label="60%" now={60} />

        <div>
            {errors.map(errMsg => <p style={{ color: "red" }} key={errMsg}>{errMsg}</p>)}
        </div>
            <Row>
                <Col>
                <button className="chatBt" 
                        onClick={handleSubmit} 
                        style={{ width: '100%' }} 
                        disabled={loading ? true : false} >
                    보내기
                </button>
                </Col>
                <Col>
                <button className="chatBt" 
                        style={{ width: '100%' }} 
                        disabled={loading ? true : false}>
                    이미지 보내기
                </button>
                </Col>
            </Row>
        </div>
    )
}

export default MessageForm
