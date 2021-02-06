import React, { Component } from 'react'
import MessageForm from './MessageForm'
import MessageHeader from './MessageHeader'

export class MainPanel extends Component {
    render() {
        return (
            <div style = {{ padding: '2rem 2rem 0 2rem'}}>
                <MessageHeader />
                <div style = {{
                    width: '100%',
                    height: '450px',
                    border: '.2rem solid #ececec',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto'
                }}>

                </div>
                <MessageForm />
            </div>
        )
    }
}

export default MainPanel
