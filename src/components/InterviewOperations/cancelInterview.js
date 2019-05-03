import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import InterviewAPI from '../../utils/InterviewAPI';

class CancelInterview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                      id: props.id,
                      modalOpen: false};
    }

    /**
     * handler for deleting interviews
     */
    handleSubmit = (event) => {
        InterviewAPI.deleteInterview(this.props.id)
        .then(() => {
            //redirects client to home page
            this.props.goHome();
        });
        this.setState({ modalOpen: false });
        //prevents the default of
        event.preventDefault();
    }

    /**
     * Handler for opening the delete form
     */
    handleOpen = (event) => {
        this.setState({ modalOpen: true });
    }

    /**
     * Handler for closing the delete form
     */
    handleCancel = (event) => {
        this.setState({ modalOpen: false });
    }

    /**
     * Renders the delete form
     */
    render() {
        return (
            <Modal basic size='small' open={this.state.modalOpen} onClose={this.handleCancel} trigger={ 
                <Button basic  active color='red' onClick={this.handleOpen} floated='right' size='small' > Delete </Button>     
            }>
            <Header icon='alternate calendar outline' content='Are you sure you want to delete this interview?' />
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

export default CancelInterview;