import React from 'react';
import { Button, Header, Input, List, Modal, Icon } from 'semantic-ui-react';
import InterviewAPI from '../../utils/InterviewAPI';

class InterviewForm extends React.Component {
    constructor(props) {
        super(props)
        //checks for create trigger
        if (this.props.type === 'create') {
            this.icon = 'alternate calendar outline'
            //positive button becomes create
            this.positiveButtonName = 'Create Interview'
            this.negativeButtonName = 'Cancel Create'
            this.title = 'Create an Interview'
            //date is set from the start, but all other values are blank
            this.state = {dateValue: props.date,
                timeValue: '',
                participantsValue: '',
                detailsValue: '',
                modalOpen: false};
        }

        //checks for edit trigger
        if (this.props.type === 'edit') {
            this.icon = 'pencil';
            //positive button becomes edit
            this.positiveButtonName = 'Edit Interview';
            this.negativeButtonName = 'Cancel Edit';
            this.title = 'Edit an Interview';
            //values are prefilled to stored content
            this.state = {
                dateValue: props.date,
                timeValue: props.time,
                participantsValue: props.participants.join(),
                detailsValue: props.details,
                id: props.id,
                modalOpen: false
            };
        }

    }

    /** 
     * Sets appropriate field of interview to the value of
     * field being updated
     */
    handleFieldUpdate = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
  
    /**
     * handler for submitting full form
     */
    handleSubmit = (event) => {
        let data = {
            details: this.state.detailsValue,
            occursOnDate: this.state.dateValue,
            occursAtTime: this.state.timeValue,
            participants: this.state.participantsValue
        };

        //checks trigger for create
        if (this.props.type === 'create') {
            InterviewAPI.createInterview(data).then(() =>{ 
                if (this.props.socket) {
                    //updates all clients
                    this.props.socket.emit('update');
                } else {
                    //if no socket, updates just this client
                    this.props.updateInterviewListCallback();
                }
            });
        //if trigger is not set to create, it must be edit
        } else {
            InterviewAPI.updateInterview(data, this.state.id).then(() => {
                //check for socket
                if (this.props.socket) {
                    //update all clients
                    this.props.socket.emit('update');
                } else {
                    //update just this client
                    this.props.updateInterviewListCallback();
                }
            })
        }
        this.setState({ modalOpen: false });
        
        event.preventDefault();
    }

    /**
     * Handler for closing form
     */

    handleClose = (event) => {
        this.setState({ modalOpen: false });
    }

    /** 
     * Handler for opening form
     */
    handleOpen = (event) => {
        this.setState({ modalOpen: true });
    }

    /**
     * Checks trigger for edit button or create button
     */
    getTrigger = () => {
        if (this.props.type === 'create') {
            return <Button attached='bottom' basic   onClick={this.handleOpen}  > <Icon name='pencil' /> New Presentation </Button>;
        } else {
            return <Button active basic color='grey' onClick={this.handleOpen}  >Edit</Button>;
        }
    } 

    /**
     * Renders interview form
     */
    render() {
        return (
            <Modal size='small' open={this.state.modalOpen} onClose={this.handleCancel} trigger={this.getTrigger()} >
            <Header icon={this.icon} content={this.title} />
            <Modal.Content>
                <List>
                    <List.Item>
                        <Input fluid label='Description' value={this.state.detailsValue} placeholder='Art interview' name='detailsValue' onChange={this.handleFieldUpdate} />
                    </List.Item>
                    <List.Item>
                        <Input fluid label='Date' value={this.state.dateValue} placeholder='MM/DD/YYYY' name='dateValue' onChange={this.handleFieldUpdate} />
                    </List.Item>
                    <List.Item>
                        <Input fluid label='Time' value={this.state.timeValue} placeholder='HH:MM:SS' name='timeValue' onChange={this.handleFieldUpdate} />
                    </List.Item>
                    <List.Item>
                        <Input fluid label='Participants' value={this.state.participantsValue} placeholder={'email or for multiple, email,email'} name='participantsValue' onChange={this.handleFieldUpdate} />
                    </List.Item>
                </List>
            </Modal.Content>
            <Modal.Actions>
                <Button primary onClick={this.handleSubmit}>{this.positiveButtonName}</Button>
                <Button secondary onClick={this.handleClose}>{this.negativeButtonName}</Button>
            </Modal.Actions>
            </Modal>
        );
    }

}

export default InterviewForm;