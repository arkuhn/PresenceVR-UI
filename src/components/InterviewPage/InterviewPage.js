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

class InterviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vidChat: false,
            fetching: false,
            messages: [],
            upToDate: false,
            socket: openSocket(API_URL),
            controllerMode: 'raycaster',
            participantStatuses: {},
            hostCamActive: false
        }
        console.log(props)
        socketEvents.registerEventHandlers(this.state.socket, this.addMessage, this.handleParticipantStatusChange, this.getCurrentUser, this.getUserStatus, this.props.updateInterviews)
    }

    videoToggled = () => {
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

    hostCamToggled = () => {
        console.error('===========')
        var message = {
            color: 'yellow',
            type: 'system',
            id: this.id + this.id
        }
        if(!this.state.hostCamActive){
            message.content = this.props.email + ' has activated Video Camera'
            this.state.socket.emit('message', message)
            this.setState({hostCamActive: true});
        } else {
            message.content = this.props.email + ' has disabled Video Camera'
            this.state.socket.emit('message', message)
            this.setState({hostCamActive: false});
        }
    }

    updateControllerMode = (type) => {
        this.setState({controllerMode: type})
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

    componentWillUnmount() {
        this.state.socket.disconnect()
    }

    componentDidMount() {
        this.state.socket.emit('join', {id: this.props._id + this.props._id, user: this.props.email })
        this.state.socket.emit('Marco', {id: this.props._id + this.props._id, caller: this.props.email});
    }

    componentWillReceiveProps(props) {
        if (props._id !== this.props._id) {
            this.setState({ messages: [],
                            hostCamActive: false,
                            vidChat: false })

            this.state.socket.emit('leave')
            this.state.socket.emit('join', {id: props._id + props._id, user: props.email })
            this.state.socket.emit('Marco', {id: props._id + props._id, caller: props.email});
        }
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

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
      }


    render() {
        const { activeIndex, loading } = this.state

        let videoToggle = this.state.vidChat ? (
            <VideoComponent interviewId={this.props._id} joined={true}/>) :
            <AframeInterview loadedAssets={this.props.loadedAssets}
                                updateInterviewCallback={this.props.updateInterviews}
                                environment={this.props.loadedEnvironment}
                                interviewId={this.props._id}
                                controllerMode={this.state.controllerMode}
                                user={this.props.email}
                                host={this.props.email === this.props.host}
                                hostCamToggled={this.state.hostCamActive}
                                hostName={this.props.host}/>

        return (
                <Grid padded centered width={14}>
           
                    <Grid.Column width={10}>
                        {/* Browser mode */}
                        <Grid.Row style={{height: '90vh'}}>
                            {videoToggle}
                        </Grid.Row>
                    </Grid.Column>

                    <Grid.Column width={4}>
                    <Grid.Row>
                        <Segment> 
                            <Header as='h3'>
                                Presentation hosted by {this.props.host}
                            </Header>
                        </Segment>

                        <Accordion id='dropdown' styled>
                            {/* Assets */}
                            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                                <Header as='h4'>
                                    <Icon circular name='boxes' />
                                    Assets
                                </Header>
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 0}>
                                <Assets type="web" 
                                    isHost={this.props.email === this.props.host} 
                                    loadedAssets={this.props.loadedAssets} 
                                    interview={this.props._id} 
                                    socket={this.state.socket}
                                    updateInterviewCallback={this.props.updateInterviews} />
                            </Accordion.Content>

                            {/* Environments */}
                            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                            <Header as='h4'>
                                <Icon circular name='image outline' />
                                Environments
                            </Header>
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 1}>
                                <Environments isHost={this.props.email === this.props.host} 
                                    socket={this.state.socket} 
                                    environment={this.props.loadedEnvironment} 
                                    interviewId={this.props._id} 
                                    updateInterviewCallback={this.props.updateInterviews}/>
                            </Accordion.Content>

                            {/* Participants */}
                            <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                            <Header as='h4'>
                                <Icon circular name='users' />
                                Participants
                            </Header>
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 2}>
                                <Participants updateHost={this.updateHost} 
                                    isHost={this.props.email === this.props.host} 
                                    participants={this.props.participants.concat(this.props.host)} 
                                    socket={this.state.socket}
                                    host={this.props.host}
                                    participantStatuses={this.state.participantStatuses}/>
                            </Accordion.Content>

                            {/* Config */}
                            <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
                                <Header as='h4'>
                                    <Icon bordered circular name='settings' />
                                    Configuration
                                </Header>
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 3}>
                                <Configuration isHost={this.props.email === this.props.host} 
                                    socket={this.state.socket}
                                    interview={this.props} 
                                    updateInterviewCallback={this.props.updateInterviews} 
                                    updateControllerMode={this.updateControllerMode}
                                    videoToggled={this.videoToggled}
                                    hostCamToggled={this.hostCamToggled}/>
                            </Accordion.Content>
                        </Accordion>

                        <Segment basic />

                        <Chat id={this.props._id + this.props._id} socket={this.state.socket} user={this.props.email} messages={this.state.messages}/>
                    </Grid.Row>
                    </Grid.Column>
                </Grid>
        );
    }
}

export default InterviewPage;
