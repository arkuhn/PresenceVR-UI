import axios from 'axios';
import React, { Component } from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import Video from 'twilio-video';
import { API_URL } from "../../../config/api.config";
import { safeGetUser } from '../../../utils/firebase';
import './videoInterview.css';



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
        return safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
            let config = { headers: { Authorization: `${token}` } }
            axios.get(API_URL + '/api/token', config).then(results => {

                const { identity, token } = results.data;
                this.setState({ identity, token });
                this.joinRoom()
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    componentWillUnmount() {
        this.leaveRoom()
    }

    joinRoom() {
        console.log("Joining room '" + this.props.interviewId + "'...");
        let numofparticipants = this.props.participants.length + 1;
        let widthfortrack;
        if (numofparticipants < 2) {
            widthfortrack = 690;
        }
        else if (numofparticipants < 4) {
            widthfortrack = 345;
        }
        else{
            widthfortrack = 230;
        }
        
        let connectOptions = {
            name: this.props.interviewId,
            video: {width: widthfortrack}
        };
        if (this.state.previewTracks) {
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
            this.setState({ activateRoom: null, hasJoinedRoom: false, localMediaAvailable: false });
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
            var style = {
                height: 480,
                width: 690
            }
            return (
                <Segment style={style}>
                    <Dimmer active >
                        <Loader />
                    </Dimmer>
                </Segment>)
        }
        let showLocalTrack = this.state.localMediaAvailable ? (
            <div><div ref="localMedia" /></div>
        ) : '';
        return (
                <Segment>
                    {showLocalTrack}
                    
                    <div className="flex-item" ref="remoteMedia" id="remote-media" />

                </Segment>
        );
    }
}

