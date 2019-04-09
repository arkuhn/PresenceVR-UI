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
        return UploadAPI.getUpload(loadedAssetId)
                .then((loadedAsset) => {
                    return Promise.all([Promise.resolve(loadedAsset), UploadAPI.getUploadFileURL(loadedAsset.data.name)])
                })
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
        if (!(asset.owner === user)){ return }
        //Create a 'source' (texture to be used) in the <a-assets> system
        sources[asset.id] = `src: ${asset.file}; npot: true;`
        let entity;
        //sources.push(<img id={`img${asset.id}`} alt='' src={`data:${asset.type};base64,${asset.file}`}/>)
        if (asset.name.toLowerCase().includes(".jpg") || asset.name.toLowerCase().includes(".png")){
            let options = `template: #img-template; attachTemplateToLocal: false`
            entity =    <a-entity key={index} id={`ent${asset.id}`} 
                                networked={options} static-body="shape: box" hoverable="" grabbable="" stretchable="" draggable=""
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
            entity =    <a-entity key={index} id={`ent${asset.id}`} 
                                static-body="shape: box" hoverable="" grabbable="" stretchable="" draggable=""
                                position="0 0 0" rotation="0 0 0" scale="1 1 1">
                                    <a-obj-model    class="img-box"
                                                    position={`${asset.x} ${asset.y} ${asset.z}`}
                                                    rotation="0 0 0" 
                                                    scale="1 1 1" 
                                                    src={`id: ${asset.id}`}
                                                    geometry="">
                                    </a-obj-model>
                        </a-entity>
        }
        else if(asset.name.toLowerCase().includes(".mp4")){
            entity =    <a-entity key={index} id={`ent${asset.id}`} 
                                static-body="shape: box" hoverable="" grabbable="" stretchable="" draggable=""
                                position="0 0 0" rotation="0 0 0" scale="1 1 1">
                                    <a-video    class="img-box"
                                                position={`${asset.x} ${asset.y} ${asset.z}`}
                                                rotation="0 0 0" 
                                                materialid={`id: ${asset.id}`}>
                                    </a-video>
                        </a-entity>
        }

        //Create entity that links to template and source
        entities.push( entity )
             
   })
   return {entities, sources}
}

export default {renderData, getData}