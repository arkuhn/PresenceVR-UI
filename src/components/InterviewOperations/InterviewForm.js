import React from 'react';
import { Button, Header, Input, List, Modal, Icon } from 'semantic-ui-react';
import InterviewAPI from '../../utils/InterviewAPI';

class InterviewForm extends React.Component {
    constructor(props) {
        super(props)
        if (this.props.type === 'create') {
            this.icon = 'alternate calendar outline'
            this.positiveButtonName = 'Create Interview'
            this.negativeButtonName = 'Cancel Create'
            this.title = 'Create an Interview'
            this.state = {dateValue: props.date,
                timeValue: '',
                participantsValue: '',
                detailsValue: '',
                modalOpen: false};
        }

        if (this.props.type === 'edit') {
            this.icon = 'pencil'
            this.positiveButtonName = 'Edit Interview'
            this.negativeButtonName = 'Cancel Edit'
            this.title = 'Edit an Interview'
            this.state = {
                dateValue: props.date,
                timeValue: props.time,
                participantsValue: props.participants.join(),
                detailsValue: props.details,
                id: props.id,
                modalOpen: false
            }
        }
        
        this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleFieldUpdate(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
  
    handleSubmit(event) {
        let data = {
            details: this.state.detailsValue,
            occursOnDate: this.state.dateValue,
            occursAtTime: this.state.timeValue,
            participants: this.state.participantsValue
        }

        if (this.props.type === 'create') {
            InterviewAPI.createInterview(data).then(() =>{ 
                if (this.props.socket) {
                    this.props.socket.emit('update')
                } else {
                    this.props.updateInterviewListCallback()
                }
            })
        } else {
            InterviewAPI.updateInterview(data, this.state.id).then(() => {
                if (this.props.socket) {
                    this.props.socket.emit('update')
                } else {
                    this.props.updateInterviewListCallback()
                }
            })
        }
        this.setState({ modalOpen: false })
        
        event.preventDefault();
    }

    handleClose(event) {
        this.setState({ modalOpen: false })
    }

    handleOpen(event) {
        this.setState({ modalOpen: true })
    }

    getTrigger() {
        if (this.props.type === 'create') {
            return <Button attached='bottom' basic   onClick={this.handleOpen}  > <Icon name='pencil' /> New Presentation </Button>
        } else {
            return <Button active basic color='grey' onClick={this.handleOpen}  >Edit</Button>
        }
    } 

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