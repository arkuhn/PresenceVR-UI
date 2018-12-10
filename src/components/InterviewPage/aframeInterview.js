import React, { Component } from 'react';
import './aframeInterview.css';

class AframeInterview extends Component {

    render() {
        return (
            <div className="aframeContainer">
            <a-scene className='aframeComponent' embedded> 
                <a-entity id="box" geometry="primitive: box" material="color: red"></a-entity>
                <a-entity environment="preset: default; dressingAmount: 500"></a-entity>
            </a-scene>
            </div>
        )
    }
}

export default AframeInterview;