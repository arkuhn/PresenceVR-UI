# Make a Firebase project

Firebase is used for authentication and hosting. Go to http://console.firebase.google.com, sign in and create a new project. You must do three things after creating the project.

### Enable Google Sign in

- Enable Google sign in

  - Go to the authentication tab in the left pane
  - Click on the 'Sign-in method' tab
  - Click 'Enable' next to Google log-in




### Extract configuration data

- Extract your configuration settings.

  1. Go to the authentication tab in the left pane
     ![](C:/Users/ak101/Documents/SeniorProject/PresenceVR-UI/docs/authentication.JPG)

  2. Go to the 'web setup' of your project at the top right of the page
     ![](C:/Users/ak101/Documents/SeniorProject/PresenceVR-UI/docs/websetup.JPG)

  3. The popup will contain the configuration you need for `src/config/firebase.config.js`. The data should look like this:

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



### Restrict Deployment Versions

By default, firebase keeps all deployments for rolling back. This can get expensive and bump you out of the free tier. To only keep the most recently deployed version do the following:

1. Click on the hosting tab under the project overview

   ![hosting](C:\Users\ak101\Documents\SeniorProject\PresenceVR-UI\docs\hosting.JPG)

2. Click on the  settings button next to deployments and then click 'Version History Settings'

   ![hosting2](C:\Users\ak101\Documents\SeniorProject\PresenceVR-UI\docs\hosting2.JPG)

3. Change the version amount to 1

![hosting3](C:\Users\ak101\Documents\SeniorProject\PresenceVR-UI\docs\hosting3.JPG)