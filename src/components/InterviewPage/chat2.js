import React, {Component} from 'react'
import { Icon, Input, List, Container, Segment} from 'semantic-ui-react'
import { firebaseAuth } from '../../utils/firebase'

function randomString() {
    var string = '';
    var length = Math.random() * (360 - 100) + 100
    for (var i=0; i <= length; i++) {
        string += (Math.floor(Math.random())).toString()
    }
    return string
}


class Chat2 extends Component {
    constructor(props) {
        super(props)
        this.state = {messages: [{author: 'example@example.com', content: randomString()},
            {author: firebaseAuth.currentUser.email, content: randomString()},
            {author: 'example@example.com', content: randomString()},
            {author: firebaseAuth.currentUser.email, content: randomString()}]}
    }

    

    getMessages = () => {
        return this.state.messages.map((message) => {
            var floated = 'left'
            if (message.author === firebaseAuth.currentUser.email) {
                floated = 'right'
            }
            return (<List.Item>
                    <List.Content floated={floated}>
                        <List.Header as='Header' floated={floated}> <Icon name='user circle' /> {message.author} </List.Header>
                    </List.Content>
                    <List.Content floated={floated}>
                    <div style={{'word-wrap': 'break-word'}}>
                    <Container fluid text>
                    {message.content}

                    </Container> 
                    </div>
                    </List.Content>
                    </List.Item>)
        })
    }
 
  render() {
    const css = ` 
        .ChatBox {
            overflow-y:auto;
            max-width: 100%;
            max-height: 160px;
            height: 160px;
        }
        ` 
    const messages = this.getMessages
    return (<div>
        <Segment className='ChatBox' >
        <List>
        {this.getMessages()}
        </List>
        </Segment>
          
        <Input fluid
            icon={<Icon name='send' />}
            placeholder='Wrtie a message...'
        />
        <style>{css}</style>
    </div>)
  }
}

export default Chat2;  