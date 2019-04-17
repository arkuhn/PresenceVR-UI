import React, { Component } from 'react';
import { Checkbox, Form, Header, Popup, Icon, Container } from 'semantic-ui-react';
import InterviewAPI from '../../../utils/InterviewAPI';

class Environments extends Component {

    handleChange = (e, { value }) => {
        this.setState({ value })
        InterviewAPI.updateInterview({loadedEnvironment: value}, this.props.interviewId).then ((response) =>{
            this.props.socket.emit('update')
        })
    }

    getPopUp = () => {
        if (this.props.isHost) {
            return 'As the host you may change the environment of the interview to one of these presets'
        }
        else if (!this.props.isHost) {
            return 'As a participant you cannot change the environment of the interview'
        }
        else {
            return 'You should not be here'
        }
    }

    render() {
        return (
            <Container textAlign='center'>
                <Form>
                    <Form.Field>
                    <Checkbox
                        slider
                        disabled={!this.props.isHost}
                        label='Default'
                        name='checkboxRadioGroup'
                        value='default'
                        checked={this.props.environment === 'default'}
                        onChange={this.handleChange}
                    />
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        slider
                        disabled={!this.props.isHost}
                        label='Starry'
                        name='checkboxRadioGroup'
                        value='starry'
                        checked={this.props.environment === 'starry'}
                        onChange={this.handleChange}
                    />
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        slider
                        disabled={!this.props.isHost}
                        label='Japan'
                        name='checkboxRadioGroup'
                        value='japan'
                        checked={this.props.environment === 'japan'}
                        onChange={this.handleChange}
                    />
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        slider
                        disabled={!this.props.isHost}
                        label='Tron'
                        name='checkboxRadioGroup'
                        value='tron'
                        checked={this.props.environment === 'tron'}
                        onChange={this.handleChange}
                    />
                    </Form.Field>
                </Form>
            </Container>
        );
    }
}

export default Environments;