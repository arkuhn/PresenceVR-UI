import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, Dimmer, Grid, Header, Image, Loader, Menu, Divider } from 'semantic-ui-react';
import { firebaseAuth } from '../../utils/firebase';
import InterviewAPI from "../../utils/InterviewAPI";
import InterviewForm from '../InterviewOperations/InterviewForm';
import InterviewPage from '../InterviewPage/InterviewPage';
import PresenceVRNavBar from "../PresenceVRNavBar/PresenceVRNavBar";
import './Homepage.css';
import InterviewCard from "./interviewCard";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            loading: true,
            activeItem: 'home',
            interviews: []
        })
    }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
    }

    returnHome = () => {
        this.setState({ activeItem: 'home'})
    }

    componentWillMount() {
        this.setState({loading: true})
        // Bind the variable to the instance of the class.
        this.authFirebaseListener = firebaseAuth.onAuthStateChanged((user) => {
            this.setState({ user }, () => { this.updateInterviews() });
            
        })
        
    }

    updateInterviews = () => {
            InterviewAPI.getAllInterviews(this.state.user.email).then((interviews) => {
                let interviewData;
                interviews ? interviewData = interviews.data : interviewData = []
                this.setState({loading: false, interviews:interviewData})
            });
    }

    componentWillUnmount() {
        this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
    }

    renderInterviews = (type) => {
        const { activeItem, user, interviews} = this.state
        let renderInterviews = []
        
        interviews.forEach((interview, index) => {
            let content= <InterviewCard participants={interview.participants} 
                            details={interview.details}
                            date={interview.occursOnDate} 
                            time={interview.occursAtTime}
                            active={activeItem === interview._id}
                            image={''} 
                            icon='calendar alternate outline'
                            id={interview._id}
                            updateInterviewListCallback={this.updateInterviews}
                            host={false} 
                            key={index}/>

            let query = interview.host !== user.email
            if (type === 'host') {
                query = interview.host === user.email
            }
            if(query) {
                renderInterviews.push(<Menu.Item content={content} id="interviewItem" name={interview._id} active={activeItem === interview._id} onClick={this.handleItemClick} />)
            }
        })
        return renderInterviews
    }

    renderActiveItem = () => {
        if (this.state.activeItem === 'home') {
            return <Grid width={14}>
                <Grid.Column width={5} />
                <Grid.Column width={9}>
                <Card fluid={true} >
                    <Card.Content>
                        <Image src="/images/presencevr2.jpg" />
                        <Card.Description>
                            <span>
                            Welcome!
                            </span>
                        </Card.Description>
                        </Card.Content>
                        <Card.Content extra={true}>
                            A R.I.T Career Services project
                        </Card.Content>
                    </Card>
                </Grid.Column>
                </Grid>
        } else {
            var interview = this.state.interviews.filter(interview => {
                return interview._id === this.state.activeItem
            })
            
            if (!interview) {
                return <p>oh dear</p>
            }

            interview = interview[0]
            
            return <InterviewPage _id={interview._id} 
                details={interview.details}
                participants={interview.participants}
                time={interview.occursAtTime}
                date={interview.occursOnDate}
                loadedEnvironment={interview.loadedEnvironment}
                host={interview.host}
                email={this.state.user.email}
                hostCamInVR={interview.hostCamInVR}
                loadedAssets={interview.loadedAssets}
                updateInterviews={this.updateInterviews}
            />
        }
    }

    render() {
            if (this.state.loading || this.state.fetching) {
                return <Dimmer active>
                            <Loader />
                        </Dimmer>
            }
            if (!this.state.loading && !this.state.user) {
                return <Redirect to='/'/>
            }
            const style= {
                height: '38vh',
                overflow: 'auto',
                scrollbarWidth: 'none'
            }

            return (
                <div className="Homepage">
                <PresenceVRNavBar goHome={this.returnHome} email={this.state.user.email}/>
                <br/>
                <Grid padded>
                    <Grid.Column style={{scrollbarWidth: 'none'}}width={2}>
                    <Grid.Row>
                    <Menu  className="interviewList" pointing   vertical >
                            <Menu.Header as='h4'> 
                                <Header style={{paddingTop: '10px'}} textAlign='center'>
                                    Your Presentations 
                                </Header>
                            </Menu.Header>
                            
                            <Menu.Menu style={style}>
                                {this.renderInterviews('host')}
                            </Menu.Menu>
                            <InterviewForm updateInterviewListCallback={this.updateInterviews} type='create'/>

                        </Menu>


                    </Grid.Row>

                    <Grid.Row>
                        <br />

                    </Grid.Row>

                    <Grid.Row>
                    <Menu  className="interviewList" pointing   vertical >
                            <Menu.Header as='h4'> 
                                <Header style={{paddingTop: '10px'}} textAlign='center'>
                                    Shared With You 
                                </Header>
                            </Menu.Header>
                            <Menu.Menu style={style}>
                                {this.renderInterviews('participant')}
                            </Menu.Menu>
                        </Menu>
                    </Grid.Row>
        
                    </Grid.Column>
                    
                    <Grid.Column width={14}>
                        {this.renderActiveItem()}
                    </Grid.Column>

                    </Grid>
                    
                </div>
            );
    }
}

export default Homepage;