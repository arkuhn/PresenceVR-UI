import React from 'react';

import UploadAPI from '../../../utils/UploadAPI';

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
                            x: index * 6
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
   var entities = [];
   assets.forEach((asset, index) => {
        if (!asset) { return }
        //Create a 'source' (texture to be used) in the <a-assets> system
        

        let entity;
        let options;
        if (asset.name.toLowerCase().includes(".jpg") || asset.name.toLowerCase().includes(".png")){
            options = `template: #img-template; attachTemplateToLocal: false`
            entity = <a-entity key={index} id={`ent${asset.id}`} 
                        networked={options}
                        position="0 0 0" rotation="0 0 0" scale="1 1 1">
                        <a-box 
                        static-body="shape: box" hoverable="" grabbable="" stretchable="" draggable=""
                            class="img-box"  
                            position={`${asset.x} ${asset.y} ${asset.z}`}
                            rotation="0 0 0" 
                            scale="1 1 1" 
                            material={`src: url(${asset.file}); npot: true`}
                            geometry={`width: ${asset.width}; height: ${asset.height}; depth: 0.1`}>
                        </a-box>
                    </a-entity>
        }
        else if (asset.name.toLowerCase().includes(".obj")){
            options = `template: #obj-template; attachTemplateToLocal: false`
            entity = <a-entity key={index} id={`ent${asset.id}`}
                        networked={options} 
                        position="0 0 0" rotation="0 0 0" scale="1 1 1">
                        <a-obj-model    
                        static-body="shape: box" hoverable="" grabbable="" stretchable="" draggable=""
                            class="obj-model"
                            position={`${asset.x} ${asset.y} ${asset.z}`}
                            rotation="0 0 0" 
                            scale="1 1 1" 
                            src={`url(${asset.file})`}>
                        </a-obj-model>
                    </a-entity>
        }
        else if(asset.name.toLowerCase().includes(".mp4")){
            options = `template: #vid-template; attachTemplateToLocal: false`
            entity = <a-entity key={index} id={`ent${asset.id}`} 
                        networked={options}
                        position="0 0 0" rotation="0 0 0" scale="3 3 3">
                        <a-video 
                            static-body="shape: box" hoverable="" grabbable="" stretchable="" draggable=""
                            class="vid-box"
                            position={`${asset.x} ${asset.y} ${asset.z}`}
                            rotation="0 0 0"
                            scale="1 1 1"
                            material= {`src: url(${asset.file}); npot: true`}
                            >
                        </a-video>
                    </a-entity>
        }
        console.log(asset.owner, user)
        if (entity && asset.owner === user) {
            //Create entity that links to template and source
            entities.push( entity )
        }
 
             
   })
   return {entities}
}

function registerSchemas() {
    let schemas = [{template: '#img-template', selector: '.img-box', properties: ['geometry', 'position', 'rotation', 'scale', "material"]},
    {template: '#obj-template', selector: '.obj-model', properties: ['position', 'rotation', 'scale', "src"]},
    {template: '#vid-template', selector: '.vid-box', properties: ['position', 'rotation', 'scale', "material"]}] 

    schemas.forEach((schema) => {
        let components = schema.properties.map((property) => {
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
                        <a-entity class="assets" position="" rotation="" scale="">
                            <a-box class="img-box" geometry="" position="" rotation="" scale="" material="" ></a-box>
                        </a-entity> 
                     </template>`

const cameraTemplate = `<template id="camera-template">
                            <a-entity class="cameraRig">
                            </a-entity>
                        </template>`
 
const objTemplate = `<template id="obj-template">
                    <a-entity class="assets"  position="" rotation="" scale="">
                        <a-obj-model class="obj-model"  position="" rotation="" scale="" src="" ></a-obj-model>
                    </a-entity> 
                    </template>`

const vidTemplate = `<template id="vid-template">
                    <a-entity class="assets" position="" rotation="" scale="">
                        <a-video class="vid-box" position="" rotation="" scale="" material="" ></video>
                    </a-entity> 
                    </template>`

                    
export default {renderData, registerSchemas, getData, avatarTemplate, imgTemplate, cameraTemplate, objTemplate, vidTemplate}