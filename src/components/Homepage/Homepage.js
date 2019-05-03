import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, Dimmer, Grid, Header, Image, Loader, Menu, Divider, Segment } from 'semantic-ui-react';
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
            activeItem: 'home',
            interviews: [],
            fetching: false,
            error: false
        })
    }

    /*
        Generates an InterviewPage from the selected interview and joins an interview room
    */
    handleItemClick = (e, { name }) => {
        if (name !== 'home') {
            this.setState({
                selectedInterview: <InterviewPage _id={name} 
                                        email={this.state.user.email}
                                        updateInterviews={this.updateInterview}
                                        goHome={this.returnHome}/>, 
                activeItem: name})
        }
        this.setState({ activeItem: name })
    }

    returnHome = () => {
        this.setState({ activeItem: 'home'})
        this.updateInterviews()
    }

    componentWillMount() {
        this.setState({loading: true})
        // Bind the variable to the instance of the class.
        this.authFirebaseListener = firebaseAuth.onAuthStateChanged((user) => {
            if (!user) {
                return this.setState({error: true})
            }
            this.setState({ user, loading: false }, () => { this.updateInterviews() });
        })
        
    }

    /*
        Updates the interview list when an interview is added, changed or removed
    */
    updateInterviews = () => {
            InterviewAPI.getAllInterviews(this.state.user.email).then((interviews) => {
                let interviewData;
                interviews ? interviewData = interviews.data : interviewData = []
                this.setState({ interviews:interviewData})
            });
    }

    componentWillUnmount() {
        this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
    }

    /*
        generates an interview card when an interview is created
    */
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

    render() {
            if (this.state.error) {
                return <Redirect to='/'/>
            }
            if (this.state.loading) {
                return <Dimmer active>
                            <Loader />
                        </Dimmer>
            }
            if (!this.state.loading && !this.state.user ) {
                return <Redirect to='/'/>
            }
            const style= {
                height: '38vh',
                overflow: 'auto',
                scrollbarWidth: 'none'
            }

            let selectedItem;
            if (this.state.activeItem === 'home') {
                selectedItem = <Grid width={14}>
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
            }
            if (this.state.activeItem !== 'home') {
                selectedItem = this.state.selectedInterview
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
                        {selectedItem}
                    </Grid.Column>

                    </Grid>
                </div>
            );
    }
}

export default Homepage;