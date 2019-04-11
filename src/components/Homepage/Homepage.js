import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Dimmer, Divider, Grid, Header, Icon, Loader, Menu, Card, Image } from 'semantic-ui-react';
import { firebaseAuth } from '../../utils/firebase';
import PresenceVRNavBar from "../PresenceVRNavBar/PresenceVRNavBar";
import './Homepage.css';
import InterviewAPI from "../../utils/InterviewAPI";
import InterviewCard from "../InterviewCard/interviewCard"
import InterviewPage from '../InterviewPage/InterviewPage';
import InterviewForm from '../InterviewCard/InterviewForm'

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
        if (!this.state.fetching) {
            this.setState({fetching: true})
            InterviewAPI.getAllInterviews(this.state.user.email).then((interviews) => {
                let interviewData = interviews.data;
                if (!interviews) {
                    interviewData = []
                }
                this.setState({loading: false, fetching: false, interviews:interviewData})
            });
        }
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
            return <Card fluid={true} >
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
        } else {
            var interview = this.state.interviews.filter(interview => {
                return interview._id === this.state.activeItem
            })
            interview = interview[0]

            if (!interview) {
                return <p>oh dear</p>
            }
            
            return <InterviewPage _id={interview._id} 
                details={interview.details}
                participants={interview.participants}
                time={interview.occursAtTime}
                date={interview.occursOnDate}
                loadedEnvironment={interview.loadedEnvironment}
                host={interview.host}
                email={this.state.user.email}
                loadedAssets={interview.loadedAssets}
                updateInterviews={this.updateInterviews}
            />
        }
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
                        <Menu  className="interviewList" pointing   vertical >
                            <InterviewForm updateInterviewListCallback={this.updateInterviews} type='create'/>
                            <Menu.Header as='h4'> 
                            Your Presentations 
                            
                            </Menu.Header>
                            
                            <Menu.Menu style={style}>
                                {this.renderInterviews('host')}
                            </Menu.Menu>
                            
                            <Menu.Header as='h4'> Shared With You </Menu.Header>
                            <Menu.Menu style={style}>
                                {this.renderInterviews('participant')}
                            </Menu.Menu>
                   
             
                        </Menu>
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