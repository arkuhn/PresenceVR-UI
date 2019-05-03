import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import InterviewAPI from '../../utils/InterviewAPI';
import { firebaseAuth } from '../../utils/firebase';

class LeaveInterview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                      id: props.id,
                      modalOpen: false};
    }

    /**
     * Handler for submitting leave request to interview
     */
    handleSubmit = () => {
        InterviewAPI.patchInterview(this.props.id, 'participants', firebaseAuth.currentUser.email, 'remove').then(() => {
            this.setState({ modalOpen: false });
            //check for other clients connected to this interview
            if (this.props.socket) {
                //update all clients
                this.props.socket.emit('update');
                //go to home page
                this.props.goHome();
            }
        })
    }

    /**
     * Handler for opening form
     */
    handleOpen = () => {
        this.setState({ modalOpen: true });
    }

    /**
     * Handler for closing form
     */
    handleCancel = () => {
        this.setState({ modalOpen: false });
    }

    /**
     * Renders check leave form
     */
    render() {
        return (
            <Modal basic size='small' open={this.state.modalOpen} onClose={this.handleCancel} trigger={ 
                <Button active basic color='red' onClick={this.handleOpen} size='small' > Leave </Button>     
            }>
            <Header icon='alternate calendar outline' content='Are you sure you want to leave this interview?' />
            <Modal.Content>
                <Button color='green' onClick={this.handleSubmit} inverted>
                    <Icon name='checkmark' /> Yes
                </Button>
                <Button color='red' onClick={this.handleCancel} inverted>
                    <Icon name='cancel' /> No
                </Button>
            </Modal.Content>
            </Modal>
        );
    }
}

export default LeaveInterview;