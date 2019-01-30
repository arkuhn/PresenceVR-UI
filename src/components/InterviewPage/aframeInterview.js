import React, { Component } from 'react';
import './aframeInterview.css';
import 'aframe';
import {Entity, Scene} from 'aframe-react';
import 'aframe-environment-component'

class AframeInterview extends Component {

/*     constructor(props) {
        super(props);
    }
    
    run = () => {

    }
 */
    render() {
        return (
            <Scene className="aframeContainer" embedded> 
                <Entity id="box" geometry="primitive: box" material="color: red"></Entity>
                <Entity environment={{preset: 'default', dressingAmount: 500}}></Entity>
            </Scene>
        )
    }
}

export default AframeInterview;