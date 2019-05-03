import { config } from '../config/firebase.config'
const firebase = require('firebase/app');
require('firebase/auth');

firebase.initializeApp(config);

export const firebaseAuth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
var loading = false;

/**
 * Handles firebase authentication within the app
 */


 /**
  * Asynchronously gets the user through a listener, then destroys the listener
  */
export function safeGetUser() {
    return new Promise( function(resolve, reject) {
        var unsubscribe = firebaseAuth.onAuthStateChanged((user) => {     
            resolve (user)
        });
        unsubscribe()
    })
}

/**
 * Google Authentication through firebase
 */
export function loginWithGoogle() {
    loading = true;
    return firebaseAuth.signInWithRedirect(googleProvider)
    .catch((error) => {
        loading = false;
    });
}

export function logout() {
    return firebaseAuth.signOut();
}

/**
 * Handles Loading while page redirects to home screen after login
 */
export function isLoading() {
    return loading;
}

