import React, { Component } from 'react';
import { Accordion, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import openSocket from 'socket.io-client';
import { API_URL } from '../../config/api.config';
import InterviewAPI from "../../utils/InterviewAPI";
import socketEvents from '../../utils/socketEvents';
import AframeInterview from "./aframe/aframeInterview";
import Chat from "./chat";
import Assets from "./config/assets";
import Configuration from "./config/configuration";
import Environments from "./config/environments";
import './InterviewPage.css';
import Participants from "./participants";
import VideoComponent from "./video/videoComponent";

class InterviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vidChat: false,
            inVR: false,
            messages: [],
            socket: openSocket(API_URL),
            controllerMode: 'raycaster',
            participantStatuses: {},
            fetching: false,
            render: true,
            interview : {
                participants: [],
                hostCamInVR: false,
                loadedEnvironment: 'default',
                host: '',
                loadedAssets: []
            },
            totalParticipants: []
        }
        
        // Pass the connected socket to a file that registers all event handlers and passes them response functions.
        socketEvents.registerEventHandlers(this.state.socket, this.addMessage, this.handleParticipantStatusChange, this.getCurrentUser, this.getUserStatus, this.updateInterview)
    }

    componentWillMount() {
        //Join socket room on mount
        this.state.socket.emit('join', {id: this.props._id + this.props._id, user: this.props.email })
        this.state.socket.emit('Marco', {id: this.props._id + this.props._id, caller: this.props.email});
        this.updateInterview() // Get the interview from the server
    }

    componentWillUnmount() {
        //Disconnect our socket on unmount
        this.state.socket.emit('leave')
    }

    componentWillReceiveProps(props) {
        //If the interview has changed, reset the state 
        if (props._id !== this.props._id) {
            this.setState({render: false,
                            messages: [],
                            hostCamActive: false,
                            vidChat: false,
                            interview : {
                                participants: [],
                                hostCamInVR: false,
                                loadedEnvironment: 'default',
                                host: '',
                                loadedAssets: []
                            }
            }, ()=> {
                // Leave the old socket and rejoin with the new interview ID
                this.state.socket.emit('leave') 
                /*
                TODO: Use only one socket through easyrtc/NAF connection. 
                At the moment, we use our own websocket which is why the id is (id + id)
                */
                this.state.socket.emit('join', {id: props._id + props._id, user: props.email })
                this.state.socket.emit('Marco', {id: props._id + props._id, caller: props.email});
                this.updateInterview() // Get the new interview
            })
        }
    }

    /*
    Generic handle click/active index state updater taken from SemanticUIReact Docs
    */
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }

    /*
    When a client hits the toggle, send a message to all other clients for the sys log
    */
    handleVideoToggle = () => {
        var message = {
            color: 'yellow',
            type: 'system',
            id: this.props._id + this.props._id
        }

        this.setState(function(state, props) {
            if (!state.vidChat) {
                message.content = this.props.email + ' has entered video chat mode'
            }
            else {
                message.content = this.props.email + ' has left video chat mode'
            }
            // Flip the status of vidChat
            return {vidChat: !state.vidChat}
        }, () => {
            // Once the state is flipped, tell other clients
            this.state.socket.emit('message', message)
            this.state.socket.emit('Marco', {id: this.props._id + this.props._id, caller: this.props.email});
        })
    }

   /*
    Callback for when the host client clicks show cam in VR
   */
   handleHostCamInVRToggle = () => {
    var message = {
        color: 'yellow',
        type: 'system',
        id: this.props._id + this.props._id
    }

    var state = this.state;

    if (!state.hostCamActive) {
        message.content = this.props.email + ' has turned on camera in VR'
    }
    else {
        message.content = this.props.email + 'has turned off camera in VR'
    }
    
    /*
    1. update the backend interview with hostCam on or off
    2. update the state
    3. tell other clients we have updated
    */
    InterviewAPI.patchInterview(this.props._id, 'hostCamInVR', !state.hostCamActive, 'replace')
        .then(() => {
            //TODO: this should only happen on a 200
            this.setState((state, props) => ({
                hostCamActive: !state.hostCamActive
            }), () => {
                this.state.socket.emit('update')
                this.state.socket.emit('message', message)
            });        
        })
    }

    /*
    Callback for config to update physics mode passed into aframeInterview
    */
    updateControllerMode = (type) => {
        this.setState({controllerMode: type})
    }

    /*
    If we aren't already updating the interview, get fresh data from the backend. 
    */
    updateInterview = () => {
        if (!this.state.fetching) {
            this.setState({fetching: true}, () => {
                InterviewAPI.getInterview(this.props._id).then((response) => {
                    let interview = response.data
                    // Total participants = list of participants + host
                    let total = interview.participants.slice()
                    total.unshift(interview.host) // Unshift puts host at index 0
                    let totalParticipants = total
                    this.setState({interview, totalParticipants,  fetching: false, render: true})
                })
            })    
        }
    }

    /*
    Callback when host passes permissions to a partcipant.
    */
    updateHost = (newHost) => {
        // Build new participants array which excludes the new host and includes the old host
            const newParticipants = (this.state.interview.participants).filter(participant => participant !== newHost)
            newParticipants.push(this.state.interview.host)
            let newParString = newParticipants.join() 
    
            // Patch the backend with new list of participants
            return InterviewAPI.updateInterview( {participants: newParString}, this.props._id)
                    .then((response) => {
                        // One participants are updated, pass host to the new person.
                        // This has to happen AFTER the participants update since only the host can patch interviews
                        return InterviewAPI.updateInterview( {host: newHost}, this.props._id)
                    })
                    .then(() => {
                        // Drop a message in syslog and update all connected clients
                        var message = {
                            color: 'yellow',
                            type: 'system',
                            content: newHost + ' has become the host.',
                            id: this.props._id + this.props._id
                        }
                        this.state.socket.emit('message', message)
                        return this.state.socket.emit('update')
                    })
        
    }

    /*
    Callback for sockets to get the current user
    */
    getCurrentUser = () => {
        return this.props.email;
    }
    
    /*
    Callback for sockets to add and render a message
    */
    addMessage = (message) => {
        this.setState({messages: this.state.messages.concat([message])})
    }

    /*
    Callback for sockets when a status update comes in
    */
    handleParticipantStatusChange = (data) => {
        this.setState(state => {
            let statuses = state.participantStatuses;
            statuses[data.user] = data.status;
            return {
                participantStatuses: statuses,
            }
        });
    }

    /*
    Callback to update the state of whether this user is in VR mode (headset) or not.
    */
    handleVRModeUpdate = (inVR) => {
        this.setState({inVR: inVR});
    }


    /*
    Get the current status of the user.
    The status values are:
        0 = offline
        1 = online
        2 = online and in VR mode
        3 = online and in Video Conferencing mode
    */
    getUserStatus = () => {
        // TODO: standardize what each status value means

        // If they are in VR mode
        if(this.state.inVR) {
            return 2;
        }

        // If they are in Video Conferencing mode
        else if(this.state.vidChat) {
            return 3;
        }

        // Otherwise, they are just online
        else {
            return 1;
        }
    }

    render() {
        const { activeIndex, interview, totalParticipants } = this.state
        /*
        This is used to force a remount when the interview changes. 
        We originally only passed props to update interviews, but this revealed
        race conditions in the NAF and Twilio connect/disconnect code.
        */
        if (!this.state.render) {
            return ''
        }

        // If video toggle is on, show VideoComponent, otherwise show Aframe
        let videoToggle = this.state.vidChat ? (
            <VideoComponent interviewId={this.props._id} joined={true} participants={this.state.interview.participants}/>) :
            <AframeInterview loadedAssets={interview.loadedAssets}
                                updateInterviewCallback={this.updateInterview}
                                environment={interview.loadedEnvironment}
                                interviewId={this.props._id}
                                controllerMode={this.state.controllerMode}
                                user={this.props.email}
                                socket={this.state.socket}
                                host={this.props.email === interview.host}
                                hostCamInVR={interview.hostCamInVR}
                                updateHostCamInVR={this.handleHostCamInVRToggle}
                                hostName={interview.host}
                                handleVRModeUpdate={this.handleVRModeUpdate}/>
        return (
                <Grid centered width={14}>
           
                    {/* Center column (aframe + chat) */}
                    <Grid.Column width={10}>
                        {/* Browser mode */}
                        <Grid.Row style={{height: '65vh'}}>
                            {videoToggle}
                        </Grid.Row>

                        <br />

                        <Grid.Row style={{height: '30vh'}}>
                            <Chat id={this.props._id + this.props._id} socket={this.state.socket} user={this.props.email} messages={this.state.messages}/>

                        </Grid.Row>

                    </Grid.Column>

                    {/* Right column (host, assets/envs/config, particpants) */}
                    <Grid.Column width={4}>
                    <Grid.Row style={{maxHeight: '95vh', height: '95vh', overflowY: 'scroll'}}>
                        <Segment> 
                            <Header as='h3'>
                                Presentation hosted by {interview.host}
                            </Header>
                        </Segment>

                            <Accordion  id='dropdown' styled>
                                {/* Assets */}
                                <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                                    <Header as='h4'>
                                        <Icon circular name='boxes' />
                                        Assets
                                    </Header>
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === 0}>
                                    <Assets type="web" 
                                        isHost={this.props.email === interview.host} 
                                        loadedAssets={interview.loadedAssets} 
                                        interview={this.props._id} 
                                        socket={this.state.socket}
                                        updateInterviewCallback={this.updateInterview} />
                                </Accordion.Content>

                                {/* Environments */}
                                <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                                <Header as='h4'>
                                    <Icon circular name='image outline' />
                                    Environments
                                </Header>
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === 1}>
                                    <Environments isHost={this.props.email === interview.host} 
                                        socket={this.state.socket} 
                                        environment={interview.loadedEnvironment} 
                                        interviewId={this.props._id} 
                                        updateInterviewCallback={this.updateInterview}/>
                                </Accordion.Content>


                                {/* Config */}
                                <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                                    <Header as='h4'>
                                        <Icon bordered circular name='settings' />
                                        Configuration
                                    </Header>
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === 2}>
                                    <Configuration isHost={this.props.email === interview.host} 
                                        goHome={this.props.goHome}
                                        socket={this.state.socket}
                                        interview={interview} 
                                        updateInterviewCallback={this.updateInterview} 
                                        updateControllerMode={this.updateControllerMode}
                                        videoToggled={this.handleVideoToggle}
                                        updateHostCamInVR={this.handleHostCamInVRToggle}
                                        hostCamInVR={interview.hostCamInVR}/>
                                </Accordion.Content>
                            </Accordion>

                            <Segment style={{maxHeight: '35vh', overflowY: 'auto'}}>
                                     {/* Participants */}
                            <Header as='h4'>
                                <Icon circular name='users' />
                                Participants
                            </Header>
                                <Participants updateHost={this.updateHost}
                                    isHost={this.props.email === interview.host} 
                                    participants={totalParticipants} 
                                    socket={this.state.socket}
                                    host={interview.host}
                                    participantStatuses={this.state.participantStatuses}/>
                        </Segment>

                </Grid.Row>
      

                    </Grid.Column>
                </Grid>
        );
    }
}

export default InterviewPage;
