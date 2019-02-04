import 'aframe';
import 'aframe-environment-component';
import { Entity, Scene } from 'aframe-react';
import React, { Component } from 'react';
import UploadAPI from '../../utils/UploadAPI';
import './aframeInterview.css';

class AframeInterview extends Component {

   constructor(props) {
        super(props);
        console.log(this.props)
        this.state = ({
            renderedAssets: [],
            loaded: false
        })
    }

    //Not sure why env prop updates but not loadedAssets, this is a hack to fix
    componentWillReceiveProps(data) {
        if (data.loadedAssets) {
            var index = 0;
            var assetPromises = data.loadedAssets.map((assetId) => {
                return UploadAPI.getUpload(assetId)
                .then((asset) => {
                    return Promise.all([Promise.resolve(asset), UploadAPI.getUploadFile(asset.data.name)])
                .then(([asset, file]) => {
                    if (file) {
                        var varheight = asset.data.height
                        var varwidth = asset.data.width
                        var ratio = 0
                        if (varheight > varwidth){
                            ratio = varwidth/varheight
                            varheight = 5
                            varwidth = 5 * ratio
                        }
                        else{
                            ratio = varheight/varwidth
                            varheight = 5 * ratio
                            varwidth = 5 
                        }
                        var posX = 0
                        var posY = (varheight/2)
                        index = index - 3
                        var source = 'url(data:' + asset.data.filetype + ';base64,' + file.data +')'
                    
                        return <Entity key={asset.data._id} geometry={{primitive: 'box', width:varwidth, height:varheight, depth: 0.001}} material={{src: source, npot: true}} position={{x: posX, y: posY, z: index}} /> 
                    }
                })
                })
            })
    
            Promise.all(assetPromises).then((assets)=> {
                this.setState({renderedAssets: assets})
            })
        }
    }

    render() {
        return (
            <Scene className="aframeContainer" embedded> 
                <Entity id="box" geometry="primitive: box" material="color: red"></Entity>
                <Entity environment={{preset: this.props.environment, dressingAmount: 500}}></Entity>
                <a-light type="point" color="white" position="0 8 0"></a-light>
                <Entity geometry={{primitive: 'box'}} material={{src: `https://b3h2.scene7.com/is/image/BedBathandBeyond/185908365252857p?$imagePLP$&wid=256&hei=256`}} position={{x: 0, y: 5, z: -10}} />
                {this.state.renderedAssets}
            </Scene>
        )
    }
}

export default AframeInterview;