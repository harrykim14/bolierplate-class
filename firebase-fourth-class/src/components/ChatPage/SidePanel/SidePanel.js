import React from 'react'
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';

function SidePanel(props) {
    return (
        <div style ={{
            backgroundColor: "#7B83EB",
            padding: '2rem',
            minHeight: '100vh',
            color: 'white',
            minWidth: '255px'
        }}>
            <UserPanel currentUser = { props.currentUser} />
            <Favorited currentUser = { props.currentUser} />
            <ChatRooms />
            <DirectMessages currentUser = { props.currentUser} />
        </div>
    )
}

export default SidePanel
