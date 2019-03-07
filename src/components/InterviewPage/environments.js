import React, { Component } from 'react';
import { Checkbox, Form, Header, Popup, Icon } from 'semantic-ui-react';
import InterviewAPI from '../../utils/InterviewAPI';

class Environments extends Component {

    handleChange = (e, { value }) => {
        this.setState({ value })
        console.log(this.state)
        InterviewAPI.updateInterview({loadedEnvironment: value}, this.props.interviewId).then ((response) =>{
            this.props.updateInterviewCallback();
        })
    }

    getPopUp = () => {
        if (this.props.isHost) {
            return 'You, the host, may change the environment of the interview to one of these presets'
        }
        else if (!this.props.isHost) {
            return 'As a participant you cannot change the environment of the interview'
        }
        else {
            return ' You should not be here'
        }
    }

    render() {
        const css = ` 
        .EnvironmentsList {
            height:250px;
            overflow:scroll;
            max-width: 100%;
            overflow-x: hidden;
        }
        `

        return (
            <div>
                <Header as='h3'>
                    <Popup trigger={<Icon name='image outline' />} content={this.getPopUp()}/>
                    Environments
                </Header>
                <Form>
                    <Form.Field>
                    Selected environment: <b>{this.props.environment}</b>
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        toggle
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
                        toggle
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
                        toggle
                        label='Japan'
                        name='checkboxRadioGroup'
                        value='japan'
                        checked={this.props.environment === 'japan'}
                        onChange={this.handleChange}
                    />
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        toggle
                        disabled={!this.props.isHost}
                        label='Tron'
                        name='checkboxRadioGroup'
                        value='tron'
                        checked={this.props.environment === 'tron'}
                        onChange={this.handleChange}
                    />
                    </Form.Field>
                </Form>
                <style>{css}</style>
            </div>
        );
    }
}

export default Environments;