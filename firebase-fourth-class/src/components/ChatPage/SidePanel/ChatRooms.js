import React, { Component } from 'react'
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge';
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
         messagesRef: firebase.database().ref("messages"),
         firstLoad: true,
         activeChatRoomId: "",
         notifications:[]
    }

    componentDidMount() {
        this.AddChatRoomsListeners();
    }

    componentWillUnmount() {
        this.state.chatRoomsRef.off();
        this.state.chatRooms.forEach(chatRoom => {
            this.state.messagesRef.child(chatRoom.id).off();
        })
    }

    AddChatRoomsListeners = () => {
        let chatRoomsArray = [];
        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({ chatRooms: chatRoomsArray }, 
                            () => this.setFirstChatRoom())
            this.addNotificationListener(DataSnapshot.key)
        })
    }

    addNotificationListener = (chatRoomId) => {
        const { messagesRef } = this.state;
        messagesRef.child(chatRoomId).on("value", DataSnapshot => {
            if(this.props.chatRoom) {
                this.handleNotification(
                    chatRoomId,
                    this.props.chatRoom.id,
                    this.state.notifications,
                    DataSnapshot
                )
            }
        })
    }

    handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {

        // 이미 notifications state 안에 알림 정보가 들어있는 채팅방과 그렇지않은 채팅방을 나눠주기
        // 새로 방을 만들면 notification handler가 catch하지 못함 (새로 생성된 component이므로)
        let index = notifications.findIndex(notification => notification.id === chatRoomId)
        let lastTotal = 0;

        if (index === -1) {
            notifications.push({
                id: chatRoomId,
                total: DataSnapshot.numChildren(), // 모든 메세지 갯수
                lastKnownTotal: DataSnapshot.numChildren(), // notification에 없는 경우엔 모든 메세지를 열람한 경우이므로 total 값과 같을 것
                count: 0,
            })
        } else {
            // 받은 채팅이 현재 열린 채팅방과 다를 때
            if (chatRoomId !== currentChatRoomId) {
                // 유저가 확인한 총 메시지 개수
                lastTotal = notifications[index].lastKnownTotal;
                // 총 메세지 개수 > 0 이어야 함
                if(DataSnapshot.numChildren() - lastTotal > 0) {
                    notifications[index].count = DataSnapshot.numChildren() - lastTotal;
                } 
            } 
            // total property
            notifications[index].total = DataSnapshot.numChildren();
        }

        this.setState({ notifications })
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
        this.setState({ activeChatRoomId: room.id })
        this.props.dispatch(setPrivateChatRoom(false))
        this.clearNotification()
    }

    getNotificationCount = room => {
        let count = 0;
        this.state.notifications.forEach(notification => {
            if(notification.id === room.id) {
                count = notification.count;
            }
        })

        if (count > 0) return count;
    }

    clearNotification = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.props.chatRoom.id)

        if(index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].lastKnownTotal = this.state.notifications[index].total;
            updatedNotifications[index].count = 0;
            this.setState({ notifications: updatedNotifications });
        }
    }

    renderChatRooms = (chatRooms) => (
        chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li key={room.id}
                onClick={() => this.changeChatRoom(room)}
                style={{ backgroundColor: room.id === this.state.activeChatRoomId && "#ffffff45", cursor:'pointer'}}
            >
                # {room.title}

                <Badge variant="danger" style={{float:'right', marginTop: '4px'}}>
                    {this.getNotificationCount(room)}
                </Badge>
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
