# Feature Map

## Major Features

### Multiplayer

#### Current State:
- One to many participants inside an interview
- Assets can be uploaded and shared across users within the VR space
- User and object positoning is tracked and shared across users
- Object manipulation is tracked and shared across users (Scaling)
- Presenter Webcam stream visible in VR space to non presenter users

#### Known Issues:
- Leaving the page creates ghost avatars
- Avatar heights when using/not using headset are not the same.
- Networked-Aframe no longer supported by the creator
- Audio Twilio Track doesn't unmount when leaving the page
- Webcam Twilio track doesn't unmount when leaving the page
- Twilio track asks for webcam feed for all users in VR, even when not broadcasting

#### Files:
- aframeInterview.js
- aframeUtils.js

#### Libraries:
- Networked-Aframe
- Twilio

### VR

#### Current State:
- Users can render uploaded assets into the VR space (.png, .jpeg, .obj, .mp4 supported)
- User Avatars
- Users can interact in the VR space with or without a headset (Browser Mode vs. VR Mode)
- 4 Enviroments to choose from
- Fully dynamic; Asset rendering, environment rendering all done without reloading the page
- basic wasd controls for users outside VR
- Asset Manipulation (Position, Scaling)
- User movement (teleportation)

#### Known Issues:
- 3D Objects render without textures (.mtl files not supported)
- Limited file types supported for rendering in VR
- Rotation not implemented
- no custom environments (only using Aframe defaults)
- Avatars very basic (and creepy)
- Asset placement is very basic (custom placement not implemented)
- Deleted assets don't unrender automatically
- Quickly unrendering and rerendering assets creates race conditions (invalid image textures will appear)
- Some environments require double click to load (Tron, Japan)
- Dynamic spawn points (spawning on top of each other causes issues with teleportation)

#### Files:
- aframeInterview.js
- aframeUtils.js
- assets.js
- uploads.js

#### Libraries:
- AFrame
- aframe-react
- aframe-environment-component
- aframe-extras
- aframe-physics-system
- aframe-teleport-controls
- super-hands

### Conferencing (Webcam)

#### Current State:

#### Known Issues:

#### Files:

#### Libraries:

### Conferencing (States)

#### Current State:

#### Known Issues:

#### Files:

#### Libraries:

### Conferencing (Chat)

#### Current State:

#### Known Issues:

#### Files:

#### Libraries:

## Future Goals
