import React, {Component} from 'react'
import { Icon, Input, Message, List, Label, Segment, Button} from 'semantic-ui-react'
import {style} from '../../utils/style'

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: ''
        }
    }

    componentDidMount() {
        var input = document.getElementById("messageInput");

        // Execute a function when the user releases a key on the keyboard
        input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("sendButton").click();
        }
        });
    }

    handleFieldUpdate = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSend = () => {
        if (this.state.message !== ''){
            this.props.socket.emit('message', {author: this.props.user, 
                content: this.state.message,
                id: this.props.id
            })
        
            this.setState({message: ''})
        }
    }

    getMessages = () => {

        if (this.props.messages.length === 0) {
            return <b>No messages to show yet!</b>

        }
        return this.props.messages.map((message, index) => {
            if (message.type === 'system') {
                return (
                 <List.Item key={index}>
                    <Message info color={message.color} size='tiny' header={message.content}  />
                </List.Item>)
                     
            }
            var floated = 'left'
            if (message.author ===  this.props.user) {
                floated = 'right'
            }
            return (<List.Item key={index}>
                    <List.Content floated={floated}>
                        <List.Header as='Header' style={{color: this.props.nightMode ? style.nmText: style.text}} floated={floated}> <Icon name='user circle' /> {message.author} </List.Header>
                    </List.Content>
                    <List.Content floated={floated}>
                    <div style={{'word-wrap': 'break-word'}}>
                    <Label size='large' style={{'word-wrap': 'break-word'}} pointing={floated}>{message.content}</Label>
                    </div>
                    </List.Content>
                    </List.Item>)
        })
    }
 
  render() {
    return (<div>
        <Segment  style={{backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG + ' !important', 
                            maxWidth: '100%', maxHeight: '160px', height: '160px', overflowY: 'auto',
                            color: this.props.nightMode ? style.nmText: style.text }} >
        <List  >
        {this.getMessages()}
        </List>
        </Segment>
          
        <Input fluid id='messageInput'
            name ='message' 
            value={this.state.message}
            style={{backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG + ' !important', color: this.props.nightMode ? style.nmText: style.text }}
            onChange={this.handleFieldUpdate}
            placeholder='Write a message...'
            labelPosition='right'
            label={<Button id='sendButton' icon='send' onClick={this.handleSend}/>}
        />
        
    </div>)
  }
}

export default Chat;  