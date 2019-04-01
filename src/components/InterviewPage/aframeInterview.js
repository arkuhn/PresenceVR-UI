import 'aframe';
import 'aframe-environment-component';
import 'aframe-teleport-controls'
import 'networked-aframe';
import 'aframe-physics-system'
import 'super-hands'
import 'aframe-extras'
import { Entity, Scene } from 'aframe-react';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Dimmer, Loader} from 'semantic-ui-react';
import ReactDOM from "react-dom";
import UploadAPI from '../../utils/UploadAPI';
import './aframeInterview.css';
import { API_URL } from '../../config/api.config';


class AframeInterview extends Component {

   constructor(props) {
        super(props);
        this.state = ({
            lights: [],
            entities: [],
            sources: [],
            loadedAssets: [],
            templates: [],
            loading: true,
            position: {x: 0, y: 2, z: 0}
        })
    }

    componentDidMount() {
        let entity = document.querySelector('#head');
        if (entity) {
            entity.addEventListener('componentchanged', function (evt) {
                if (evt.detail.name === 'position') {
                  this.setState({position: evt.target.getAttribute('position') })
                }
              }.bind(this));
        }
    }


    render() { 
        let aframeOptions = `serverURL: ${API_URL};app: PresenceVR; room: ${this.props.interviewId}; debug: true; adapter: easyRTC`
        
        return ( 
            <Scene className='aframeContainer' id="aframeContainer" embedded networked-scene={aframeOptions}>
                <a-assets id="assetsSystem">
                    {this.props.sources}
                    <div dangerouslySetInnerHTML={{__html: `<div>
                                        <template id="avatar-template"> 
                                        <a-entity class="avatar"> 
                                            <a-sphere class="head"color="#5985ff"scale="0.45 0.5 0.4"random-color></a-sphere> 
                                            <a-entity class="face"position="0 0.05 0"> 
                                                <a-sphere class="eye"color="#efefef"position="0.16 0.1 -0.35"scale="0.12 0.12 0.12"> 
                                                    <a-sphere class="pupil"color="#000"position="0 0 -1"scale="0.2 0.2 0.2"></a-sphere> 
                                                </a-sphere> 
                                                <a-sphere class="eye"color="#efefef"position="-0.16 0.1 -0.35"scale="0.12 0.12 0.12"> 
                                                    <a-sphere class="pupil"color="#000"position="0 0 -1"scale="0.2 0.2 0.2"></a-sphere> 
                                                </a-sphere> 
                                            </a-entity> 
                                        </a-entity> 
                                        </template>
                                        ${this.props.templates.join('\n')}
                                        </div>`}} />
                                                            {/* Hard code templates in the string above */}
  
                </a-assets>

                <Entity environment={{preset: this.props.environment, dressingAmount: 500}}></Entity>
                {this.props.entities}
                <Entity id="cameraRig">
                    <Entity id="head" networked="template:#avatar-template;attachTemplateToLocal:false;" 
                        camera 
                        wasd-controls 
                        look-controls 
                        position={this.state.position} 
                    />
                    <Entity id='right-hand' 
                        laser-controls 
                        raycaster={{objects: ".assets"}}
                        super-hands={{colliderEvent: 'raycaster-intersection', colliderEventProperty: 'els', colliderEndEvent: 'raycaster-intersection-cleared', colliderEndEventProperty: 'clearedEls'}}
                        hand-controls='right'
                        teleport-controls={{cameraRig: '#cameraRig', teleportOrigin: '#head', type:'line', maxLength:20, landingNormal:"0 1 0" }} 
                    />         
                    <Entity id='left-hand' 
                        laser-controls
                        raycaster={{objects: ".assets"}}
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