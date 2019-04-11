import React from 'react';

import UploadAPI from '../../utils/UploadAPI';

function getDimensions(loadedAsset){
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


function getData(loadedAssetIds) {
    return loadedAssetIds.map((loadedAssetId, index) => { 
        return Promise.all([UploadAPI.getUpload(loadedAssetId), UploadAPI.getUploadFileURL(loadedAssetId)])
                .then(([loadedAsset, fileURL]) => {
                    if (loadedAsset && fileURL) {
                        var objectData = {
                            file: fileURL,
                            owner: loadedAsset.data.owner,
                            type: loadedAsset.data.filetype,
                            name: loadedAsset.data.name,
                            id: loadedAsset.data._id,
                            x: index * 8
                        }
                        if(loadedAsset.data.name.toLowerCase().includes(".png") || loadedAsset.data.name.toLowerCase().includes(".jpg")){
                            var [h, w] = getDimensions(loadedAsset)
                            objectData.height = h
                            objectData.width = w
                            objectData.y = (objectData.height/2)
                            objectData.z =-3
                        }
                        
                        if (loadedAsset.data.name.toLowerCase().includes(".obj") || loadedAsset.data.name.toLowerCase().includes(".mp4")){
                            objectData.y = 1
                            objectData.z = -3
                        }
                        return objectData;
                    }
                })
                .catch((err)=> {
                    console.error(err)
                })
    })
}



/* Turn each assets data into its respective JSX
*/
function renderData(assets, user)  {
   var sources = {};
   var entities = [];
   assets.forEach((asset, index) => {
        if (!asset) { return }
        //Create a 'source' (texture to be used) in the <a-assets> system
        sources[asset.id] = `src: ${asset.file}; npot: true;`

        let entity;
        let options;
        if (asset.name.toLowerCase().includes(".jpg") || asset.name.toLowerCase().includes(".png")){
            options = `template: #img-template; attachTemplateToLocal: false`
            entity = <a-entity key={index} id={`ent${asset.id}`} 
                        networked={options}
                        position="0 0 0" rotation="0 0 0" scale="1 1 1">
                        <a-box class="img-box"  position={`${asset.x} ${asset.y} ${asset.z}`}
                            rotation="0 0 0" 
                            scale="1 1 1" 
                            materialid={`id: ${asset.id}`}
                            geometry={`width: ${asset.width}; height: ${asset.height}; depth: 0.1`}>
                        </a-box>
                    </a-entity>
        }
        else if (asset.name.toLowerCase().includes(".obj")){
            options = `template: #obj-template; attachTemplateToLocal: false`
            entity = <a-entity key={index} id={`ent${asset.id}`}
                        networked={options} 
                        position="0 0 0" rotation="0 0 0" scale="1 1 1">
                        <a-obj-model    class="obj-model"
                            position={`${asset.x} ${asset.y} ${asset.z}`}
                            rotation="0 0 0" 
                            scale="1 1 1" 
                            src={`id: ${asset.id}`}
                            geometry="">
                        </a-obj-model>
                    </a-entity>
        }
        else if(asset.name.toLowerCase().includes(".mp4")){
            options = `template: #vid-template; attachTemplateToLocal: false`
            entity = <a-entity key={index} id={`ent${asset.id}`} 
                        networked={options}
                        position="0 0 0" rotation="0 0 0" scale="1 1 1">
                        <a-video class="video"
                            position={`${asset.x} ${asset.y} ${asset.z}`}
                            rotation="0 0 0" 
                            materialid={`id: ${asset.id}`}>
                        </a-video>
                    </a-entity>
        }

        if (entity) {
            //Create entity that links to template and source
            entities.push( entity )
        }
 
             
   })
   return {entities, sources}
}

const avatarTemplate = `<template id="avatar-template"> 
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
                        </template>`

const imgTemplate = `<template id="img-template">
                        <a-entity class="assets" static-body="shape: box" hoverable="" grabbable="" stretchable="" draggable="" position="" rotation="" scale="">
                            <a-box class="img-box" geometry="" position="" rotation="" scale="" materialid="" ></a-box>
                        </a-entity> 
                     </template>`

const cameraTemplate = `<template id="camera-template">
                            <a-entity class="cameraRig">
                            </a-entity>
                        </template>`
 
const objTemplate = `<template id="obj-template">
                    <a-entity class="assets" static-body="shape: box" hoverable="" grabbable="" stretchable="" draggable="" position="" rotation="" scale="">
                        <a-obj-model class="obj-model" geometry="" position="" rotation="" scale="" materialid="" ></a-obj-model>
                    </a-entity> 
                    </template>`

const vidTemplate = `<template id="vid-template">
                    <a-entity class="assets" static-body="shape: box" hoverable="" grabbable="" stretchable="" draggable="" position="" rotation="" scale="">
                        <a-video class="vid-box" geometry="" position="" rotation="" scale="" materialid="" ></video>
                    </a-entity> 
                    </template>`

                    
export default {renderData, getData, avatarTemplate, imgTemplate, cameraTemplate, objTemplate, vidTemplate}