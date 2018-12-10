import React, { Component } from 'react';
import './Homepage.css';
import { Redirect } from 'react-router-dom';
import PresenceVRNavBar from "../PresenceVRNavBar/PresenceVRNavBar"
import InterviewList from "./interviewList"
import InterviewForm from '../InterviewCard/InterviewForm'
import { Button, Header, Icon, Grid, Segment, Menu, List, Card, Popup, Divider} from 'semantic-ui-react';
import {firebaseAuth} from '../../utils/firebase'

class Homepage extends Component {
    
    constructor(props){
        super(props);
    }

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