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
            position: {x: 0, y: 2, z: 0}
        })
    }

    getDimensions = (loadedAsset) => {
        var varheight = loadedAsset.data.height
        var varwidth = loadedAsset.data.width
        var ratio = 0
        if (varheight > varwidth){
            ratio = varwidth/varheight
            varheight = 6
            varwidth = 6 * ratio
        }
        else{
            ratio = varheight/varwidth
            varheight = 6 * ratio
            varwidth = 6 
        }

        return [varheight, varwidth]
    }

    getControllers = () => {
        let collision;
        if (this.props.controllerMode === 'grab') {
            collision = {colliderEvent: 'raycaster-intersection', colliderEventProperty: 'els', colliderEndEvent: 'raycaster-intersection-cleared', colliderEndEventProperty: 'clearedEls'}
        } else {
            collision = {colliderEvent: 'raycaster-intersection', colliderEventProperty: 'els', colliderEndEvent: 'raycaster-intersection-cleared', colliderEndEventProperty: 'clearedEls'}
        }
        return <div>
                <Entity id='right-hand' 
                    laser-controls 
                    raycaster={{objects: ".assets"}}
                    super-hands={collision}
                    hand-controls='right'
                    teleport-controls={{cameraRig: '#cameraRig', teleportOrigin: '#head', type:'line', maxLength:20, landingNormal:"0 1 0" }} 
                />         
                <Entity id='left-hand' 
                    laser-controls
                    raycaster={{objects: ".assets"}}
                    super-hands={collision}
                    hand-controls='left' 
                    teleport-controls={{cameraRig: '#cameraRig', teleportOrigin: '#head', type:'line', maxLength:20, landingNormal:"0 1 0" }} 
                />         
                </div> 
    }

    getLoadedAssetPromises = (loadedAssetIds) => {
        return loadedAssetIds.map((loadedAssetId, index) => {
            return Promise.all([UploadAPI.getUpload(loadedAssetId), UploadAPI.getUploadFile(loadedAssetId)])
            .then(([loadedAsset, file]) => {
                if (file && loadedAsset) {
                    if(loadedAsset.data.name.toLowerCase().includes(".png") || loadedAsset.data.name.toLowerCase().includes(".jpg")){
                        var [varheight, varwidth] = this.getDimensions(loadedAsset)
                        
                        return {
                            file: file.data,
                            type: loadedAsset.data.filetype,
                            height: varheight,
                            width: varwidth,
                            name: loadedAsset.data.name,
                            id: loadedAsset.data._id,
                            x: index * 8,
                            y: (varheight/2),
                            z: -3
                        }
                    }
                    else if (loadedAsset.data.name.toLowerCase().includes(".obj")){
                       
                        return {
                            file: file.data,
                            type: loadedAsset.data.filetype,
                            name: loadedAsset.data.name,
                            id: loadedAsset.data._id,
                            x: index * 8,
                            y: 1,
                            z: -3
                        }
                    }
                } 
            
            })
        })
    }

    renderLoadedAssets = (loadedAssetPromises) => {
        const NAF = window.NAF
        Promise.all(loadedAssetPromises).then((loadedAssets)=> {
            this.setState({loadedAssets}, () => {
                var entities = []
                var lights = []
                var templates = []
                var sources= []
                
                loadedAssets.forEach((loadedAsset) => {
                    if (loadedAsset) {
                        //Entities
                        if (loadedAsset.name.toLowerCase().includes(".jpg") || loadedAsset.name.toLowerCase().includes(".png")){
                            
                            var material = `data:${loadedAsset.type};base64,${loadedAsset.file}`
                            sources.push(
                                <a-asset-item id={`img${loadedAsset.id}`} src={material } autoplay></a-asset-item>
                            )

                            templates.push(`<template id="t${loadedAsset.id}"><a-entity><a-box  class="assets" static-body="shape: box" position="${loadedAsset.x} ${loadedAsset.y} ${loadedAsset.z}" hoverable grabbable stretchable draggable material="src: #img${loadedAsset.id}" geometry="primitive: box; width: ${loadedAsset.width}; height: ${loadedAsset.height}; depth: 0.1"> </a-box> <a-entity> </template>`)
                            
                            //WILL: if you copy and paste the output of this into the template section it will work (except the texture)
                            console.log(templates[0])

                            var networked = `template: #t${loadedAsset.id}; attachTemplateToLocal: true`
                            entities.push(<a-entity networked={networked }/>)
                                
                            lights.push(<a-light type="point" intensity=".3" color="white" position={`${loadedAsset.x} ${loadedAsset.height * 1.5} ${loadedAsset.z * -6}`}/>)
                        }
                        else if (loadedAsset.name.toLowerCase().includes(".obj")){
                            entities.push(
                                <Entity key={loadedAsset.id}
                                        id={`e${loadedAsset.id}`}
                                        class="assets"
                                        static-body={{shape: "box"}}
                                        obj-model={{obj: 'data:' + loadedAsset.type + ';base64,' + loadedAsset.file}}
                                        position={{x: loadedAsset.x, y: loadedAsset.y, z: loadedAsset.z}} 
                                        hoverable grabbable stretchable draggabless
                                /> 
                                
                                )
                                lights.push(<a-light type="point" intensity=".3" color="white" position={`${loadedAsset.x} ${10} ${loadedAsset.z * -6}`}/>)
                        }                        
                    }
                })

                // Templates must be in the page before we can do entities maybe?
                this.setState({ lights, sources, templates}, () => this.setState({entities}))
            })

        })
    }

    componentDidMount() {
        

        let entity = document.querySelector('#head');
        entity.addEventListener('componentchanged', function (evt) {
            if (evt.detail.name === 'position') {
              this.setState({position: evt.target.getAttribute('position') })
            }
          }.bind(this));
        
        if (this.props.loadedAssets) {
            if (this.props.loadedAssets.length === 0) { return this.setState({loadedAssets: [], entities: [], lights: [], assets: []})}

            //We must first get all the Asset data using the id (name, type, the file, size, etc)
            var loadedAssetPromises = this.getLoadedAssetPromises(this.props.loadedAssets)

            // Then we can render by adding entities and a light per loaded Asset
            this.renderLoadedAssets(loadedAssetPromises)
        }
    }

    componentWillReceiveProps(data) {
        //data.loadedAssets is named poorly, its really just a list of ids
        if (data.loadedAssets) {
            // If the list is empty reset all of our rendered data
            if (data.loadedAssets.length === 0) { return this.setState({loadedAssets: [], entities: [], lights: [], assets: []})}

            //We must first get all the Asset data using the id (name, type, the file, size, etc)
            var loadedAssetPromises = this.getLoadedAssetPromises(data.loadedAssets)

            // Then we can render by adding entities and a light per loaded Asset
            this.renderLoadedAssets(loadedAssetPromises)
        }
    }

    componentWillMount = () => {
        this.addTemplateSchema()
    }

    addTemplateSchema = () => {
        var NAF = window.NAF

        this.state.loadedAssets.forEach((loadedAsset) => {
            console.log(loadedAsset)
            NAF.schemas.add({
                template: `#t${loadedAsset.id}`,
                components: [
                    'position',
                    'rotation',
                    'material',
                    'scale'
                ] 
            })
        })
    }

    getTemplates = () => {
        return this.state.templates.forEach((template) => {
            return <div dangerouslySetInnerHTML={{__html: '<div>' + template + '</div>'}} />
        })
      
    }

    render() { 

        let aframeOptions = `serverURL: localhost:8080;app: PresenceVR; room: ${this.props.interviewId}; debug: true; adapter: easyRTC`
        
        return (
            <Scene className='aframeContainer' embedded networked-scene={aframeOptions}>
                <a-assets>
                    {this.state.sources}
                    <div dangerouslySetInnerHTML={{__html: `<template id="avatar-template"> 
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
                                                            ` + this.state.templates.join('')}}/ >
                                                            {/* If you hard code the templates above they will work */}
      
                </a-assets>

                <Entity environment={{preset: this.props.environment, dressingAmount: 500}}></Entity>

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
                    {this.state.entities}
                    {this.state.lights}
            </Scene>
        )
    }
}

export default AframeInterview;