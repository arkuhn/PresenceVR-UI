import 'aframe';
import 'aframe-environment-component';
import 'aframe-teleport-controls'
import 'networked-aframe'
import { Entity, Scene } from 'aframe-react';
import React, { Component } from 'react';
import UploadAPI from '../../utils/UploadAPI';
import './aframeInterview.css';

class AframeInterview extends Component {

   constructor(props) {
        super(props);
        this.state = ({
            lights: [],
            entities: [],
            loadedAssets: [],
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
                                geometry={{primitive: 'box', width:loadedAsset.width, height:loadedAsset.height, depth: 0.001}}
                                material={{src: 'data:' + loadedAsset.type + ';base64,' + loadedAsset.file , npot: true}}
                                position={{x: loadedAsset.x, y: loadedAsset.y, z: loadedAsset.z}} 
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
        console.log('HERE', data)
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

    render() {
        return (
            <Scene className="aframeContainer" embedded networked-scene={{serverURL: "http://localhost:8080", app: "PresenceVR", room: "123", debug: true}} > 
                <Entity environment={{preset: this.props.environment, dressingAmount: 500}}></Entity>
                <a-entity id="cameraRig">
                    <a-entity id="head" camera wasd-controls look-controls position= "0 2 0"></a-entity>
                    <a-entity laser-controls id="left-hand" teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head; type: line; maxLength: 20;" ></a-entity>
                    <a-entity laser-controls id="right-hand" teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head; type: line; maxLength: 20;" ></a-entity>
                </a-entity>
                {this.state.entities}
                {this.state.lights}
            </Scene>
        )
    }
}

export default AframeInterview;