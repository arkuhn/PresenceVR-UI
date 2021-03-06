import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Card, Divider, Dimmer,Loader, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import { firebaseAuth, loginWithGoogle } from "../../utils/firebase";
import './LoginPage.css';

class LoginPage extends Component {
    componentWillMount() {
        this.setState({loading: true})
        // Bind the variable to the instance of the class.
        this.authFirebaseListener = firebaseAuth.onAuthStateChanged((user) => {
          this.setState({
            loading: false,  // For the loader maybe
            user, // User Details
            isAuth: true
          });
        });
    
    }

    componentWillUnmount() {
        this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
    }

    render() {

        if (this.state.user) {
            return <Redirect to='/home' />
        }
        if (this.state.loading) {
            return <Dimmer active>
                            <Loader />
                        </Dimmer>
        }
        return (
            <div>
                <Grid centered>
                <Grid.Row/>
                    {/* Header */}
                    <Grid.Row>
                    <Grid.Column  width={4}>
                    <Header as='h1' textAlign='center'>
                        <Header.Content>
                        <Image src="/images/presencevr2.jpg" />
                        <Header.Subheader>The future of virtual interviews and recruiting</Header.Subheader>
                        </Header.Content>
                    </Header>
                    </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        {/* Auth */}
                        <Grid.Column width={1} />
                        <Grid.Column width={5} floated='left'>
                        <Card fluid={true} raised={true}>
                            <Segment>
                            <Header as='h3'     textAlign='center'>
                            <Icon name='user' /> Log-in to your account
                            </Header>

                            <Button onClick={loginWithGoogle} fluid size='medium' basic color='red'>
                                <Icon name='google' />
                                Login with Google
                            </Button>
                            </Segment>
                        </Card>
                        </Grid.Column>
                        <Grid.Column width={1} />

                        {/* Bio */}
                        <Grid.Column width={9 } floated='right'>
                            <Card fluid={true} >
                            <Card.Content>
                                <Image src="/images/vrimage.png" />
                                <Card.Description>
                                    <span>
                                    PresenceVR is a cross-platform WebVR application designed and developed for use in Interviewing 
                                    and Recruiting. All the convenience of video/phone interviews, without losing any of the 
                                    physical benefits of in-person interviews!
                                    </span>
                                </Card.Description>
                                </Card.Content>
                                <Card.Content extra={true}>
                                    A R.I.T Career Services project
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default LoginPage;