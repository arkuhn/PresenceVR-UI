import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import React, { Component } from 'react';
import { Checkbox, Form, Header, Icon } from 'semantic-ui-react';
import InterviewAPI from '../../utils/InterviewAPI';

class Environments extends Component {

    handleChange = (e, { value }) => {
        this.setState({ value })
        console.log(this.state)
        InterviewAPI.updateInterview({loadedEnvironment: value}, this.props.interviewId).then ((response) =>{
            this.props.updateInterviewCallback();
        })
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
                    <Icon name='image outline' />
                    Environments
                </Header>
                <Form>
                    <Form.Field>
                    Selected environment: <b>{this.props.environment}</b>
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        toggle
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