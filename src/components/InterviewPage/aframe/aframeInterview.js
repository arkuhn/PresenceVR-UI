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
import { safeGetUser } from '../../../utils/firebase'
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
        this.joinRoom = this.joinRoom.bind(this);
        this.roomJoined = this.roomJoined.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.detachTracks = this.detachTracks.bind(this) ;
        this.detachParticipantTracks = this.detachParticipantTracks.bind(this);
        this.isHostVideoTrack = this.isHostVideoTrack.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            window.AFRAME.scenes[0].emit('connect');
        }, 200)

        document.body.addEventListener('clientDisconnected', function (evt) {
            console.error('clientDisconnected event. clientId =', evt.detail.clientId);
            this.props.updateInterviewCallback()
          }.bind(this));
        document.body.addEventListener('clientConnected', function (evt) {
            console.error('clientConnected event. clientId =', evt.detail.clientId);
            this.props.updateInterviewCallback()
        }.bind(this));
       
        let entity = document.querySelector('#cameraRig');
        if (entity) {
            entity.addEventListener('componentchanged', function (evt) {
                if (evt.detail.name === 'position') {
                  this.setState({position: evt.target.getAttribute('position') })
                }
              }.bind(this));
        }

        aframeUtils.registerSchemas()
        this.renderAssets(this.props)

        safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
            let config = { headers: { Authorization: `${token}` } };
            axios.get(API_URL + '/api/token', config).then(results => {

                const { identity, token } = results.data;
                this.setState({ identity, token });

                if (this.props.hostCamInVR) {
                    this.joinRoom(this.props.interviewId)
                }
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    componentWillReceiveProps(props) {
        if (props.interviewId !== this.props.interviewId) {
            if (this.state.hasJoinedRoom) {
                this.leaveRoom()
            }
            if(props.hostCamInVR) {
                this.joinRoom(props.interviewId)
            }          
        }
        this.renderAssets(props)
    }

    renderAssets = (props) => {
        if (!this.state.fetching){
            let equal = jsonEqual(props.loadedAssets, this.state.loadedAssets) 
            if ( equal  )  {
                return
            }
            if (!equal) {
                this.setState({fetching: true, loadedAssets: props.loadedAssets})
                Promise.all(aframeUtils.getData(props.loadedAssets)).then((data) => {
                    var {entities} = aframeUtils.renderData(data, this.props.user)
                    this.setState({entities, fetching:false})
                })
            }
        }
    }

    isHostVideoTrack(participant) {
        if(participant.identity === this.props.hostName){
            return true;
        }
        return false;
    }

    joinRoom(id) {
        /* if (!this.props.id.trim()) {
            this.setState({ roomaNameErr: true });
            return;
        } */
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

    attachTracks(tracks, container) {
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

    attachParticipantsTracks(participant, container) {
        var tracks = Array.from(participant.tracks.values());
        console.log("tracks: " + tracks);
        this.attachTracks(tracks, container);
    }

    roomJoined(room) {
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

        room.on('trackUnsubscribed', (track, participant) => {
            console.log(participant.identity + ' removed track: ' + track.kind);
            this.detachTracks([track]);
            this.setState({
                videoTrackAttached: false
            });
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
            this.setState({ hasJoinedRoom: false, localMediaAvailable: false, remoteMedia: false});
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
        //let aframeOptions = `serverURL: ${API_URL};app: PresenceVR; room: ${this.props.interviewId}; debug: true; adapter: easyRTC`
        let aframeOptions = {
            serverURL: API_URL,
            app: 'PresenceVR',
            room: this.props.interviewId,
            debug: true,
            connectOnLoad: false
        }

        let hostCam = (this.props.hostCamInVR) ? <a-box id="host-cam" material={this.state.host_cam_material} scale=".25 .18 .001" position=".2 -.15 -.25"></a-box> : '';
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

                <Entity environment={{preset: this.props.environment, dressingAmount: 500}}></Entity>

                {this.state.entities}

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