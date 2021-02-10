import React, { Component } from 'react'
import MessageForm from './MessageForm'
import MessageHeader from './MessageHeader'
import Message from './Message'

import { connect } from 'react-redux';

import firebase from '../../../firebase';

export class MainPanel extends Component {

    state = {
        messages: [],
        messagesRef: firebase.database().ref("messages"),
        messagesLoading: true,
        searchTerm: "",
        searchResults: [],
        searchLoading: false
    }

    componentDidMount() {

        const { chatRoom } = this.props;

        if(chatRoom){
            this.addMessagesListeners(chatRoom.id);
        }
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
        this.state.messagesRef.child(chatRoomId).on("child_added", DataSnpashot => {
            msgArr.push(DataSnpashot.val());
            this.setState({ 
                messages: msgArr,
                messagesLoading: false
            });
           
        })
    }

    renderMessages = (messages) => messages.length > 0 && messages.map(message => (
        <Message 
            key={message.timestamp}
            message={message}
            user={this.props.user}
        />
    ))

    render() {

        const { messages, searchTerm, searchResults } = this.state;
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
