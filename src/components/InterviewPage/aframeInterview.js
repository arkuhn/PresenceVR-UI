import 'aframe';
import 'aframe-environment-component';
import 'aframe-teleport-controls'
import NAF from 'networked-aframe';
import 'aframe-physics-system'
import 'super-hands'
import 'aframe-extras'
import { Entity, Scene } from 'aframe-react';
import React, { Component } from 'react';
import UploadAPI from '../../utils/UploadAPI';
import './aframeInterview.css';

import aframe_string from "../../js/aframe.js";
var aframe_html = { __html: aframe_string };

class AframeInterview extends Component {

   constructor(props) {
        super(props);
        this.state = ({
            lights: [],
            entities: [],
            loadedAssets: [],
        });

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

    getLoadedAssetPromises = (loadedAssetIds) => {
        return loadedAssetIds.map((loadedAssetId, index) => {
            return Promise.all([UploadAPI.getUpload(loadedAssetId), UploadAPI.getUploadFile(loadedAssetId)])
            .then(([loadedAsset, file]) => {
                if (file && loadedAsset) {
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
            })
        })
    }

    renderLoadedAssets = (loadedAssetPromises) => {
        Promise.all(loadedAssetPromises).then((loadedAssets)=> {
            this.setState({loadedAssets}, () => {
                var entities = []
                var lights = []
                loadedAssets.forEach((loadedAsset) => {
                    if (loadedAsset) {
                        //Entities
                        entities.push(
                        <Entity key={loadedAsset.id}
                                class="assets"
                                static-body={{shape: "box"}}
                                geometry={{primitive: 'box', width:loadedAsset.width, height:loadedAsset.height, depth: 0.1}}
                                material={{src: 'data:' + loadedAsset.type + ';base64,' + loadedAsset.file}}
                                position={{x: loadedAsset.x, y: loadedAsset.y, z: loadedAsset.z}} 
                                hoverable grabbable stretchable draggable
                        /> )
                    
                        //lights
                        lights.push(<a-light type="point" intensity=".3" color="white" position={`${loadedAsset.x} ${loadedAsset.height * 1.5} ${loadedAsset.z * -6}`}/>)
                    }
                })
                this.setState({entities, lights})
            })

        })
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


    componentDidMount() {
        window.NAF.schemas.add({
          template: '#avatar-template',
          components: [
            'position',
            'rotation',
            'scale',
            {
              selector: '.head',
              component: 'material',
              property: 'color'
            }
          ]
        });
    }


    render() {
        return (
            <Scene className="aframeContainer" embedded networked-scene={{serverURL: "http://localhost:8080", app: "PresenceVR", room: "123", debug: true, adapter: 'easyrtc'}} >

                <a-assets>
                    <template id="avatar-template">
                        <a-entity class="avatar">
                            <a-sphere class="head" color="#5985ff" scale="0.45 0.5 0.4" random-color>
                            </a-sphere>
                            <a-entity class="face" position="0 0.05 0">
                                <a-sphere class="eye" color="#efefef" position="0.16 0.1 -0.35" scale="0.12 0.12 0.12">
                                    <a-sphere class="pupil" color="#000" position="0 0 -1" scale="0.2 0.2 0.2">
                                    </a-sphere>
                                </a-sphere>
                                <a-sphere class="eye" color="#efefef" position="-0.16 0.1 -0.35" scale="0.12 0.12 0.12">
                                    <a-sphere class="pupil" color="#000" position="0 0 -1" scale="0.2 0.2 0.2">
                                    </a-sphere>
                                </a-sphere>
                            </a-entity>
                        </a-entity>
                    </template>
                </a-assets>

                <Entity environment={{preset: this.props.environment, dressingAmount: 500}}></Entity>
                

                <Entity id="player" networked={{template: "#avatar-template", showLocalTemplate: false}} camera={{userheight: "1.6"}} 
                        wasd-controls="" look-controls="" position="" rotation="" scale="" visible="">
                    <Entity template="" visible="" position="" rotation="" scale="">
                        <Entity class="avatar" position="" rotation="" scale="" visible="">
                            <a-sphere class="head" color="#5985ff" scale="0.45 0.5 0.4" random-color="" position="" rotation="" visible="" material="" geometry="">
                            </a-sphere>
                            <Entity class="face" position="0 0.05 0" rotation="" scale="" visible="">
                                <a-sphere class="eye" color="#efefef" position="0.16 0.1 -0.35" scale="0.12 0.12 0.12" rotation="" visible="" material="" geometry="">
                                    <a-sphere class="pupil" color="#000" position="0 0 -1" scale="0.2 0.2 0.2" rotation="" visible="" material="" geometry="">
                                    </a-sphere>
                                </a-sphere>
                                <a-sphere class="eye" color="#efefef" position="-0.16 0.1 -0.35" scale="0.12 0.12 0.12" rotation="" visible="" material="" geometry="">
                                    <a-sphere class="pupil" color="#000" position="0 0 -1" scale="0.2 0.2 0.2" rotation="" visible="" material="" geometry="">
                                    </a-sphere>
                                </a-sphere>
                            </Entity>
                        </Entity>
                    </Entity>
                </Entity>
                {this.state.entities}
                {this.state.lights}
            </Scene>
        )
    }
}

export default AframeInterview;