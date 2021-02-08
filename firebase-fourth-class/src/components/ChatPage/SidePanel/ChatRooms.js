import React, { Component } from 'react'
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'

export class ChatRooms extends Component {

    state = {
         show: false
    }

    handleClose = () => this.setState({ show: false});
    handleShow = () => this.setState({ show: true });

    render() {
        return (
            <div>
                <div style ={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                   <FaRegSmileWink style = {{marginRight: 3}} />
                   CHAT ROOMS {" "} (1)
                   <FaPlus style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
                           onClick={this.handleShow}/>
                </div> 

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>채팅방 새로 만들기</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group controlId="chatName">
                            <Form.Label>채팅방 이름</Form.Label>
                            <Form.Control type="text" placeholder="채팅방 이름을 입력해주세요" />
                        </Form.Group>

                        <Form.Group controlId="chatDescription">
                            <Form.Label>방 설명</Form.Label>
                            <Form.Control type="text" placeholder="어떤 채팅방인가요?" />
                        </Form.Group>
                    </Form>                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        방 생성
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ChatRooms
