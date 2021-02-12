import React, { Component } from 'react'
import { FaRegSmile } from 'react-icons/fa'

import firebase from '../../../firebase'

import { connect } from 'react-redux'
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chat_action'

export class DirectMessages extends Component {


    state = {
        users: [],
        usersRef: firebase.database().ref('users'),
        activeChatRoom: '',
    }

    componentDidMount() {
        if(this.props.user)
            this.addUsersListeners(this.props.user.uid)
    }

    componentWillUnmount() {
        if(this.props.user) 
            this.removeListener(this.props.user.uid);
    }

    removeListener = userId => {
        this.state.usersRef.child(`${userId}/favorited`).off();
    }

    addUsersListeners = (currentUserId) => {
        const { usersRef } = this.state;
        let usersArr = [];
        usersRef.on("child_added", DataSnapshot => {
            
            if(currentUserId !== DataSnapshot.key) {
                console.log("DataSnapshot.val()", DataSnapshot.val())

                let user = DataSnapshot.val();
                user["uid"] = DataSnapshot.key;
                user["state"] = "offline";
                usersArr.push(user)
                this.setState({ users: usersArr })
            }
        })
    }

    getChatRoomId = userId => {
        const currentUserId = this.props.user.uid;
        return (userId > currentUserId) ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
    }

    changeChatRoom = user => {
        const chatRoomId = this.getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: user.uid
        }
        this.props.dispatch(setCurrentChatRoom(chatRoomData));
        this.props.dispatch(setPrivateChatRoom(true))
        this.setActiveChatRoom(user.uid);
    }

    setActiveChatRoom = userId => {
        this.setState({activeChatRoom: userId})
    }

    renderDirectMessages = users => 
        users.length > 0 && users.map(user => (
            <li key={user.uid}
                style={{cursor:'pointer', backgroundColor: user.uid === this.state.activeChatRoom && "#ffffff45"}}
                onClick={() => this.changeChatRoom(user)}
            ># {user.name}</li>
        ))

    render() {
        const { users } = this.state;
        return (
            <div>
                <span style={{ display: 'flex', alignItems: 'center'}}>
                    <FaRegSmile style={{ marginRight: '3px' }}/> DIRECT MESSAGES
                </span>

                <ul style={{ listStyleType:'none', padding: 0 }}>
                    {this.renderDirectMessages(users)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { user: state.user.currentUser }
}

export default connect(mapStateToProps)(DirectMessages)
