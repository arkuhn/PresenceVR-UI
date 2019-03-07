import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Divider, Grid, Header, Icon, Dimmer, Loader } from 'semantic-ui-react';
import { firebaseAuth } from '../../utils/firebase';
import InterviewAPI from "../../utils/InterviewAPI";
import PresenceVRNavBar from "../PresenceVRNavBar/PresenceVRNavBar";
import AframeInterview from "./aframeInterview";
import Assets from "./assets";
import ChatPane from "./chat";
import Environments from "./environments";
import './InterviewPage.css';
import Participants from "./participants";
import Host from "./host"

class InterviewPage extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
        this.state = {interview: {
            participants: [],
            loadedAssets: [],
            details: '',
            host: ''
        },
        upToDate: false}

        this.updateInterview = this.updateInterview.bind(this);
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
        });
        this.updateInterview()
        
    }

    componentWillUnmount() {
        this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
    }

    configuration() {
        return (
                <div>
                <Header as='h3'>
                    <Icon name='settings' />
                    Configuration
                </Header>
                <Button.Group>
                <Button>Edit Interview</Button>
                <Button.Or />
                <Button negative>Exit Interview</Button>
            </Button.Group>
            </div>
        );
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

        let isHost = (this.state.user.email === this.state.interview.host)
        
        return (
            <div className="InterviewPage">
                <PresenceVRNavBar/>
                <br/>
                <Grid centered divided>

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
                            <Participants updateHost={this.updateHost} participants={this.state.interview.participants}/>
                        </Grid.Row>

                        <Divider />
                        <Grid.Row>
                            {this.configuration()}
                        </Grid.Row>
                    </Grid.Column>


                    {/* Center Column*/}
                    <Grid.Column width={8}>
                        {/* Browser mode */}
                        <Grid.Row>
                            <AframeInterview loadedAssets={this.state.interview.loadedAssets} updateInterviewCallback={this.updateInterview} environment={this.state.interview.loadedEnvironment} interviewId={this.id}/>
                            <br/>
                            <br/>
                        </Grid.Row>
                        
                        <Divider/>
                        {/* Chat */}
                        <Grid.Row>
                            <ChatPane />
                        </Grid.Row>
                    </Grid.Column>


                    {/* Right column*/}
                    <Grid.Column width={4}>
                        {/* Environments */}
                        <Grid.Row>
                            <Environments isHost={isHost} environment={this.state.interview.loadedEnvironment} interviewId={this.id} updateInterviewCallback={this.updateInterview}/>
                        </Grid.Row>
                        <Divider/>
                        {/* Assets */}
                        <Grid.Row>
                            <Assets type="web" loadedAssets={this.state.interview.loadedAssets} interview={this.id} updateInterviewCallback={this.updateInterview}/>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default InterviewPage;