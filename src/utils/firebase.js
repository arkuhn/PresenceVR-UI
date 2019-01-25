import firebase from 'firebase';
import { config } from '../config/firebase.config'

firebase.initializeApp(config);

export const firebaseAuth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
var loading = false;

export function loginWithGoogle() {
    loading = true;
    return firebaseAuth.signInWithRedirect(googleProvider)
    .then((result) => {
        /*
        loading = false;
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        */

    })
    .catch((error) => {
        loading = false;
        /*
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        */
    });
}

export function logout() {
    return firebaseAuth.signOut();
}

export function isLoading() {
    return loading;
}

