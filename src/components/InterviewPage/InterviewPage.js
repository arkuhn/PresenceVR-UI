import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Checkbox, Dimmer, Divider, Grid, Header, Icon, Loader, Popup } from 'semantic-ui-react';
import openSocket from 'socket.io-client';
import { API_URL } from '../../config/api.config';
import { firebaseAuth } from '../../utils/firebase';
import InterviewAPI from "../../utils/InterviewAPI";
import socketEvents from '../../utils/socketEvents';
import PresenceVRNavBar from "../PresenceVRNavBar/PresenceVRNavBar";
import AframeInterview from "./aframeInterview";
import Assets from "./assets";
import Chat from "./chat";
import Configuration from "./configuration";
import Environments from "./environments";
import Host from "./host";
import './InterviewPage.css';
import Participants from "./participants";
import VideoComponent from "./videoComponent";


class InterviewPage extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
        this.state = {interview: {
            participants: [],
            loadedAssets: [],
            details: '',
            host: '',
            vidChat: false
        },
        messages: [],
        upToDate: false,
        socket: openSocket(API_URL),
        controllerMode: 'raycaster',
        participantStatuses: {}
        }

        socketEvents.registerEventHandlers(this.state.socket, this.addMessage, this.handleParticipantStatusChange, this.getUserStatus)
        this.updateInterview = this.updateInterview.bind(this);
        this.videoToggled = this.videoToggled.bind(this);
    }

    videoToggled = () => {
        var message = {
            color: 'yellow',
            type: 'system',
            id: this.id + this.id
        }
        if(!this.state.vidChat){
            message.content = this.state.user.email + ' has entered video chat mode'
            this.state.socket.emit('message', message)
            this.setState({vidChat: true});
        } else {
            message.content = this.state.user.email + ' has left video chat mode'
            this.state.socket.emit('message', message)
            this.setState({vidChat: false});
        }
    }
    
    updateInterview() {
        return InterviewAPI.getInterview(this.id).then((data) => {
            if(data){
                console.log('got data');
                console.log(data.data);
                this.setState({
                    interview: data.data,
                    upToDate: true
                });
            }
        });
    }

    updateControllerMode = (type) => {
        console.log(type)
        this.setState({controllerMode: type})
    }

    updateHost = (newHost) => {
        const newParticipants = (this.state.interview.participants).filter(participant => participant !== newHost)
        newParticipants.push(this.state.interview.host)
        let newParString = newParticipants.join()
        return InterviewAPI.updateInterview( {participants: newParString}, this.state.interview._id)
                .then((response) => {
                    console.log(response)
                    return InterviewAPI.updateInterview( {host: newHost}, this.state.interview._id)
                })
                .then((response) => {
                    return this.updateInterview()
                })
    }

    //This is a temp fix for losing state on refresh
    componentDidUpdate() {
        if (!this.state.upToDate) {
            this.updateInterview()
        }
    }
    
    componentWillMount() {
        this.setState({loading: true})
        // Bind the variable to the instance of the class.
        this.authFirebaseListener = firebaseAuth.onAuthStateChanged((user) => { 
          this.setState({
            loading: false,  // For the loader maybe
            user // User Details
          });
          this.state.socket.emit('join', {id: this.id + this.id, user: firebaseAuth.currentUser.email })
          this.state.socket.emit('Marco', {id: this.id + this.id, caller: firebaseAuth.currentUser.email});
          // Could add Marco to join functionality, but it may be best to keep the Marco call general so it can be called at any time
        });
        this.updateInterview()
        
    }
    
    addMessage = (message) => {
        this.setState({messages: this.state.messages.concat([message])})
    }

    handleParticipantStatusChange = (data) => {
        this.setState(state => {
            let statuses = state.participantStatuses;
            statuses[data.caller] = data.status;
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

    componentWillUnmount() {
        this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
    }


    render() {
        if (this.state.loading) {
            return <Dimmer active>
                        <Loader />
                    </Dimmer>
        }
        if (!this.state.loading && !this.state.user) {
            return <Redirect to='/'/>
        }

        if (!this.state.upToDate) {
            return <Dimmer active>
                        <Loader />
                    </Dimmer>
        }

        let isHost = (this.state.user.email === this.state.interview.host)
        let isParticipant = this.state.interview.participants.includes(this.state.user.email)
        
        
        let videoToggle = this.state.vidChat ? (<VideoComponent interviewId={this.id} joined={true}/>) :
            (<div><AframeInterview loadedAssets={this.state.interview.loadedAssets}
                updateInterviewCallback={this.updateInterview}
                 environment={this.state.interview.loadedEnvironment}
                  interviewId={this.id}
                  controllerMode={this.state.controllerMode}/></div>);

        if (this.state.upToDate && !isHost && !isParticipant) {
            return <Redirect to='/'/>
        }

        return (
            <div className="InterviewPage">
                <PresenceVRNavBar/>
                <br/>
                <Grid centered padded divided>
                    {/* Header */}
                    <Grid.Row>
                        <Grid.Column  width={4}>
                        <Header as='h1' textAlign='center'>
                            <Header.Content>
                            {this.state.interview.details}
                            <Header.Subheader>Hosted by {this.state.interview.host}</Header.Subheader>
                            </Header.Content>
                        </Header>
                        </Grid.Column>
                    </Grid.Row>

                    {/* Left column*/}
                    <Grid.Column width={4}>

                        {/* Host */}
                        <Grid.Row>
                            <Host  host={this.state.interview.host} />
                        </Grid.Row>

                        {/*Participants*/}
                        <Divider />
                        <Grid.Row>
                            <Participants   updateHost={this.updateHost} 
                                            isHost={isHost} 
                                            participants={this.state.interview.participants} 
                                            participantStatuses={this.state.participantStatuses}/>
                        </Grid.Row>

                        <Divider />
                        <Grid.Row>
                            <Configuration isHost={isHost} 
                                    interview={this.state.interview} 
                                    updateInterviewCallback={this.updateInterview} 
                                    updateControllerMode={this.updateControllerMode}/>
                        </Grid.Row>
                        
                        <Divider />
                        <Grid.Row>
                            <Checkbox toggle label="Enable Video Chat" value="default" onChange={this.videoToggled}/>
                        </Grid.Row>
                    </Grid.Column>


                    {/* Center Column*/}
                    <Grid.Column width={8}>
                        {/* Browser mode */}
                        <Grid.Row>
                            {videoToggle}

                        </Grid.Row>
                        
                        <Divider/>
                        {/* Chat */}
                        <Grid.Row>
                            <Chat id={this.id + this.id} socket={this.state.socket} user={this.state.user.email} messages={this.state.messages}/>
                        </Grid.Row>
                    </Grid.Column>


                    {/* Right column*/}
                    <Grid.Column  width={4}>
                        {/* Environments */}
                        <Grid.Row>
                            <Environments isHost={isHost} environment={this.state.interview.loadedEnvironment} interviewId={this.id} updateInterviewCallback={this.updateInterview}/>
                        </Grid.Row>
                        <Divider/>
                        {/* Assets */}
                        <Grid.Row>
                            <Assets type="web" isHost={isHost} loadedAssets={this.state.interview.loadedAssets} interview={this.id} updateInterviewCallback={this.updateInterview}/>
                        </Grid.Row>
                    </Grid.Column>

                </Grid>
            </div>
        );
    }
}

export default InterviewPage;

{/* <AframeInterview loadedAssets={this.state.interview.loadedAssets}
                                             updateInterviewCallback={this.updateInterview}
                                              environment={this.state.interview.loadedEnvironment}
                                               interviewId={this.id}
                                               controllerMode={this.state.controllerMode}/>
                            <Popup trigger={
                                <Header floated="right" as="h4">
                                <Icon name="keyboard" />
                                    CONTROLS
                                </Header>
                            }  position="bottom right" content =" Use WASD to move directions while using the webpage. Click the goggles button to enter VR mode. 
                                                            While in VR, you can interact with assets using the two grab modes described in the configuration box." />
                                                            <br/> */}