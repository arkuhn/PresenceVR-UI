import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, Grid, Dimmer, Loader } from 'semantic-ui-react';
import { firebaseAuth } from '../../utils/firebase';
import PresenceVRNavBar from '../PresenceVRNavBar/PresenceVRNavBar';

class UploadPage extends Component {

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
		if (this.state.loading) {
            return <Dimmer active>
                        <Loader />
                    </Dimmer>
        }
        if (!this.state.loading && !this.state.user) {
            return <Redirect to='/'/>
        }
		return (
			<div className="UploadPage">
				<PresenceVRNavBar/>
				<div><br /></div>
				<Grid centered>
					{/* Header */}
                    <Grid.Row>
					<Grid.Column width={4}>
						<h1>Enviroments</h1>
					</Grid.Column>
					<Grid.Column width={1}>
						<button class='ui circular icon button'>
							<i aria-hidden='true' class='add icon' />
						</button>
					</Grid.Column>
					<Grid.Column width={4}>
						<h1>Assets</h1>
					</Grid.Column>
					<Grid.Column width={1}>
						<button class='ui circular icon button'>
							<i aria-hidden='true' class='add icon' />
						</button>
					</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column  width={5}>
						<Card fluid={true} >
							<Card.Content>
							<div role='list' class='ui bulleted list'>
								<div role='listitem' class='item'>
									OfficeEnviroment
								</div>
								<div role='listitem' class='item'>
									GalleryEnviroment
								</div>
							</div>
							</Card.Content>
						</Card>
						</Grid.Column>
						<Grid.Column  width={5}>
						<Card fluid={true} >
							<Card.Content>
							<div role='list' class='ui bulleted list'>
								<div role='listitem' class='item'>
									Asset1
								</div>
								<div role='listitem' class='item'>
									Asset2
								</div>
							</div>
							</Card.Content>
						</Card>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

export default UploadPage;