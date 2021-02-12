import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';

// react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// react-icons
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch }  from 'react-icons/ai';

// firebase
import firebase from '../../../firebase'

function MessageHeader({handleSearchChange}) {

    const user = useSelector(state=> state.user.currentUser)
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom);
    const [isFavorited, setIsFavorited] = useState(false);
    const usersRef = firebase.database().ref("users");

    useEffect(() => {
        if (chatRoom && user)  {
            addFavoriteListener(user.uid, chatRoom.id)
        }
        // eslint-disable-next-line
    },[])

    const addFavoriteListener = (userId, chatRoomId) => {
        usersRef.child(userId)
                .child("favorited")
                .once("value")
                .then(data => {
                    if(data.val() !== null) {
                        const chatRoomIds = Object.keys(data.val());
                        console.log("chatRoomIds", chatRoomIds);
                        const isAlreadyFavorited = chatRoomIds.includes(chatRoomId)
                        setIsFavorited(isAlreadyFavorited)
                    }

                })
    }

    const handleFavorite = () => {
        if(isFavorited) {
            usersRef.child(`${user.uid}/favorited`)
                    .child(chatRoom.id)
                    .remove(err => {
                        if(err !== null) console.log(err);
                    });
            setIsFavorited(prev => !prev);
        } else {
            usersRef.child(`${user.uid}/favorited`)
                    .update({
                        [chatRoom.id]: {
                            title: chatRoom.title,
                            description: chatRoom.description,
                            createBy: {
                                name: chatRoom.createBy.name,
                                image: chatRoom.createBy.image
                            }
                        }

                    })
            setIsFavorited(prev => !prev);
        }

    }

    return (
        <div style={{ width: '100%', height: '170px', 
                      border:'.2rem solid #ececec', borderRadius: '4px', 
                      padding: '1rem', marginBottom: '1rem' }}>
            <Container>
                <Row>
                    <Col>
                        <h2>
                            {isPrivateChatRoom ? <FaLock style={{margin: '0px 5px 10px 0px'}}/> : <FaLockOpen style={{margin: '0px 5px 10px 0px'}}/> }
                            {chatRoom && chatRoom.title} 
                            {!isPrivateChatRoom &&
                            <span style = {{ cursor: 'pointer'}} onClick={handleFavorite}>
                                {isFavorited ?  <MdFavorite style={{marginBottom: '10px'}}/> 
                                : <MdFavoriteBorder style={{marginBottom:'10px'}}/> }
                            </span> 
                            }                               
                                
                        </h2>
                    </Col>
                    <Col>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                            <AiOutlineSearch/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        onChange={handleSearchChange}
                        placeholder="메세지 찾기"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    </Col>
                </Row>
               <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                <Image src ="" /> {` ${user && user.displayName}`}
               </div>
                <Row>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: '0 0.5rem' }}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0" 
                                                      style={{ backgroundColor:'transparent', color: 'black'}}>
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: '0 1rem' }}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0"
                                                      style={{ backgroundColor:'transparent', color: 'black'}}>
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MessageHeader
