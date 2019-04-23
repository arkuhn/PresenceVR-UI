import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Dropdown, Header, Icon, List, Menu, Modal } from 'semantic-ui-react';
import { firebaseAuth, logout } from '../../utils/firebase';
import './PresenceVRNavBar.css';
import {style} from '../../utils/style'

class PresenceVRNavBar extends Component {


    handleLogOut() {
        logout()
        return <Redirect to="/" />
    }

    accountButton () {
        return (
            <Modal trigger={ <Menu.Item style={{color: this.props.nightMode ? style.nmText : style.text}} icon='user' /> } closeIcon>
                <Header icon='user outline' content='Account information' />
                <Modal.Content>
                    <List>
                    <List.Item>
                    <Icon name='mail' />
                        <List.Content>
                            <List.Header>Username</List.Header>
                            <List.Description>
                            {this.props.email}
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

    nightModeButton = () => {
        let icon = 'moon'
        if (this.props.nightMode) {
            icon = 'sun'
        }
        return <Menu.Item icon={icon} style={{color: this.props.nightMode ? style.nmText : style.text}} onClick={this.props.setNightMode} >
        </Menu.Item>
    }

    helpButton () {
        return (
            <Modal trigger={ <Menu.Item style={{color: this.props.nightMode ? style.nmText : style.text}} icon='help circle'/> } closeIcon>
                <Header icon='question circle' content='Help' />
                <Modal.Content>
                    <p>
                    This feature has not been implemented yet.
                    </p>
                </Modal.Content>
            </Modal>
        );
    }

    render() {

        return (
            <div className="PresenceVRNavBar" >
                <Menu style={{height: '10vp', backgroundColor: this.props.nightMode ? style.nmSecondaryBG : style.secondaryBG }} pointing secondary >
                        
                    <Menu.Item style={{color: this.props.nightMode ? style.nmText : style.text}} onClick={this.props.goHome}name='PresenceVR' icon='home' position={'left'} />

                    {this.nightModeButton()}
                    
                    {this.helpButton()}
                        
                    {this.accountButton()}

                </Menu> 
                
            </div>
        );
    }
}

export default PresenceVRNavBar;