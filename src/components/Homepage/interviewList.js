import React, { Component } from 'react';
import { Card, Dimmer, Divider, Grid, Header, List, Loader } from 'semantic-ui-react';
import { firebaseAuth } from '../../utils/firebase';
import InterviewAPI from '../../utils/InterviewAPI';
import InterviewCard from '../InterviewCard/interviewCard';
import InterviewForm from '../InterviewCard/InterviewForm';


class InterviewList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            interviews: [],
            loading: false
        }
    }

    updateList = () => {
        this.setState({loading: true})
        InterviewAPI.getAllInterviews(this.props.hostEmail).then((interviews) => {  
            if(interviews){
                this.setState({interviews: interviews.data});
            }
            this.setState({loading: false})
        });
    }

    componentDidMount() {
        this.updateList()
    }

    populateList  = (type) => {
        if (this.state.loading) {
            return (<div>
                <br/>
                <br/>
                <Dimmer active inverted>
                    <Loader> Loading schedule </Loader>
                </Dimmer>
            </div>)
        }
        if (this.state.interviews.length === 0) {
            return (
            <List.Item>
            <List.Content>
                <List.Header>No interviews to show!</List.Header>
            </List.Content>
            </List.Item>)
        }
        
    
        let interviewCards = [];
        this.state.interviews.forEach((interview) => {
            let query = interview.host !== firebaseAuth.currentUser.email
            let hosting = false;
            let face = ''
            if (type === 'host') {
                query = interview.host === firebaseAuth.currentUser.email
            }
           
            if (interview.host === firebaseAuth.currentUser.email) {
                face = firebaseAuth.currentUser.photoURL;
                hosting = true;
            }
            
            if (query) {
                interviewCards.push(
                    <InterviewCard participants={interview.participants} 
                                    details={interview.details}
                                    date={interview.occursOnDate} 
                                    time={interview.occursAtTime}
                                    image={face} 
                                    icon='calendar alternate outline'
                                    id={interview._id}
                                    host={hosting} />
                )
            }
        })
        return interviewCards
    }

    render() {
        return (
            <div>
                <Grid centered divided>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Header as='h2'>
                                <Header.Content>
                                    Hosted Interviews
                                </Header.Content>
                            </Header>                 
                            <Divider />
                            <Card.Group>            
                                {this.populateList('host')}
                            </Card.Group>
                            <InterviewForm updateInterviewListCallback={this.updateList} type='create'/>

                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header as='h2'>
                                <Header.Content>
                                    Participating Interviews
                                </Header.Content>
                            </Header>
                            <Divider />
                            <Card.Group>
                                {this.populateList('participant')}
                            </Card.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default InterviewList;