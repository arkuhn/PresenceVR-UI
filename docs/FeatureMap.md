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
- Toggle to enable webcam chat
- Webcam conferencing between one to many users
- Audio supported
- Local Cam feed visible to see your own cam feed
- Video component unmounts when leaving page

#### Known Issues:
- Find an alternative solution to twilio
- Webcam video resizing does not work
- Twilio servers cost money to support
- Twilio isn't very flexible/easily customizable

#### Files:
- videoComponent.js
- aframeInterview.js

#### Libraries:
- Twilio

### Conferencing (States)

#### Current State:
- Realtime updatable state for entering/exiting interview room
- State changes logged in chat

#### Known Issues:
- Detailed state changes not implemented (In VR, In video conference, etc.)

#### Files:
- interviewPage.js
- socketEvents.js


#### Libraries:
- React
- OpenSocket

### Conferencing (Chat)

#### Current State:
- realtime chat with one to many users inside interview
- logs state with color coded entries

#### Known Issues:
- Chat is not persisted after leaving page
- Errors not logged in chat

#### Files:
- chat.js
- interviewPage.js

#### Libraries:
- none

## Future Goals

#### ‘In-game’ VR user interface
- Render/Remove Assets
- Change environment
- Handoff host privileges
- Add video playback options (play, pause, stop, mute)
#### Implement VR whiteboard experience
#### Custom 3D environments
- Office Room
- Whiteboard Room
#### Improved VR Avatars (Humanlike)
- Joint simulation
- Realistic Movement
#### Better support for 3D Objects
- Uploading
- Interaction
#### Performance Optimizations
- GPU acceleration
- Asset caching
#### Improved range of file support uploaded into VR (.gif, .webm, .flv, .MTL, etc.)
#### Improving performance of cross-platform experience (improved mobile VR experience)

