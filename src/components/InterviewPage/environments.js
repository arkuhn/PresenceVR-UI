import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import React, { Component } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { Button, Form, Checkbox, Divider, Header, Icon, List, Modal } from 'semantic-ui-react';

registerPlugin(FilePondPluginImagePreview);

function Environment(props) {
    return (
    <List.Item as='a'>
        <Icon name={props.icon} />
        <List.Content>
            <List.Header>{props.name}</List.Header>
            <List.Description>
            Uploaded on {props.date}
            </List.Description>
        </List.Content>
    </List.Item>
    )
}


class Environments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 'default'
        }
        this.Environments = []
    }

    handleChange = (e, { value }) => {
        this.setState({ value })
        console.log(this.state)
    }


    generateEnvironments = () => {
        if (this.props.environments.length === 0) {
            return <p> No environments added!</p>
        }
        return this.props.environments.map((environment) => {
            return <Environment name={environment.name} date={'0/0/00'} icon='image outline'/>
        })
    }

    render() {
        this.environments= [] // Clear Environments everytime this is re-rendered

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
                    Selected environment: <b>{this.state.value}</b>
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        radio
                        toggle
                        label='Default'
                        name='checkboxRadioGroup'
                        value='default'
                        checked={this.state.value === 'default'}
                        onChange={this.handleChange}
                    />
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        radio
                        toggle
                        label='Starry'
                        name='checkboxRadioGroup'
                        value='starry'
                        checked={this.state.value === 'starry'}
                        onChange={this.handleChange}
                    />
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        radio
                        toggle
                        label='Japan'
                        name='checkboxRadioGroup'
                        value='japan'
                        checked={this.state.value === 'japan'}
                        onChange={this.handleChange}
                    />
                    </Form.Field>
                    <Form.Field>
                    <Checkbox
                        radio
                        toggle
                        label='Tron'
                        name='checkboxRadioGroup'
                        value='tron'
                        checked={this.state.value === 'tron'}
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