import React, { Component } from 'react';
import { Button, Header, Icon, List, Modal, Popup, Container } from 'semantic-ui-react';
import { style } from '../../utils/style'

class Participant extends Component {
    constructor(props) {
        super(props);
        this.state = {
                      modalOpen: false};
    
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleSubmit = (event) => {
        this.props.updateHost(this.props.name).then(() => {
            this.setState({ modalOpen: false })
            this.setState({ modalOpen: false })
            event.preventDefault();
        })
    }

    handleOpen = (event) => {
        this.setState({ modalOpen: true })
    }

    handleCancel = (event) => {
        this.setState({ modalOpen: false })
    }

    makeHostModal = () => {
        return (<Modal basic size='small' open={this.state.modalOpen} onClose={this.handleCancel} trigger={ 
            <Icon corner color='green' onClick={this.handleOpen} name='chess queen' circular link />
        }>
        <Header as='h1' icon='chess queen' content={`Are you sure you want to make ${this.props.name} the host?`} />
        <Header as='h3'>This means they can change the environment, remove participants and update interview details.</Header>
        <Header as='h3'>*You will only become host again if they grant it back to you.*</Header>
        <Modal.Content>
            <Button color='green' onClick={this.handleSubmit} inverted>
                <Icon name='checkmark' /> Yes
            </Button>
            <Button color='red' onClick={this.handleCancel} inverted>
                <Icon name='cancel' /> No
            </Button>
        </Modal.Content>
        </Modal>)
    }

    removeFromInterview = () => {

    }

    render() {
        let hostFunctions;
        if (this.props.isHost && this.props.name !== this.props.host) {
            hostFunctions = <List.Content floated='right'>
                                {this.makeHostModal()}
                            </List.Content>
        }
        let icon = 'user circle'
        if (this.props.host === this.props.name) {
            icon = 'chess queen'
        }
        return (
            <List.Item >
            <List.Content floated='left'>
            <Icon name={icon} />
            </List.Content>
                <List.Content  floated='left'>
                    <List.Header style={{ color: this.props.nightMode ? style.nmText: style.text}}>{this.props.name}</List.Header>
                    <List.Description style={{ color: this.props.nightMode ? style.nmText: style.text }}>
                    Status: {this.props.status}
                    </List.Description>
                </List.Content>
                {hostFunctions}
            </List.Item>
        )
    }
}


class Participants extends Component {
    generateParticipants() {
        const statuses = [
            <span>&#160;Offline <Icon color='red' size='small' name='circle thin' /></span>,
            <span>&#160;Online <Icon color='green' size='small' name='circle thin' /></span>
            ];
        let participants = this.props.participants
        if (participants.length === 0) {
            return <p> No particpants added!</p>
        }
        return participants.map((participant, index) => {
            let status = this.props.participantStatuses[participant] ? this.props.participantStatuses[participant] : 0;

            return <Participant nightMode={this.props.nightMode} key={index} isHost={this.props.isHost} host={this.props.host} updateHost={this.props.updateHost} name={participant} status={statuses[status]}/>
        })
    }

    getPopUp = () => {
        if (this.props.isHost) {
            return 'You, the host, may remove participants, or pass host to another particpant in the interview.'
        }
        else if (!this.props.isHost) {
            return 'As a participant you cannot modify who is in the interview or who has hosting permissions.'
        }
        else {
            return 'You should not be here'
        }
    }

    render() {
        
        return (
            <Container style={{ color: this.props.nightMode ? style.nmText: style.text}} >
                    <List divided className="ParticipantsList">
                    {this.generateParticipants()}
                    </List>
            </Container>
        
        
        );
    }
}

export default Participants;