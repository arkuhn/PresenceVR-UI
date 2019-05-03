import axios from 'axios';
import React, { Component } from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import Video from 'twilio-video';
import { API_URL } from "../../../config/api.config";
import { safeGetUser } from '../../../utils/firebase';
import './videoInterview.css';

/*
    TODO: Find an alternative to Twilio that doesn't cost money and doesnt hinder VR performance
    Disclaimer: Make sure prensenter cam in VR is turned off before switching to videochat. Will break the video chat
*/

export default class VideoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            identity: null,
            roomNameErr: false,
            previewTracks: null,
            localMediaAvailable: false,
            hasJoinedRoom: false,
            activateRoom: null,
            loading: true
        };
    }

    componentDidMount = () => {
        return safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
            let config = { headers: { Authorization: `${token}` } }
            //returns Twilio to use vid chat
            axios.get(API_URL + '/api/token', config).then(results => {

                const { identity, token } = results.data;
                this.setState({ identity, token });
                this.joinRoom();
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    componentWillUnmount = () =>  {
        this.leaveRoom();
    }

    /*
        Called when you enter the Twilio room/ Toggle the video chat on
        TODO: Dynamiv video heights that scale as more people enter room
    */
    joinRoom = () =>  {
        console.log("Joining room '" + this.props.interviewId + "'...");
        
        let connectOptions = {
            name: this.props.interviewId
        };
        if (this.state.previewTracks) {
            connectOptions.tracks = this.state.previewTracks;
        }

        Video.connect(this.state.token, connectOptions).then(this.roomJoined, error => {
            alert('Could not connect to Twilio: ' + error.message);
        });
    }

    /*
        attaches selected stream to div
    */
    attachTracks = (tracks, container) => {
        tracks.forEach(track => {
            container.appendChild(track.attach());
        });
    }

    /*
        Attaches participants audio and video streams to the remoteMedia div
    */
    attachParticipantsTracks = (participant, container) => {
        var tracks = Array.from(participant.tracks.values());
        this.attachTracks(tracks, container);
    }

    /*
        Handles the events when joining a Twilio room
    */
    roomJoined = (room) => {
        console.log("Joined as '" + this.state.identity + "'");
        this.setState({
            activateRoom: room,
            localMediaAvailable: true,
            hasJoinedRoom: true,
            loading: false
        });

        //Allows you to stream local webcam feed
        var previewContainer = this.refs.localMedia;
        if (!previewContainer.querySelector('video')) {
            this.attachParticipantsTracks(room.localParticipant, previewContainer);
        }

        //Attaches streams of each participant already in the room
        room.participants.forEach(participant => {
            console.log("already in Room '" + participant.identity + "'");
            var previewContainer = this.refs.remoteMedia;
            this.attachParticipantsTracks(participant, previewContainer);
        });

        //When a participant joins your room
        room.on('participantConnected', participant => {
            console.log("Joining '" + participant.identity + "'");
        });

        //when an audio or video stream is added
        room.on('trackSubscribed', (track, participant) => {
            console.log(participant.identity + ' added track: ' + track.kind);
            var previewContainer = this.refs.remoteMedia;
            this.attachTracks([track], previewContainer);
        });

        //when an audio or video stream is removed
        room.on('trackUnsubscribed', (track, participant) => {
            console.log(participant.identity + ' removed track: ' + track.kind);
            this.detachTracks([track]);
        });

        //when a participant leaves the room
        room.on('participantDisconnected', participant => {
            console.log("Participant '" + participant.identity + "' left the room");
            this.detachParticipantTracks(participant);
        });

        //when you leave the room
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

    /*
        handles leaving the room
    */
    leaveRoom = () => {
        this.state.activateRoom.disconnect();
        this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
    }

    /*
        handles removing audio and video streams
    */
    detachTracks = (tracks) =>{
        tracks.forEach(tracks => {
            tracks.detach().forEach(detachedElement => {
                detachedElement.remove();
            });
        });
    }

    /*
        handles removing participant audio and video streams
    */
    detachParticipantTracks = (participant) => {
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
        //If you allow your webcam and have a webcam your local camera feed will show
        let showLocalTrack = this.state.localMediaAvailable ? (
            <div><div ref="localMedia" /></div>
        ) : '';
        return (
                <Segment style={{height: '65vh', maxHeight:'65vh', overflowY: 'scroll'}} > 
                    {showLocalTrack}
                    
                    <div className="flex-item" ref="remoteMedia" id="remote-media" />

                </Segment>
        );
    }
}

