let aframe_string = '<a-scene className="aframeContainer" networked-scene="serverURL:http://localhost:8080;app:PresenceVR;room:123;debug:true"><a-assets><template id="avatar-template"><a-entity class="avatar"><a-sphere class="head"color="#5985ff"scale="0.45 0.5 0.4"random-color></a-sphere><a-entity class="face"position="0 0.05 0"><a-sphere class="eye"color="#efefef"position="0.16 0.1 -0.35"scale="0.12 0.12 0.12"><a-sphere class="pupil"color="#000"position="0 0 -1"scale="0.2 0.2 0.2"></a-sphere></a-sphere><a-sphere class="eye"color="#efefef"position="-0.16 0.1 -0.35"scale="0.12 0.12 0.12"><a-sphere class="pupil"color="#000"position="0 0 -1"scale="0.2 0.2 0.2"></a-sphere></a-sphere></a-entity></a-entity></template></a-assets><a-entity id="player" networked="template:#avatar-template;showLocalTemplate:false;" camera="userHeight: 1.6" spawn-in-circle="radius:3" wasd-controls="" look-controls="" position="" rotation="" scale="" visible=""><a-entity template="" visible="" position="" rotation="" scale=""><a-entity class="avatar" position="" rotation="" scale="" visible=""><a-sphere class="head" color="#5985ff" scale="0.45 0.5 0.4" random-color="" position="" rotation="" visible="" material="" geometry=""></a-sphere><a-entity class="face" position="0 0.05 0" rotation="" scale="" visible=""><a-sphere class="eye" color="#efefef" position="0.16 0.1 -0.35" scale="0.12 0.12 0.12" rotation="" visible="" material="" geometry=""><a-sphere class="pupil" color="#000" position="0 0 -1" scale="0.2 0.2 0.2" rotation="" visible="" material="" geometry=""></a-sphere></a-sphere><a-sphere class="eye" color="#efefef" position="-0.16 0.1 -0.35" scale="0.12 0.12 0.12" rotation="" visible="" material="" geometry=""><a-sphere class="pupil" color="#000" position="0 0 -1" scale="0.2 0.2 0.2" rotation="" visible="" material="" geometry=""></a-sphere></a-sphere></a-entity></a-entity></a-entity></a-entity><a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box><a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere><a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder><a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane><a-sky color="#ECECEC"></a-sky></a-scene>';
export default aframe_string;