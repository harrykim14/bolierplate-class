import React, { Component } from 'react'
import MessageForm from './MessageForm'
import MessageHeader from './MessageHeader'
import Message from './Message'

import { connect } from 'react-redux';
import { setUserPosts } from '../../../redux/actions/chat_action';

import firebase from '../../../firebase';

export class MainPanel extends Component {

    state = {
        messages: [],
        messagesRef: firebase.database().ref("messages"),
        messagesLoading: true,
        searchTerm: "",
        searchResults: [],
        searchLoading: false,
        typingUsers: [],
        typingRef: firebase.database().ref("typing"),
        listenerLists : []
    }

    componentDidMount() {

        const { chatRoom } = this.props;

        if(chatRoom){
            this.addMessagesListeners(chatRoom.id);
            this.addTypingListeners(chatRoom.id);
        }
    }

    componentWillUnmount() {
        this.state.messagesRef.off();
        this.removeListeners(this.state.listenerLists)
    }

    handleSearchMessages = () => {
        const chatRoomMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, "gi");
        const results = chatRoomMessages.reduce((acc, message) => {
            if(
                (message.content && message.content.match(regex)) || 
                message.user.name.match(regex)
            ) acc.push(message)
            return acc;
        }, [])

        this.setState({ searchResults : results })
    }

    handleSearchChange = e => {
        this.setState({
            searchTerm: e.target.value,
            searchLoading: true
        },
        () => this.handleSearchMessages()
        )
    }

    addMessagesListeners = (chatRoomId) => {
        let msgArr = [];
        this.state.messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
            msgArr.push(DataSnapshot.val());
            this.setState({ 
                messages: msgArr,
                messagesLoading: false
            });
            this.userPostesCount(msgArr);
           
        })
    }

    addTypingListeners = chatRoomId => {
        const { typingRef } = this.state;
        let typingUsers = [];
        typingRef.child(chatRoomId).on("child_added", DataSnapshot => {
            if(DataSnapshot.key !== this.props.user.uid) {
                typingUsers = typingUsers.concat({
                    id: DataSnapshot.key,
                    name: DataSnapshot.val()
                });
                this.setState({ typingUsers });
            }
        })

        this.addToListenerLists(chatRoomId, typingRef, "child_added")

        typingRef.child(chatRoomId).on("child_removed", DataSnapshot => {
            const index = typingUsers.findIndex(user => user.id === DataSnapshot.key);
            if(index !== -1) {
                typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key);
                this.setState({ typingUsers });
            }
        })

        this.addToListenerLists(chatRoomId, typingRef, "child_removed")
    }

    addToListenerLists = (id, ref, event) => {
        const { listenerLists } = this.state; 
        const index = listenerLists.findIndex(listener => {
            return (
                listener.id === id && listener.ref === ref && listener.event === event
            )
        })

        if(index === -1) {
            const newListener = { id, ref, event}
            this.setState({ listenerLists: listenerLists.concat(newListener) })
        }
    }

    removeListeners = listeners => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event);
        })
    }

    userPostesCount = msg => {
        let userPosts = msg.reduce((acc, message) => {
            if(message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    image: message.user.image,
                    count: 1
                }
            }
            return acc;
        }, {})
        this.props.dispatch(setUserPosts(userPosts));
    }

    renderMessages = (messages) => 
        messages.length > 0 && 
        messages.map(message => (
            <Message 
                key={message.timestamp}
                message={message}
                user={this.props.user}
            />))

    renderTypingUsers = typingUsers => 
        typingUsers.length > 0 && 
        typingUsers.map(user => (
            <span>{user.name}님이 채팅을 입력중입니다...</span>
        ))

    render() {

        const { messages, searchTerm, searchResults, typingUsers } = this.state;
        return (
            <div style = {{ padding: '2rem 2rem 0 2rem'}}>
                <MessageHeader handleSearchChange={this.handleSearchChange} />
                <div style = {{
                    width: '100%',
                    height: '400px',
                    border: '.2rem solid #ececec',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto'
                }}>

                    {searchTerm ? this.renderMessages(searchResults) : this.renderMessages(messages)}
                    {this.renderTypingUsers(typingUsers)}
                </div>
                <MessageForm handleSearchChange={this.handleSearchChange} />
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

export default connect(mapStateToProps)(MainPanel)
