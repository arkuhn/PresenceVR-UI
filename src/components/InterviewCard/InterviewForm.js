import React from 'react';
import { Button, Header, Input, List, Modal } from 'semantic-ui-react';
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
            InterviewAPI.createInterview(data).then(() => this.props.updateInterviewListCallback())
        } else {
            InterviewAPI.updateInterview(data, this.state.id).then(() => this.props.updateInterviewListCallback())
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
            return <Button circular icon='add' onClick={this.handleOpen} floated='right' size='small' />
        } else {
            return <Button basic onClick={this.handleOpen} color='grey' >Edit</Button>
        }
    }

    render() {
        return (
            <Modal size='small' open={this.state.modalOpen} onClose={this.handleCancel} trigger={this.getTrigger()} >
            <Header icon={this.icon} content={this.title} />
            <Modal.Content>
                <List>
                    <List.Item>
                        <Input fluid label='Date' value={this.state.dateValue} placeholder='MM/DD/YYYY' name='dateValue' onChange={this.handleFieldUpdate} />
                    </List.Item>
                    <List.Item>
                        <Input fluid label='Time' value={this.state.timeValue} placeholder='HH:MM:SS' name='timeValue' onChange={this.handleFieldUpdate} />
                    </List.Item>
                    <List.Item>
                        <Input fluid label='Participants' value={this.state.participantsValue} placeholder={'No one, I guess'} name='participantsValue' onChange={this.handleFieldUpdate} />
                    </List.Item>
                    <List.Item>
                        <Input fluid label='Details' value={this.state.detailsValue} placeholder='Art interview' name='detailsValue' onChange={this.handleFieldUpdate} />
                    </List.Item>
                </List>
                <Button primary onClick={this.handleSubmit}>{this.positiveButtonName}</Button>
                <Button secondary onClick={this.handleClose}>{this.negativeButtonName}</Button>
            </Modal.Content>
            </Modal>
        );
    }

}

export default InterviewForm;