import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux';

// react-bootstrap
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// mime-types module for upload file
import mime from 'mime-types';

// load firbase
import firebase from '../../../firebase';

// load css file
import "./style.css";


function MessageForm() {

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const user = useSelector(state => state.user.currentUser)

    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const [percentage, setPercentage] = useState(0);

    const inputOpenImageRef = useRef();

    const messagesRef = firebase.database().ref("messages");
    const typingRef = firebase.database().ref("typing");
    const storageRef = firebase.storage().ref();
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
            typingRef.child(chatRoom.id).child(user.uid).remove();

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

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    }

    const getPath = () => {
        if(isPrivateChatRoom) {
            return `/message/private/${chatRoom.id}`
        } else {
            return `/message/public`
        }
    }

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        console.log("file", file);
        if(!file) return;
        const filePath = `${getPath()}/${file.name}.jpg`;
        const metadata = { contentType: mime.lookup(file.name)}
        setLoading(true)
        try {
            let uploadTask = storageRef.child(filePath).put(file, metadata)
            
            uploadTask.on("state_changed", 
            UploadTaskSnapshot => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
                );
                setPercentage(percentage)
            },
            error => {
                console.log(error)
                setLoading(false)
            },
            () => {
                // 저장이 다 되면 파일 메세지 전송
                // 저장된 파일을 다운로드 받을 수 있는 URL 가져오기
                uploadTask.snapshot.ref.getDownloadURL()
                .then(downloadURL => {
                    console.log("downloadURL", downloadURL);
                    messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL))
                    setLoading(false)
                })
            }

        )
        } catch (err) {
            alert(err)
        }
    }

    const handleKeyDown = e => {
        if(e.ctrlKey && e.keyCode === 13) {
            handleSubmit();
        }

        if(content) {
            typingRef.child(chatRoom.id)
                     .child(user.uid)
                     .set(user.displayName);
        } else {
            typingRef.child(chatRoom.id)
                     .child(user.uid)
                     .remove();
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control 
                        className="chatTextarea"
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        style={{
                            display: 'flex', width: "100%", border: "0px none", resize: "none"
                        }}
                        as="textarea" rows={2} />
                </Form.Group>
            </Form>

            {(percentage !== 0 && percentage !== 100) && <ProgressBar variant="warning" label={`${percentage}%`} now={percentage} /> }

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
                        onClick={handleOpenImageRef}
                        disabled={loading ? true : false}>
                    이미지 보내기
                </button>
                </Col>
            </Row>
            <input 
                accept="image/jpeg, image/png"
                type="file" style={{display:"none"}}
                onChange={handleUploadImage}
                ref={inputOpenImageRef}
            />
        </div>
    )
}

export default MessageForm
