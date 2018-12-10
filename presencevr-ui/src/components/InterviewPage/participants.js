import React, { Component } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';

function Participant(props) {
    return (
    <List.Item as='a'>
        <Icon name='user circle' />
        <List.Content>
            <List.Header>{props.name}</List.Header>
            <List.Description>
            Status: {props.status}
            </List.Description>
        </List.Content>
    </List.Item>
    )
}


class Participants extends Component {
    generateParticipants() {
        const statuses = ["Online", "Offline"]
        if (this.props.participants.length === 0) {
            return <p> No particpants added!</p>
        }
        return this.props.participants.map((participant) => {
            return <Participant name={participant} status={statuses[Math.floor(Math.random() * 2)]}/>
        })
    }

    render() {
        const css = ` 
        .ParticipantsList {
            height: 700px;
            overflow:scroll;
            max-width: 100%;
            overflow-x: hidden;
        }
        `
        return (
            <div className="ParticipantsBox">
            <Header as='h3'>
                <Icon name='users' />
                Participants
            </Header>
            <List className="ParticipantsList">
                {this.generateParticipants()}
            </List>
            <style>{css}</style>
            </div>
        );
    }
}

export default Participants;