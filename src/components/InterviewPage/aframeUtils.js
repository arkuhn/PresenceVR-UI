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
       return Promise.all([UploadAPI.getUpload(loadedAssetId), UploadAPI.getUploadFile(loadedAssetId)])
           .then(([loadedAsset, file]) => {
               if (loadedAsset && file) {
                   var objectData = {
                       file: file.data,
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
                   
                   if (loadedAsset.data.name.toLowerCase().includes(".obj")){
                       objectData.y = 1
                       objectData.z = -3
                   }
                   return objectData;
               }
       })
   
   })

}



/* Turn each assets data into its respective JSX
*/
function renderData(assets, user)  {
   var sources =[];
   var templates = [];
   var entities = [];
   assets.forEach((asset, index) => {
       if (!asset) { return }
       if (asset.name.toLowerCase().includes(".jpg") || asset.name.toLowerCase().includes(".png")){
           //Create a 'source' (texture to be used) in the <a-assets> system
           sources.push(<img id={`img${asset.id}`} alt='' src={`data:${asset.type};base64,${asset.file}`}/>)
           //Create a template in <a-assets> system
           templates.push( `<template id="t${asset.id}">
                           <a-entity position="" rotation="" scale=""> 
                           </a-entity> 
                           </template>`)

           if (asset.owner === user){
               //Create entity that links to template and source
               let options = `template: #img-template; attachTemplateToLocal: false`
               entities.push( <a-entity key={index} id={`ent${asset.id}`} networked={options} position="0 0 0" rotation="0 0 0" scale="1 1 1"> 
                                  <a-box class="img-box" position="0 0 0" rotation="0 0 0" scale="1 1 1" material="" >
                                  </a-box>
                              </a-entity>)
           }
           
       }
   })
   return {templates, entities, sources}
}

export default {renderData, getData}