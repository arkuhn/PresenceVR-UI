import React, { Component } from 'react';
import { Button, Checkbox, Form, Header, Popup, Radio, Container } from 'semantic-ui-react';
import CancelInterview from "../../InterviewOperations/cancelInterview";
import InterviewForm from "../../InterviewOperations/InterviewForm";
import LeaveInterview from "../../InterviewOperations/leaveInterview";

class Configuation extends Component {
    constructor(props) {
        super(props);
        this.state = {value: 'raycaster'};
    }

    /**
     * Handles change to physics engine
     */
    handleChange = (e, { value }) => {
        this.setState({ value });
        //updates controller to use new physics engine
        this.props.updateControllerMode(value);
    }

    /**
     * Gives control configurations
     * If host, gives edit and delete functionality
     * If not host, only gives leave functionality
     */
    getInterviewControls = () => {
        let interviewControls;
        //checks for host; only host can edit interviews
        if (this.props.isHost) {
            interviewControls = 
            <Button.Group>
                <InterviewForm socket={this.props.socket} type='edit' id={this.props.interview._id} 
                    participants={this.props.interview.participants} 
                    date={this.props.interview.occursOnDate} 
                    time={this.props.interview.occursAtTime} 
                    details={this.props.interview.details} />

                <CancelInterview socket={this.props.socket} goHome={this.props.goHome} id={this.props.interview._id} />
            </Button.Group>
                
        //everyone else can only leave their interviews
        } else {
            interviewControls = <LeaveInterview socket={this.props.socket} goHome={this.props.goHome} id={this.props.interview._id} />
        }
        return interviewControls;
    }

    /**
     * Shows help text when hovered over
     */
    getPopOutContent = () => {
        let popupContent;
        //gives host actions
        if (this.props.isHost) {
            popupContent = 'As the host you can edit or delete the interview.';
        //gives participant actions
        } else {
            popupContent = 'As a particpant you may leave the interview.';
        }
        return popupContent;
    }

    /**
     * Function for physics form
     * allows user to choose their physics engine
     * TODO: make this work, still buggy
     */
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


    /**
     * Renders configuration section on interview page
     */
    render() {

        let presenterCam = '';
        //if host, show toggle for presenter cam
        if (this.props.isHost) {
            presenterCam = <div>
                <Header sub>
                Presenter camera in VR
                </Header>
                <Checkbox toggle label="Presenter camera in VR:" checked={this.props.hostCamInVR} onChange={this.props.updateHostCamInVR}/>
            </div>
        }

        return (
            <Container>
                <Container textAlign='center'>
                <Header sub>
                Interview Options:
                </Header>
                {this.getInterviewControls()}
                </Container>

                <br />
   
                <Container textAlign='center'>
                <Header sub>
                Grab Options:
                </Header>
                {this.getPhysicsControls()}
                </Container>

                <br />

                <Container textAlign='center'>
                <Header sub>
                Video conferencing:
                </Header>
                <Checkbox toggle label="Enable Video Chat" value="default" onChange={this.props.videoToggled}/>
                </Container>

                <br />

                <Container textAlign='center'>
                {presenterCam}
                </Container>

                <Popup trigger={<Header icon='keyboard' content='CONTROLS' as="h4"/>}  position="right center" content =" Use WASD to move directions while using the webpage. Click the goggles button to enter VR mode. 
                                            While in VR, you can interact with assets using the two grab modes described in the configuration box." />
                
            </Container>
        );
    }
}

export default Configuation;