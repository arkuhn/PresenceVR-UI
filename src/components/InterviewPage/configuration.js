import React, { Component } from 'react';
import { Header, Icon, Button, Popup, Form, Radio} from 'semantic-ui-react';
import InterviewForm from "../InterviewCard/InterviewForm"
import CancelInterview from "../InterviewCard/cancelInterview"
import LeaveInterview from "../InterviewCard/leaveInterview"

class Configuation extends Component {
    constructor(props) {
        super(props)
        this.state = {value: 'raycaster'}
    }

    handleChange = (e, { value }) => {
        this.setState({ value })
        this.props.updateControllerMode(value)
    }

    getInterviewControls = () => {
        let interviewControls;
        if (this.props.isHost) {
            interviewControls = 
            <Button.Group>
                <InterviewForm updateInterviewListCallback={this.updateInterview} type='edit' id={this.props.interview._id} 
                    participants={this.props.interview.participants} 
                    date={this.props.interview.occursOnDate} 
                    time={this.props.interview.occursAtTime} 
                    details={this.props.interview.details} />

                <CancelInterview updateInterviewListCallback={this.props.updateInterviewListCallback} id={this.props.interview._id} />
            </Button.Group>
                
        } else {
            interviewControls = <LeaveInterview id={this.props.interview._id} />
        }
        return interviewControls;
    }

    getPopOutContent = () => {
        let popupContent;
        if (this.props.isHost) {
            popupContent = 'As the host you can edit or delete the interview.'
        } else {
            popupContent = 'As a particpant you may leave the interview.'
        }
        return popupContent;
    }

    getPhysicsControls = () => {
        return <Form>
                    <Form.Field>
                    <Popup trigger={
                    <Radio
                        label='Point, Click, and Drag mode'
                        name='radioGroup'
                        value='raycaster'
                        checked={this.state.value === 'raycaster'}
                        onChange={this.handleChange}
                    />
                    } position="right center" content="Use this mode if you want to point a laser and click to grab your assets. (supports basic controllers - Daydream)"/>
                    </Form.Field>
                    <Form.Field>
                    <Popup trigger={
                    <Radio
                        label='Hand/Grab mode'
                        name='radioGroup'
                        value='grab'
                        checked={this.state.value === 'grab'}
                        onChange={this.handleChange}
                    />
                    } position="right center" content="Use this mode if you want to grab your assets (using advanced controllers - VIVE, Occulus)"/>
                    </Form.Field>
                </Form>
    }


    render() {

        return (
            <div>
                <Popup trigger = {
                <Header as='h3'>
                    <Icon bordered circular name='settings' />
                    Configuration
                </Header>
                } content={this.getPopOutContent()} />

                <Header sub>
                Interview Controls:
                </Header>
                {this.getInterviewControls()}

                <Header sub>
                Grab Controls:
                </Header>
                {this.getPhysicsControls()}


            </div>
        );
    }
}

export default Configuation;