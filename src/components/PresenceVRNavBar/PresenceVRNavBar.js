import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Dropdown, Header, Icon, List, Menu, Modal } from 'semantic-ui-react';
import { firebaseAuth, logout } from '../../utils/firebase';
import './PresenceVRNavBar.css';

class PresenceVRNavBar extends Component {

    constructor(props) {
        super(props);
        this.state = { activeItem: 'PresenceVR' }
    }

    componentWillMount() {
        this.setState({loading: true})
        // Bind the variable to the instance of the class.
        this.authFirebaseListener = firebaseAuth.onAuthStateChanged((user) => {
          this.setState({
            loading: false,  // For the loader maybe
            user
          });
        });
    
    }

    componentWillUnmount() {
        this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
    }

    handleItemClick (e, { name }) {
        this.setState({ activeItem: name })
    }

    handleLogOut() {
        logout()
        return <Redirect to="/" />
    }

    accountButton () {
        return (
            <Modal trigger={ <Menu.Item icon='user' /> } closeIcon>
                <Header icon='user outline' content='Account information' />
                <Modal.Content>
                    <List>
                    <List.Item>
                    <Icon name='mail' />
                        <List.Content>
                            <List.Header>Username</List.Header>
                            <List.Description>
                            {firebaseAuth.currentUser.email}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                    </List>
                <br/>
                    <Button onClick={this.handleLogOut} fluid>Log out</Button>
                </Modal.Content>
            </Modal>
        );
    }

    helpButton () {
        return (
            <Modal trigger={ <Menu.Item icon='help circle'/> } closeIcon>
                <Header icon='question circle' content='Help' />
                <Modal.Content>
                    <p>
                    Te eum doming eirmod, nominati pertinacia argumentum ad his. Ex eam alia facete scriptorem,
                    est autem aliquip detraxit at. Usu ocurreret referrentur at, cu epicurei appellantur vix. Cum
                    ea laoreet recteque electram, eos choro alterum definiebas in. Vim dolorum definiebas an. Mei
                    ex natum rebum iisque.
                    </p>
                </Modal.Content>
            </Modal>
        );
    }

    notificationBell () {
        return (
                <Menu.Item>
                    <Dropdown
                        inline
                        icon='bell'
                        header='Notifications'                        
                    />
                </Menu.Item>                

        );
    }

    render() {

        const { activeItem } = this.state

        if (!this.state.loading && !this.state.user) {
            return <Redirect to='/'/>
        }

        return (
            <div className="PresenceVRNavBar">
                <Menu size='huge' pointing secondary >
                        
                    <Menu.Item as={Link} to="/home" name='PresenceVR' active={activeItem === 'home'} onClick={this.handleItemClick} icon='home' position={'left'} />
                    
                    {this.notificationBell()}

                    {this.helpButton()}
                        
                    {this.accountButton()}
                    
                    
                </Menu> 
            </div>
        );
    }
}

export default PresenceVRNavBar;