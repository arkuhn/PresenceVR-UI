import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Divider, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { firebaseAuth } from '../../utils/firebase';
import InterviewForm from '../InterviewCard/InterviewForm';
import PresenceVRNavBar from "../PresenceVRNavBar/PresenceVRNavBar";
import './Homepage.css';
import InterviewList from "./interviewList";

class Homepage extends Component {

    render() {
        if (!firebaseAuth.currentUser) {
            return <Redirect to='/' />
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