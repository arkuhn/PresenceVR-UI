import 'aframe';
import 'aframe-environment-component';
import 'aframe-extras';
import 'aframe-physics-system';
import { Entity, Scene } from 'aframe-react';
import 'aframe-teleport-controls';
import 'networked-aframe';
import React, { Component } from 'react';
import 'super-hands';
import { API_URL } from '../../../config/api.config'
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
            sources: [],
            loadedAssets: [],
            templates: [],
            loading: true,
            position: {x: 0, y: 2, z: 0}
        })

        if (!window.AFRAME.components['materialid']) {
            window.AFRAME.registerComponent('materialid', {
                id: {type: 'string', default: ''}
            });
        }

    }

    componentDidMount() {
        let entity = document.querySelector('#cameraRig');
        if (entity) {
            entity.addEventListener('componentchanged', function (evt) {
                if (evt.detail.name === 'position') {
                  this.setState({position: evt.target.getAttribute('position') })
                }
              }.bind(this));
        }

        document.body.addEventListener('entityCreated', this.attachMaterialToAsset);

        let properties = ['materialid', 'geometry', 'position', 'rotation', 'scale']
        let schemas = [{template: '#img-template', selector: '.img-box'},
                        {template: '#obj-template', selector: '.obj-model'},
                        {template: '#vid-template', selector: '.vid-box'}] 

        schemas.forEach((schema) => {
            let components = properties.map((property) => {
                return {
                    selector: schema.selector,
                    component: property
                }
            })

            window.NAF.schemas.add({
                template: schema.template,
                components: components.concat(['position', 'rotation', 'scale'])
            })
        })
    }

    attachMaterialToAsset = (evt) => {
        let el = evt.detail.el;
        let box = el.querySelector('.img-box')
        if(box) {
            let id = box.getAttribute('materialid').id
            let mat = document.createAttribute("material");
            mat.value = this.state.sources[id]
            box.setAttributeNode(mat);
        }
    }

    renderAssets = (props) => {
        let equal = jsonEqual(props.loadedAssets, this.state.loadedAssets) 
        if ( this.state.fetching && equal  )  {
            return
        }
        if (!equal) {
            this.setState({fetching: true, loadedAssets: props.loadedAssets})
            Promise.all(aframeUtils.getData(props.loadedAssets)).then((data) => {
                var {sources, entities} = aframeUtils.renderData(data, this.props.user)
                this.setState({sources, entities, fetching:false})
            })
        }
    }

    componentWillMount() {
        this.renderAssets(this.props)
    }


    componentWillReceiveProps(props) {
        this.renderAssets(props)
    }

    componentDidUpdate() {
        //TODO fix this annoying hack for an annoying race condition
        setTimeout(() => {
            let boxes = document.querySelectorAll('.img-box')
            if (boxes) {
                boxes.forEach((box) => {
                    let id = box.getAttribute('materialid')
                    if (id) {
                        id = id.id
                        let mat = document.createAttribute("material");
                        mat.value = this.state.sources[id] + ''
                        box.setAttributeNode(mat);
                    }   
                })
            }
        }, 500)
    } 


    render() { 
        let aframeOptions = `serverURL: ${API_URL};app: PresenceVR; room: ${this.props.interviewId}; debug: true; adapter: easyRTC`

        return ( 
            <Scene className='aframeContainer' id="aframeContainer" embedded networked-scene={aframeOptions}>
                <a-assets id="assetsSystem">
                    <div dangerouslySetInnerHTML={{__html: `<div>
                                                            ${aframeUtils.avatarTemplate}
                                                            ${aframeUtils.cameraTemplate}
                                                            ${aframeUtils.imgTemplate}
                                                            ${aframeUtils.objTemplate}
                                                            ${aframeUtils.vidTemplate}
                                                            </div>`}} />
                </a-assets>

                <Entity environment={{preset: this.props.environment, dressingAmount: 500}}></Entity>

                {this.state.entities}

                <Entity id="cameraRig" networked="template:#camera-template;attachTemplateToLocal:false;" position={this.state.position}  rotation="">
                    <Entity id="head" networked="template:#avatar-template;attachTemplateToLocal:false;" 
                        camera 
                        wasd-controls 
                        look-controls 
                    />
                    <Entity id='right-hand' 
                        laser-controls 
                        raycaster={{objects: [".img-box", '.vid-box', 'obj-model']}}
                        super-hands={{colliderEvent: 'raycaster-intersection', colliderEventProperty: 'els', colliderEndEvent: 'raycaster-intersection-cleared', colliderEndEventProperty: 'clearedEls'}}
                        hand-controls='right'
                        teleport-controls={{cameraRig: '#cameraRig', teleportOrigin: '#head', type:'line', maxLength:20, landingNormal:"0 1 0" }} 
                    />         
                    <Entity id='left-hand' 
                        laser-controls
                        raycaster={{objects: [".img-box", '.vid-box', 'obj-model']}}
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