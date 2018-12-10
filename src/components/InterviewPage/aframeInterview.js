import React, { Component } from 'react';
import './aframeInterview.css';
import 'aframe';
import {Entity, Scene} from 'aframe-react';

class AframeInterview extends Component {

    render() {
        return (
            <Scene className="aframeContainer" embedded> 
                <Entity id="box" geometry="primitive: box" material="color: red"></Entity>
               
            </Scene>
        )
    }
}

export default AframeInterview;