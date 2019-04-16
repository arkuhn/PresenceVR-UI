import React, { Component } from 'react';
import { Button, Checkbox, Form, Header, Popup, Radio } from 'semantic-ui-react';
import CancelInterview from "../../InterviewOperations/cancelInterview";
import InterviewForm from "../../InterviewOperations/InterviewForm";
import LeaveInterview from "../../InterviewOperations/leaveInterview";

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
                <InterviewForm socket={this.props.socket} type='edit' id={this.props.interview._id} 
                    participants={this.props.interview.participants} 
                    date={this.props.interview.occursOnDate} 
                    time={this.props.interview.occursAtTime} 
                    details={this.props.interview.details} />

                <CancelInterview updateInterviewCallback={this.props.updateInterviewCallback} id={this.props.interview._id} />
            </Button.Group>
                
        } else {
            interviewControls = <LeaveInterview socket={this.props.socket} id={this.props.interview._id} />
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

        let presenterCam = ''
        if (this.props.isHost) {
            presenterCam = <div>
                <Header sub>
                Presenter camera in VR
                </Header>
                <Checkbox toggle label="Presenter camera in VR" checked={this.props.hostCamInVR} onChange={this.props.updateHostCamInVR}/>
            </div>
        }

        return (
            <div>
                <Header sub>
                Interview Options:
                </Header>
                {this.getInterviewControls()}

                <Header sub>
                Grab Options:
                </Header>
                {this.getPhysicsControls()}

                <Header sub>
                Video conferencing:
                </Header>
                <Checkbox toggle label="Enable Video Chat" value="default" onChange={this.props.videoToggled}/>

                {presenterCam}

                <Popup trigger={<Header icon='keyboard' content='CONTROLS' as="h4"/>}  position="right center" content =" Use WASD to move directions while using the webpage. Click the goggles button to enter VR mode. 
                                            While in VR, you can interact with assets using the two grab modes described in the configuration box." />
                
            </div>
        );
    }
}

export default Configuation;