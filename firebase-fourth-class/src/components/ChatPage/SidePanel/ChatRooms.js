import React, { Component } from 'react'
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chat_action'

export class ChatRooms extends Component {

    state = {
         show: false,
         title: "",
         description: "",
         chatRooms: [],
         chatRoomsRef: firebase.database().ref("chatRooms"),
         firstLoad: true,
         activeChatRoomId: ""
    }

    componentDidMount() {
        this.AddChatRoomsListeners();
    }

    componentWillUnmount() {
        this.state.chatRoomsRef.off();
    }

    AddChatRoomsListeners = () => {
        let chatRoomsArray = [];
        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({ chatRooms: chatRoomsArray}, 
                            () => this.setFirstChatRoom())
        })
    }

    setFirstChatRoom = () => {
        const firstChatRoom = this.state.chatRooms[0]
        if (this.state.firstLoad && this.state.chatRooms.length > 0) {
            this.props.dispatch(setCurrentChatRoom(firstChatRoom))
            this.setState({ activeChatRoomId: firstChatRoom.id })
        }
        this.setState({ firstLoad: false })
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
    handleSubmit = (e) => {
        e.preventDefault();
        const { title, description } = this.state;

        if(this.isFormValid(title, description)) {
            this.addChatRoom();
        }
    }

    addChatRoom = async () => {

        // firebase에서는 this.state.chatRoomsRef.push()처럼 firebase database에 새로 push()하게 되면 고유한 key를 자동으로 generate함
        const key = this.state.chatRoomsRef.push().key;
        const { title, description } = this.state;
        const { user } = this.props;
        const newChatRoom = {
            id: key,
            title: title,
            description: description,
            createBy: {
                name: user.displayName,
                image: user.photoURL
            }
        }

        try {
            await this.state.chatRoomsRef.child(key).update(newChatRoom)
            this.setState({
                name: "",
                description: "",
                show: false
            })
        } catch (err) {
            alert(err)
        }

    }

    isFormValid = (title, description) => title && description

    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room))
        this.props.dispatch(setPrivateChatRoom(false))
        this.setState({ activeChatRoomId: room.id })
    }

    renderChatRooms = (chatRooms) => (
        chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li key={room.id}
                onClick={() => this.changeChatRoom(room)}
                style={{ backgroundColor: room.id === this.state.activeChatRoomId && "#ffffff45", cursor:'pointer'}}
            >
                # {room.title}
            </li>
        ))
    )

    render() {
        return (
            <div>
                <div style ={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                   <FaRegSmileWink style = {{marginRight: 3}} />
                   CHAT ROOMS {` (${this.state.chatRooms.length})`}
                   <FaPlus style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
                           onClick={this.handleShow}/>
                </div>

                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {this.renderChatRooms(this.state.chatRooms)}
                </ul>

                <Modal show={this.state.show} onHide={this.handleClose} >
                    <Modal.Header closeButton>
                    <Modal.Title >채팅방 새로 만들기</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="chatName">
                            <Form.Label>채팅방 이름</Form.Label>
                            <Form.Control type="text" 
                                          onChange={(e) => this.setState({ title: e.target.value })}
                                          placeholder="채팅방 이름을 입력해주세요" />
                        </Form.Group>

                        <Form.Group controlId="chatDescription">
                            <Form.Label>방 설명</Form.Label>
                            <Form.Control type="text" 
                                          onChange={(e) => this.setState({ description: e.target.value })}
                                          placeholder="어떤 채팅방인가요?" />
                        </Form.Group>
                    </Form>                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        방 생성
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
}

export default connect(mapStateToProps)(ChatRooms)
