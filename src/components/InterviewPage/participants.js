import React, { Component } from 'react';
import { Header, Icon, List, Button, Modal } from 'semantic-ui-react';
import InterviewAPI from '../../utils/InterviewAPI';


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
            <Icon corner color='green' onClick={this.handleOpen} name='chess queen' circular link aria-hidden='Make host' />
        }>
        <Header as='h1' icon='user plus' content={`Are you sure you want to make ${this.props.name} the host?`} />
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
        if (this.props.isHost) {
            hostFunctions = <List.Content floated='right'>
                                {this.makeHostModal()}
                            </List.Content>
        }
        return (
            <List.Item as='a' active={false}>
            <List.Content floated='left'>
            <Icon name='user circle' />
            </List.Content>
                <List.Content floated='left'>
                    <List.Header>{this.props.name}</List.Header>
                    <List.Description>
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
        const statuses = ["Online", "Offline"]
        if (this.props.participants.length === 0) {
            return <p> No particpants added!</p>
        }
        return this.props.participants.map((participant, index) => {
            return <Participant key={index} isHost={this.props.isHost} updateHost={this.props.updateHost} name={participant} status={statuses[Math.floor(Math.random() * 2)]}/>
        })
    }

    render() {
        const css = ` 
        .ParticipantsList {
            overflow-y:auto;
            max-width: 100%;
            max-height: 600px;
            overflow-x: hidden;
        }
        `
        return (
            <div className="ParticipantsBox">
            <Header as='h3'>
                <Icon name='users' />
                Participants
            </Header>
            <List selection={true} className="ParticipantsList">

                {this.generateParticipants()}
            </List>
            <style>{css}</style>
            </div>
        );
    }
}

export default Participants;