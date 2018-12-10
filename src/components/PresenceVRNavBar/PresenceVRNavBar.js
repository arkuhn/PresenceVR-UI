import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Header, Icon, List, Menu, Modal } from 'semantic-ui-react';
import { firebaseAuth, logout } from '../../utils/firebase';
import './PresenceVRNavBar.css';

class PresenceVRNavBar extends Component {

    constructor(props) {
        super(props);
        this.state = { activeItem: 'PresenceVR' }
    }

    handleItemClick (e, { name }) {
        this.setState({ activeItem: name })
    }

    handleLogOut() {
        logout()
        window.location.reload();
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

        return (
            <div className="PresenceVRNavBar">
                <Menu size='huge' pointing secondary >
                        
                    <Menu.Item as={Link} to="/home" name='PresenceVR' active={activeItem === 'home'} onClick={this.handleItemClick} icon='home' position={'left'} />
                    
                    <Menu.Item as={Link} to="/uploads" name='uploads' active={activeItem === 'uploads'} onClick={this.handleItemClick} icon='cloud upload' />

                    <Menu.Item as={Link} to="/interview" name='interview' active={activeItem === 'interview'} onClick={this.handleItemClick} icon='address card outline' />

                    {this.notificationBell()}

                    {this.helpButton()}
                        
                    {this.accountButton()}
                    
                    
                </Menu> 
            </div>
        );
    }
}

export default PresenceVRNavBar;