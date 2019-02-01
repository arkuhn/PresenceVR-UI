import React, { Component } from 'react';
import './aframeInterview.css';
import 'aframe';
import {Entity, Scene} from 'aframe-react';
import 'aframe-environment-component'
import UploadAPI from '../../utils/UploadAPI';
import {API_URL} from '../../config/api.config'

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
            var assetPromises = data.loadedAssets.map((assetId) => {
                return UploadAPI.getUpload(assetId).then((asset) => {
                    if (asset) {
                        console.log(asset)
                        var randomX = Math.random() * (6 - 1) + 1
                        var randomY = Math.random() * (6 - 1) + 1
                        var randomZ = Math.random() * (2 - 0) + 0
                        var randomD = Math.random() * (6 - 2) + 1
                        return <Entity geometry={{primitive: 'box', width: 0.001, height: randomD}} material={{src: `${API_URL}${asset.data.fullpath}`}} position={{x: randomX, y: randomY, z: randomZ}} /> 
                    
                    }
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
                <a-light type="point" color="white" position="0 5 0"></a-light>

                <Entity geometry={{primitive: 'box'}} material={{src: `https://b3h2.scene7.com/is/image/BedBathandBeyond/185908365252857p?$imagePLP$&wid=256&hei=256`}} position={{x: 0, y: 5, z: -10}} />
                {this.state.renderedAssets}
            </Scene>
        )
    }
}

export default AframeInterview;