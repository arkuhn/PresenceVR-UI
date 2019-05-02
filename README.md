# Docs
### - [Firebase setup](./docs/firebase.md)
### - [Feature map](./docs/FeatureMap.md)


# Quick Start

## Install

1. Clone the repository from GitHub
   `git clone https://github.com/arkuhn/PresenceVR-UI.git`

2. Install Nodejs 6.9 from [here](<https://nodejs.org/en/download/>).

   TIP: Use nvm to manage versions of node and npm on your machine.

3. CD into the folder and install the dependencies

   `cd PresenceVR-UI && npm install`

4.  Install firebase-tools (this will be used later for deployment)
   `npm install -g firebase-tools`

   

## Configure

### API

The API config is the URL that the front end will point to for server calls. This file exists inside of `./src/config/api.config.js` . 

For local development (when the backend is running on the same machine) this file should look like this:
`export const API_URL = "http://localhost:8080" `

If the server is deployed somewhere (google app engine for instance), the link should be updated.

`export const API_URL = "https://[google app engine ID].appspot.com"`

### Firebase

- To configure the firebase settings for the app you must first have a firebase project set up. Learn how to do this in `./docs/firebase.md`

- Create a Firebase configuration in  `./src/config/firebase.config.js` . This will be used for hosting and authorization. It should have the following format:

  ```
  export const config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: ""
  }
  ```

- Run `firebase login`. Then, to get the project name you can run `firebase list`. Create a `firebase.rc` file inside of the root folder (on the the same level as `src`, `docs`, etc then put the name of your project  in the following format:

  ```
  {
    "projects": {
      "default": "[project name]"
    }
  }
  ```

  

- There is also a `firebase.json` file in the root. You do not need to configure this, but it is important that this baseline configuration is used (especially no-caching) for deployment to work properly. 

  

## Develop

### npm start

This will run a local development server in your shell. It will be available in the browser at `http://localhost:3000`

### npm build

This will produce a production ready build of the static assets in the build folder.

### npm run deploy

This is an alias for `npm build && firebase use default && firebase deploy`

- The firebase default command ensures that you are pointing to the right project based on the `.firebaserc` file.  

Original firebase + react deploy documentation [here](https://facebook.github.io/create-react-app/docs/deployment#firebase-https-firebasegooglecom).



## Deploy

Once you have configured the application, deploying is as easy as running `npm run deploy`. 

- You must be logged in to firebase-tools CLI for this to work (`firebase login`)

Once the command finishes, the URL you can see the app deployed at is in the terminal output.







### 

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
