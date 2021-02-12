import React, { Component } from 'react'
import { FaRegSmile } from 'react-icons/fa'
import { connect } from 'react-redux'
import firebase from '../../../firebase';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chat_action'

export class Favorited extends Component {

    state = {
        usersRef: firebase.database().ref("users"),
        favoritedChatRoom: [],
        activeChatRoomId: ''
    }

    componentDidMount() {
        if(this.props.user)
            this.addListeners(this.props.user.uid)
    }

    addListeners = userId => {
        const { usersRef } = this.state;
        usersRef.child(userId)
                .child("favorited")
                .on("child_added", DataSnapshot => {
                    const favoritedChatRoom = { id: DataSnapshot.key, ...DataSnapshot.val()}
                    this.setState({favoritedChatRoom : [...this.state.favoritedChatRoom, favoritedChatRoom]})
                })
        usersRef.child(userId)
                .child("favorited")
                .on("child_removed", DataSnapshot => {
                    const removedChatRoom = { id: DataSnapshot.key, ...DataSnapshot.val()}
                    const filteredChatRoom = this.state.favoritedChatRoom.filter(chatRoom => {
                        return chatRoom.id !== removedChatRoom.id
                    })
                    this.setState({ favoritedChatRoom: filteredChatRoom })
                })
    }

    changeChatRoom = (chatRoom) => {
        this.props.dispatch(setCurrentChatRoom(chatRoom))
        this.props.dispatch(setPrivateChatRoom(false))
        this.setState({ activeChatRoomId: chatRoom.id })
    }

    renderFavoritedChatRooms = favoritedChatRoom => 
        favoritedChatRoom.length > 0 
        && favoritedChatRoom.map(
            chatRoom => (
            <li key={chatRoom.id} 
                style={{cursor: 'pointer', backgroundColor: chatRoom.id === this.state.activeChatRoomId && "#ffffff45"}}
                onClick={() => {this.changeChatRoom(chatRoom)}}># {chatRoom.title} </li>)
        )
    

    render() {

        const { favoritedChatRoom } = this.state;

        return (
            <div>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FaRegSmile style={{ marginRight: '3px' }}/> 
                    FAVORITED{` (${favoritedChatRoom.length})`}
                </span>
                <ul style={{ listStyleType: "none", padding: '0' }}>
                    {this.renderFavoritedChatRooms(favoritedChatRoom)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(Favorited)