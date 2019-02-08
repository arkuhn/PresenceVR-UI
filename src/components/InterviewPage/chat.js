import React, { Component } from 'react';
import { Header, Icon } from 'semantic-ui-react';


function ChatMessage(props) {
    return (
        <p>
            <span className="ChatUsername">
                {props.user + ": "}
            </span>
            <span className="ChatMessage">
                {props.message}
            </span>
            <span className="ChatTimestamp">
                {props.timestamp.toLocaleTimeString()}
            </span>
        </p>
        );
}

class ChatBox extends Component {
    render() {
        const messages = this.props.messages;

        return messages.map((message, index) => {
            return <ChatMessage key={index} user={message.user} message={message.message} timestamp={message.timestamp} />
        });
    }
}

class ChatBar extends Component {
    render() {
        return(
            <form>
                <input type="text" name="message" />
                <input type="submit" value="Send" />
            </form>
        )
    }
}

class ChatPane extends Component {
    constructor(props) {
        super(props);
        this.state = {messages: []}
    }

    componentDidMount() {
        const message1 = {
            user: 'Bob Johnson',
            message: 'Welcome to your interview! We are looking for someone with a strong initiative to do what they are told. Is that you?',
            timestamp: new Date(),
        }
        const message2 = {
            user: 'Alice Smith',
            message: 'I am if you say I am!',
            timestamp: new Date(),
        }
        this.setState(state => ({
            messages: [message1, message2]
        }));
    }

    render() {
        const css = ``;

        return(
            <div>
                <Header as='h3'>
                    <Icon name='chat' />
                    Chat
                </Header>
                <ChatBox messages={this.state.messages} />
                <ChatBar />
                <style>{css}</style>
            </div>
        )
    }
}

export default ChatPane;