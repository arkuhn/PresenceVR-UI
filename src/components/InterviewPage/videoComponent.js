import React, { Component } from 'react';
import Video from 'twilio-video';
import axios from 'axios';
//import RaisedButton from 'material-ui/RaisedButton';
//import TextField from 'material-ui/TextField';
//import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Button, Divider, Grid, Header, Icon, Dimmer, Loader, Popup, Radio, Checkbox } from 'semantic-ui-react';
import './videoInterview.css';

import { API_URL } from "../../config/api.config";
import { safeGetUser } from '../../utils/firebase';

export default class VideoComponent extends Component {
    constructor(props) {
        super();
        this.state = {
            identity: null,
            roomNameErr: false,
            previewTracks: null,
            localMediaAvailable: false,
            hasJoinedRoom: false,
            activateRoom: null,
            loading: true
        };
        this.joinRoom = this.joinRoom.bind(this);
        this.roomJoined = this.roomJoined.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.detachTracks = this.detachTracks.bind(this) ;
        this.detachParticipantTracks = this.detachParticipantTracks.bind(this);
    }

    componentDidMount() {

        setTimeout(() => {
            this.props.joined ? this.joinRoom() : this.leaveRoom()
        }, 500)
        return safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
            let config = { headers: { Authorization: `${token}` } }
            axios.get(API_URL + '/api/token', config).then(results => {

                const { identity, token } = results.data;
                this.setState({ identity, token });
            });
        }).catch((error) => {
            console.log(error);
        });

    }

    joinRoom() {
        /* if (!this.props.id.trim()) {
            this.setState({ roomaNameErr: true });
            return;
        } */
        console.log(this.props)
        console.log("Joining room '" + this.props.interviewId + "'...");
        let connectOptions = {
            name: this.props.interviewId
        };

        if (this.state.prviewTracks) {
            connectOptions.tracks = this.state.previewTracks;
        }

        Video.connect(this.state.token, connectOptions).then(this.roomJoined, error => {
            alert('Could not connect to Twilio: ' + error.message);
        });
    }

    attachTracks(tracks, container) {
        tracks.forEach(track => {
            container.appendChild(track.attach());
        });
    }

    attachParticipantsTracks(participant, container) {
        var tracks = Array.from(participant.tracks.values());
        this.attachTracks(tracks, container);
    }

    roomJoined(room) {
        console.log("Joined as '" + this.state.identity + "'");
        this.setState({
            activateRoom: room,
            localMediaAvailable: true,
            hasJoinedRoom: true,
            loading: false
        });

        var previewContainer = this.refs.localMedia;
        if (!previewContainer.querySelector('video')) {
            this.attachParticipantsTracks(room.localParticipant, previewContainer);
        }

        room.participants.forEach(participant => {
            console.log("already in Room '" + participant.identity + "'");
            var previewContainer = this.refs.remoteMedia;
            this.attachParticipantsTracks(participant, previewContainer);
        });

        room.on('participantConnected', participant => {
            console.log("Joining '" + participant.identity + "'");
        });

        room.on('trackSubscribed', (track, participant) => {
            console.log(participant.identity + ' added track: ' + track.kind);
            var previewContainer = this.refs.remoteMedia;
            this.attachTracks([track], previewContainer);
        });

        room.on('trackUnsubscribed', (track, participant) => {
            console.log(participant.identity + ' removed track: ' + track.kind);
            this.detachTracks([track]);
        });

        room.on('participantDisconnected', participant => {
            console.log("Participant '" + participant.identity + "' left the room");
            this.detachParticipantTracks(participant);
        });

        room.on('disconnected', () => {
            if (this.state.previewTracks) {
                this.state.previewTracks.forEach(track => {
                    track.stop();
                });
            }
            this.detachParticipantTracks(room.localParticipant);
            room.participants.forEach(this.detachParticipantTracks);
            this.state.activateRoom = null;
            this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
        });
    }

    leaveRoom() {
        this.state.activateRoom.disconnect();
        this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
    }

    detachTracks(tracks) {
        tracks.forEach(tracks => {
            tracks.detach().forEach(detachedElement => {
                detachedElement.remove();
            });
        });
    }

    detachParticipantTracks(participant) {
        var tracks = Array.from(participant.tracks.values());
        this.detachTracks(tracks);
    }

    render() {

        if (this.state.loading) {
            return <Dimmer active>
                        <Loader />
                    </Dimmer>
        }

        let showLocalTrack = this.state.localMediaAvailable ? (
            <div  ><div ref="localMedia" /></div>
        ) : '';
        return (
                <div >
                    {showLocalTrack}
                    
                    <div className="flex-item" ref="remoteMedia" id="remote-media" />

                </div>
        );
        //errorText={this.state.roomNameErr ? 'Room Name is required' : undefined}
    }
}

{/* <Card>
                <CardText>
                    <div className="flex-container">
                        {showLocalTrack}
                        <div className="flex-item">
                            <TextField hintText="Room Name" onChange={this.handleRoomNameChange} errorText = {this.state.roomNameErr ? 'Room Name is required' : undefined} />
                            <br />
                            {joinOrLeaveRoomButton}
                        </div>
                        <div className="flex-item" ref="remoteMedia" id="remote-media" />
                    </div>
                </CardText>
            </Card> */}