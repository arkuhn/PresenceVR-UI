import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Dimmer, Divider, Grid, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import { firebaseAuth } from '../../utils/firebase';
import InterviewForm from '../InterviewCard/InterviewForm';
import PresenceVRNavBar from "../PresenceVRNavBar/PresenceVRNavBar";
import './Homepage.css';
import InterviewList from "./interviewList";

class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            loading: true,
        })
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
            return (
                <div className="Homepage">
                    <PresenceVRNavBar/>
                    <Grid centered className='ui grid'>
                        
                        {/* Header */}
                        <Grid.Column width={3} />
    
                        <Grid.Column width={10}>
                            <Grid.Row>
                                <br/>
                                <Header as='h1'>
                                    <Icon name='calendar alternate outline' />
                                    <Header.Content>
                                            Interview Schedule
                                        </Header.Content>
                                    
                                    
                                    <Divider />
                                </Header>
                            </Grid.Row>
                            
                            <InterviewList hostEmail={firebaseAuth.currentUser.email}/>
    
                            <Segment basic floated='right'>
                                <InterviewForm type='create'/>
                            </Segment>
    
                        </Grid.Column>
    
                        <Grid.Column width={3} />
                                
                    </Grid>
                </div>
            );
    }
}

export default Homepage;