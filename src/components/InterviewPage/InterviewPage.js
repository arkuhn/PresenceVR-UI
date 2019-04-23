import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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
import {style} from '../../utils/style'


class InterviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vidChat: false,
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
        
        socketEvents.registerEventHandlers(this.state.socket, this.addMessage, this.handleParticipantStatusChange, this.getCurrentUser, this.getUserStatus, this.updateInterview)
    }

    componentWillMount() {
        console.error('IP MOUNTING')
        this.state.socket.emit('join', {id: this.props._id + this.props._id, user: this.props.email })
        this.state.socket.emit('Marco', {id: this.props._id + this.props._id, caller: this.props.email});
        this.updateInterview()
    }

    componentWillUnmount() {
        console.error('IP UN MOUNTING')
        this.state.socket.emit('leave')
    }

    componentWillReceiveProps(props) {
        console.error('IP PROPS NEW')
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
                this.state.socket.emit('leave')
                this.state.socket.emit('join', {id: props._id + props._id, user: props.email })
                this.state.socket.emit('Marco', {id: props._id + props._id, caller: props.email});
                this.updateInterview()
            })
        }
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    handleVideoToggle = () => {
        var message = {
            color: 'yellow',
            type: 'system',
            id: this.props._id + this.props._id
        }
        if(!this.state.vidChat){
            message.content = this.props.email + ' has entered video chat mode'
            this.state.socket.emit('message', message)
            this.setState({vidChat: true});
        } else {
            message.content = this.props.email + ' has left video chat mode'
            this.state.socket.emit('message', message)
            this.setState({vidChat: false});
        }
    }

    handleHostCamInVRToggle = () => {
        var message = {
            color: 'yellow',
            type: 'system',
            id: this.props._id + this.props._id
        }
        let toggle;
        if(!this.state.hostCamActive){
            message.content = this.props.email + ' has turned on camera in VR'
            toggle = true;
        } else {
            message.content = this.props.email + 'has turned off camera in VR'
            toggle = false;
        }
        InterviewAPI.patchInterview(this.props._id, 'hostCamInVR', toggle, 'replace')
        .then(() => {
            this.state.socket.emit('message', message)
            this.state.socket.emit('update')
            this.setState({hostCamActive: toggle});
        })
        
    }

    updateControllerMode = (type) => {
        this.setState({controllerMode: type})
    }

    updateInterview = () => {
        if (!this.state.fetching) {
            this.setState({fetching: true}) 
            InterviewAPI.getInterview(this.props._id).then((response) => {
                let interview = response.data
                let total = interview.participants.slice()
                total.unshift(interview.host)
                let totalParticipants = total
                this.setState({interview, totalParticipants,  fetching: false, render: true})
            })
        }
    }

    updateHost = (newHost) => {
        const newParticipants = (this.props.participants).filter(participant => participant !== newHost)
        newParticipants.push(this.props.host)
        let newParString = newParticipants.join() 
        return InterviewAPI.updateInterview( {participants: newParString}, this.props._id)
                .then((response) => {
                    return InterviewAPI.updateInterview( {host: newHost}, this.props._id)
                })
                .then(() => {
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

    getCurrentUser = () => {
        return this.props.email;
    }
    
    addMessage = (message) => {
        this.setState({messages: this.state.messages.concat([message])})
    }

    handleParticipantStatusChange = (data) => {
        this.setState(state => {
            let statuses = state.participantStatuses;
            statuses[data.user] = data.status;
            return {
                participantStatuses: statuses,
            }
        });
    }

    getUserStatus = () => {
        // TODO: standardize what each status value means
        // TODO: check for VR/Video chat mode
        return 1
    }


    render() {
        console.error(this.props.nightMode, '=========')
        const { activeIndex, interview, totalParticipants } = this.state
        if (!this.state.render) {
            return ''
        }

        let menuHeight = '20vh';
        let participantHeight = '60vh'
        if (activeIndex === 0 || activeIndex === 1 || activeIndex === 2) {
            menuHeight = '55vh';
            participantHeight = '25vh'
        }


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
                                hostName={interview.host}/>
        return (
                <Grid centered width={14}>
           
                    <Grid.Column width={10}>
                        {/* Browser mode */}
                        <Grid.Row style={{height: '65vh'}}>
                            {videoToggle}
                        </Grid.Row>

                        <br />

                        <Grid.Row style={{height: '30vh'}}>
                            <Chat id={this.props._id + this.props._id} nightMode={this.props.nightMode} socket={this.state.socket} user={this.props.email} messages={this.state.messages}/>

                        </Grid.Row>

                    </Grid.Column>

                    <Grid.Column style={{maxHeight: '90vh',  overflowY: 'auto'}} width={4}>
                    <Grid.Row >
                        <Segment style={{backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG   }}> 
                            <Header style={{color: this.props.nightMode ? style.nmText: style.text}}  as='h3'>
                                Presentation hosted by {interview.host}
                            </Header>
                        </Segment>
                        </Grid.Row>

                        <br />
                        <Grid.Row>

                        <div style={{maxHeight: menuHeight}}>
                            <Accordion id='dropdown' styled>
                                {/* Assets */}
                                <Accordion.Title style={{backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG   }} active={activeIndex === 0} index={0} onClick={this.handleClick}>
                                    <Header style={{ color: this.props.nightMode ? style.nmText: style.text}} as='h4'>
                                        <Icon circular name='boxes' />
                                        Assets
                                    </Header>
                                </Accordion.Title>
                                <Accordion.Content  style={{backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG   }} active={activeIndex === 0}>
                                    <Assets type="web" 
                                        isHost={this.props.email === interview.host} 
                                        loadedAssets={interview.loadedAssets} 
                                        interview={this.props._id} 
                                        nightMode={this.props.nightMode}
                                        socket={this.state.socket}
                                        updateInterviewCallback={this.updateInterview} />
                                </Accordion.Content>

                                {/* Environments */}
                                <Accordion.Title  style={{backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG   }} active={activeIndex === 1} index={1} onClick={this.handleClick}>
                                <Header style={{ color: this.props.nightMode ? style.nmText: style.text}} as='h4'>
                                    <Icon circular name='image outline' />
                                    Environments
                                </Header>
                                </Accordion.Title>
                                <Accordion.Content  style={{backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG   }} active={activeIndex === 1}>
                                    <Environments isHost={this.props.email === interview.host} 
                                        socket={this.state.socket} 
                                        environment={interview.loadedEnvironment} 
                                        nightMode={this.props.nightMode}
                                        interviewId={this.props._id} 
                                        updateInterviewCallback={this.updateInterview}/>
                                </Accordion.Content>


                                {/* Config */}
                                <Accordion.Title  style={{backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG   }} active={activeIndex === 2} index={2} onClick={this.handleClick}>
                                    <Header style={{ color: this.props.nightMode ? style.nmText: style.text}} as='h4'>
                                        <Icon bordered circular name='settings' />
                                        Configuration
                                    </Header>
                                </Accordion.Title>
                                <Accordion.Content  style={{backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG   }} active={activeIndex === 2}>
                                    <Configuration isHost={this.props.email === interview.host} 
                                        goHome={this.props.goHome}
                                        socket={this.state.socket}
                                        interview={interview} 
                                        nightMode={this.props.nightMode}
                                        updateInterviewCallback={this.updateInterview} 
                                        updateControllerMode={this.updateControllerMode}
                                        videoToggled={this.handleVideoToggle}
                                        updateHostCamInVR={this.handleHostCamInVRToggle}
                                        hostCamInVR={interview.hostCamInVR}/>
                                </Accordion.Content>
                            </Accordion>

                        </div>


 
                    </Grid.Row>
                    <br />
                    <Grid.Row >
                    <Segment style={{maxHeight: participantHeight, overflowY: 'auto', backgroundColor: this.props.nightMode ? style.nmSecondaryBG: style.secondaryBG  }}>
                                     {/* Participants */}
                            <Header style={{ color: this.props.nightMode ? style.nmText: style.text}} as='h4'>
                                <Icon circular name='users' />
                                Participants
                            </Header>
                                <Participants updateHost={this.updateHost}
                                    isHost={this.props.email === interview.host} 
                                    participants={totalParticipants} 
                                    socket={this.state.socket}
                                    nightMode={this.props.nightMode}
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
