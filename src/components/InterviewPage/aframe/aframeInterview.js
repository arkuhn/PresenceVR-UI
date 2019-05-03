import 'aframe';
import 'networked-aframe';
import 'aframe-environment-component';
import 'aframe-extras';
import 'aframe-physics-system';
import { Entity, Scene } from 'aframe-react';
import 'aframe-teleport-controls';
import axios from 'axios';
import React, { Component } from 'react';
import 'super-hands';
import Video from 'twilio-video';
import { API_URL } from '../../../config/api.config';
import { safeGetUser } from '../../../utils/firebase';
import aframeUtils from './aframeUtils';

function jsonEqual(a,b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

class AframeInterview extends Component {

   constructor(props) {
        super(props);
        this.state = ({
            lights: [],
            entities: [],
            loadedAssets: [],
            templates: [],
            loading: true,
            position: {x: 0, y: 2, z: 0},
            webcamPosition: {x: 2,y: 2,z: 2},
            identity: null,
            roomNameErr: false,
            previewTracks: null,
            localMediaAvailable: false,
            hasJoinedRoom: false,
            activateRoom: null,
            loading: true,
            remoteMedia: false,
            host_cam_material: '',
            audio_material: '',
            disconnecting: false,
            connecting: false
        });
        this.connecting = false
        this.disconnecting = false
    }

    componentWillMount() {
        // Create event listeners to track if this user is in VR mode or not
        window.addEventListener('enter-vr', e => {
            // Update state to show they are in VR mode
            this.props.handleVRModeUpdate(true);
        });

        window.addEventListener('exit-vr', e => {
            // Update state to show they are not in VR mode
            this.props.handleVRModeUpdate(false);
        });
    }

    componentDidMount() {
        // TODO: networked aframe connect has race conditions, this stall helps fix them
        setTimeout(() => {
            window.AFRAME.scenes[0].emit('connect');
        }, 200)

        // Refresh interviews when people connect and disconnect to keep fresh state
        document.body.addEventListener('clientDisconnected', function (evt) {
            console.error('clientDisconnected event. clientId =', evt.detail.clientId);
            this.props.updateInterviewCallback();
          }.bind(this));
        document.body.addEventListener('clientConnected', function (evt) {
            console.error('clientConnected event. clientId =', evt.detail.clientId);
            this.props.updateInterviewCallback();
        }.bind(this));
       
        // Track the players position moves
        let entity = document.querySelector('#cameraRig');
        if (entity) {
            entity.addEventListener('componentchanged', function (evt) {
                if (evt.detail.name === 'position') {
                  this.setState({position: evt.target.getAttribute('position') });
                }
              }.bind(this));
        }

        // Register all the networked aframe schemas, more on this in the NAF docs
        aframeUtils.registerSchemas()

        // Render all assets passed in through props
        this.renderAssets(this.props)

        // Get twillio token and join webcam room if toggle is on
        safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
            let config = { headers: { Authorization: `${token}` } };
            //returns Twilio token for vidchat in VR
            axios.get(API_URL + '/api/token', config).then(results => {

                const { identity, token } = results.data;
                this.setState({ identity, token });

                if (this.props.hostCamInVR) {
                    this.joinRoom(this.props.interviewId);
                }
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    componentWillReceiveProps(props) {
        // If the interview has changed leave twillio room
        if (props.interviewId !== this.props.interviewId) {
            if (this.state.hasJoinedRoom) {
                this.leaveRoom();
            }
            if(props.hostCamInVR) {
                this.joinRoom(props.interviewId);
            }          
        }

        // If they turned on camera in VR, join twillo room
        if(props.hostCamInVR !== this.props.hostCamInVR) {
            this.joinRoom(props.interviewId)
        }  
        
        // Render new assets
        this.renderAssets(props)
    }

    /*
    Get assets from the server and render them if we aren't already doing so.
    */
    renderAssets = (props) => {
        if (!this.state.fetching){
            // If loadedAssets hasn't changed, don't bother rerendering
            let equal = jsonEqual(props.loadedAssets, this.state.loadedAssets) 
            if ( equal  )  {
                return
            }
            if (!equal) {
                this.setState({fetching: true, loadedAssets: props.loadedAssets})
                //Get metadata about all assets then turn into JSX and render
                Promise.all(aframeUtils.getData(props.loadedAssets)).then((data) => {
                    var {entities, lights} = aframeUtils.renderData(data, this.props.user)
                    this.setState({entities, lights, fetching:false})
                })
            }
        }
    }

    /* 
    Utility function to only show the host/presenter cam in VR 
    */
    isHostVideoTrack(participant) {
        if(participant.identity === this.props.hostName){
            return true;
        }
        return false;
    }

    /*
        Called when you enter the Twilio room/ Toggle the video in vr on
    */
    joinRoom = (id) => {
        console.log(this.props)
        console.log("Joining room '" + this.props.interviewId + "'VR...");
        let connectOptions = {
            name: this.props.interviewId + "VR"
        };

        if (this.state.previewTracks) {
            connectOptions.tracks = this.state.previewTracks;
        }

        Video.connect(this.state.token, connectOptions).then(this.roomJoined, error => {
            alert('Could not connect to Twilio: ' + error.message);
        });
    }

    
    /*
        attaches selected stream to aframe assets
    */
   attachTracks = (tracks, container) => {
        tracks.forEach(track => {

            container.appendChild(track.attach());
            if(track.kind === "video") {
                this.attachIdToVideoTag();
            }
            if(track.kind === "audio") {
                this.attachIdToAudioTag();
            }
        });
    }

    attachIdToVideoTag = () => {
        let assets_el = document.querySelector("a-assets");
        let video_el = assets_el.querySelector("video");
        video_el.setAttribute("id", "host-video");
        this.setState({host_cam_material: "src: #host-video"});
    }

    attachIdToAudioTag = () => {
        let assets_el = document.querySelector("a-assets");
        let audio_el = assets_el.querySelector("audio");
        audio_el.setAttribute("id", "user_audio");
        this.setState({audio_material: "src: #user_audio"});
    }

    attachParticipantsTracks = (participant, container) => {
        var tracks = Array.from(participant.tracks.values());
        console.log("tracks: " + tracks);
        this.attachTracks(tracks, container);
    }

    
    /*
        Handles the events when joining a Twilio 
        TODO: Dismount Audio and Video Tracks when leaving interview page
        TODO: get rid of webcam enable pop up when stream is not being used
        TODO: Find alternative to Twilio
    */
    roomJoined = (room) => {
        console.log("Joined as '" + this.state.identity + "'");
        this.setState({
            activateRoom: room,
            hasJoinedRoom: true,
            loading: false
        });
        if(this.refs.localMedia){
            this.setState({
                localMediaAvailable: true
            });
        }

        //Attaches streams of each participant already in the room
        room.participants.forEach(participant => {
            if(this.isHostVideoTrack(participant)) {
                console.log("already in Room '" + participant.identity + "'");
                var previewContainer = this.refs.remoteMedia;
                this.attachParticipantsTracks(participant, previewContainer);
            }
        });

        //When a participant joins your room
        room.on('participantConnected', participant => {
            console.log("Joining '" + participant.identity + "'");
        });

        //when an audio or video stream is added
        room.on('trackSubscribed', (track, participant) => {
            console.log(participant.identity + ' added track: ' + track.kind);
            var assetContainer = this.refs.assets;
            console.log("other tracks: " + track);
            if(track.kind === "video" ){
                console.log("this is video: " + [track]);
                this.attachTracks([track], assetContainer);
            }
            if(track.kind === "audio"){
                console.log("this is audio: " + [track]);
                this.attachTracks([track], assetContainer);
            }

        });

        //when an audio or video stream is removed
        room.on('trackUnsubscribed', (track, participant) => {
            console.log(participant.identity + ' removed track: ' + track.kind);
            this.detachTracks([track]);
            this.setState({
                videoTrackAttached: false
            });
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
            this.state.activateRoom = null;
            this.setState({ hasJoinedRoom: false, localMediaAvailable: false, remoteMedia: false});
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
    detachTracks = (tracks) => {
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
        let aframeOptions = {
            serverURL: API_URL,
            app: 'PresenceVR',
            room: this.props.interviewId,
            debug: true,
            connectOnLoad: false
        }

        // If toggle is on, show host cam
        let hostCam = (this.props.hostCamInVR && !this.props.host) ? <a-box id="host-cam" material={this.state.host_cam_material} scale=".25 .18 .001" position=".2 -.15 -.25"></a-box> : '';
        return ( 
            <Scene className='aframeContainer' id="aframeContainer" embedded networked-scene={aframeOptions}>
                <a-assets ref='assets' id="assetsSystem">
                    <div dangerouslySetInnerHTML={{__html: `<div>
                                                            ${aframeUtils.avatarTemplate}
                                                            ${aframeUtils.cameraTemplate}
                                                            ${aframeUtils.imgTemplate}
                                                            ${aframeUtils.objTemplate}
                                                            ${aframeUtils.vidTemplate}
                                                            </div>`}} />
                    <div ref="remoteMedia" id="remote-media" playsInline />
                </a-assets>

                {/* Generic aframe environment library */}
                <Entity environment={{preset: this.props.environment, dressingAmount: 500}}></Entity>

                {/* At the moment, one light is rendered per entity*/}
                {this.state.lights}

                {/* All loaded assets in their rendered form */}
                {this.state.entities}

                {/*Player entity*/}
                <Entity id="cameraRig" networked="template:#camera-template;attachTemplateToLocal:false;" position={this.state.position}  rotation="">
                    <Entity id="head" networked="template:#avatar-template;attachTemplateToLocal:false;" 
                        camera 
                        wasd-controls 
                        look-controls 
                    >
                    {hostCam}
                    </Entity>
                    <Entity id='right-hand' 
                        laser-controls 
                        super-hands={{colliderEvent: 'raycaster-intersection', colliderEventProperty: 'els', colliderEndEvent: 'raycaster-intersection-cleared', colliderEndEventProperty: 'clearedEls'}}
                        hand-controls='right'
                        teleport-controls={{cameraRig: '#cameraRig', teleportOrigin: '#head', type:'line', maxLength:20, landingNormal:"0 1 0" }} 
                    />         
                    <Entity id='left-hand' 
                        laser-controls
                        super-hands={{colliderEvent: 'raycaster-intersection', colliderEventProperty: 'els', colliderEndEvent: 'raycaster-intersection-cleared', colliderEndEventProperty: 'clearedEls'}}
                        hand-controls='left' 
                        teleport-controls={{cameraRig: '#cameraRig', teleportOrigin: '#head', type:'line', maxLength:20, landingNormal:"0 1 0" }} 
                    />        
                </Entity>
            </Scene>
        )
    }
}

export default AframeInterview;