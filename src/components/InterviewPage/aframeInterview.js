import 'aframe';
import 'aframe-environment-component';
import 'aframe-teleport-controls'
import 'networked-aframe';
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




    render() {

        let css = `a-scene {
    position: absolute;
    width: 100%;
    height: 100%;
  }

.aframeContainer {
  width: 100%;
  position: relative;
  padding-bottom: 70%;
  box-sizing: border-box;
}`;

        return (
            <div>
            <div className="aframeContainer" dangerouslySetInnerHTML={aframe_html} />
            <style>{css}</style>
            </div>
        )
    }
}

export default AframeInterview;