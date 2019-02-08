## Dependencies

To run the application:

- [Node v6.9](https://nodejs.org/download/release/v6.16.0/) and NPM (comes bundled with Node)

To deploy the application:

- firebase-tools
  - Install with `npm install -g firebase-tools`



## Quick Start Guide

1. Clone or download the repo

2. Drop the provided config files (*api.config.js* and *firebase.config.js*) in the ''**src/configs/**'' directory

3. Run the `npm install && npm build && npm run deploy`

4. Go get coffee

5. Navigate to one of the following URLs (depending on which config files you used)

   Development:

   Production:



# <u>Development Guide (*from scratch*)</u>

## Getting Started

### 1. Install

Get the dependencies listed at the top of this file. I recommend using NVM on Linux to manage node versions. 

- Clone the repo

- Install node packages

  - `cd` into the repo and run `npm install`

    ​

### 2. Make a Firebase project

Firebase is used for authentication and hosting. Go to http://console.firebase.google.com, sign in and create a new project. 

You must do two things:

- Enable Google sign in

  - Go to the authentication tab in the left pane
  - Click on the 'Sign-in method' tab
  - Click 'Enable' next to Google log-in

- Extract your configuration settings.

  - Go to the authentication tab in the left pane
    ![](C:/Users/ak101/Documents/SeniorProject/PresenceVR-UI/docs/authentication.JPG)

  - Go to the 'web setup' of your project at the top right of the page
    ![](C:/Users/ak101/Documents/SeniorProject/PresenceVR-UI/docs/websetup.JPG)

  - Copy and paste the provided config string into a 'firebase.config.js' file under ''**/src/configs/**''. It should look like this:

    ```
    export const config = {
        apiKey: "YOUR DATA",
        authDomain: "YOUR DATA",
        databaseURL: "YOUR DATA",
        projectId: "YOUR DATA",
        storageBucket: "YOUR DATA",
        messagingSenderId: "YOUR DATA"
      };
    ```



### 3. Configure

#### Server:

You can configure the server in **'src/config/api.config.js'** This API configuration is 			simply the address and port of the server. In development mode it should look like this:

`export const API_URL = 'http://localhost:8080`

When deployed, this URL should point to your server.

`export const API_URL = 'https://your-server's-url.com`

**->DO NOT INCLUDE A TRAILING '/'**<-



#### Firebase:

You should already have **'src/config/firebase.config.js'** completed from the last section. Now do the following 

1. Run `firebase login`
2. Run `firebase list` and copy and paste your project ID into **'.firebaserc'** at the root of the project.
3. You are now configured for deployments!

Original firebase + react deploy documentation [here](https://facebook.github.io/create-react-app/docs/deployment#firebase-https-firebasegooglecom).



## Now what?

### `npm install`

Installs all front end dependencies to /node_modules/

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

This is an alias to `firebase deploy` . This deploys whatever is in your build directory.

Note: You must be logged in to deploy a project. ( run: `firebase login`)





## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
