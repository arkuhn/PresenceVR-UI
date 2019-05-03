import React, { Component } from 'react';
import { Button, Header, Icon, List, Modal, Popup, Container } from 'semantic-ui-react';


/*
Component representing a single participant on the interview page and their associated operations.
*/
class Participant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false // Used to track whether the makeHostModal is open or not.
        };
    }


    /*
    Function called when the user submits the makeHostModal
    */
    handleSubmit = (event) => {
        this.props.updateHost(this.props.name).then(() => {
            this.setState({ modalOpen: false })
            event.preventDefault();
        })
    }


    /*
    Function called when the makeHostModal is opened
    */
    handleOpen = (event) => {
        this.setState({ modalOpen: true })
    }


    /*
    Function called when the makeHostModal is closed
    */
    handleCancel = (event) => {
        this.setState({ modalOpen: false })
    }


    /*
    This modal pops up when the user attempts to hand over host privileges.
    It informs them that only the new host will have the ability to undo this operation.
    */
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


/*
Component handling the organization of all the participants on the interview page.
*/
class Participants extends Component {

    /*
    Create and return a list containing a participant component for each participant in this interview.
    */
    generateParticipants = () => {

        // JSX elements representing valid participant statuses. The participant status is an integer and is used to index into the statuses list.
        const statuses = [
            <span>&#160;Offline <Icon color='red' size='small' name='circle thin' /></span>,
            <span>&#160;Online <Icon color='green' size='small' name='circle thin' /></span>
            ];

        // Get all the participants in this interview. If there are none, return default text for this component.
        let participants = this.props.participants;
        if (participants && participants.length === 0) {
            return <p> No particpants added!</p>
        }

        // For each participant in the interview, create a Participant component.
        return participants.map((participant, index) => {

            // participantStatuses is a dictionary mapping participant emails to their status.
            // A participant either has a status or is not present in the dictionary in which case we consider them offline.
            let status = this.props.participantStatuses[participant] ? this.props.participantStatuses[participant] : 0;

            return <Participant key={index}  // Each component needs a unique key
                                isHost={this.props.isHost}  // Whether or not the current use is the host
                                host={this.props.host}  // Email of the host
                                updateHost={this.props.updateHost}  // Callback to update the current host
                                name={participant}  // Email of the current participant
                                status={statuses[status]}  // Integer representign the users current status
                                />
        });
    }


    render() {
        
        return (
            <Container>
                    <List divided className="ParticipantsList">
                    {this.generateParticipants()}
                    </List>
            </Container>
        
        
        );
    }
}

export default Participants;