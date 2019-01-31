import axios from 'axios';
import { API_URL } from "../config/api.config";
import { firebaseAuth } from './firebase';    

//Upload a file
function uploadFile(data, type){
    return firebaseAuth.currentUser.getIdToken(true).then((token) => {
        let config = {
            headers: { 
                'Authorization': `${token}`,
                'type': type
            }
        };
        return axios.post(API_URL + '/api/uploads',  data , config).then((response) => {
            console.log('Upload response');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    })
}

function getUploads() {
    return firebaseAuth.currentUser.getIdToken(true).then((token) => {
        let config = {headers: {Authorization: `${token}`}};
        return axios.get(API_URL + `/api/uploads`
        , config).then((response) => {
            console.log('Got all uploads for host response');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    })
}

function deleteUpload(id) {
    return firebaseAuth.currentUser.getIdToken(true).then((token) => {
        let config = {headers: {Authorization: `${token}`}};
        return axios.delete(API_URL + '/api/uploads/' + `${id}`,
        config).then((response) => {
            console.log('Attempting to delete upload:');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    })
}
            
function getUpload(id) {
    return firebaseAuth.currentUser.getIdToken(true).then((token) => {
        let config = {headers: {Authorization: `${token}`}};
        return axios.get(API_URL + `/api/uploads${id}`
        , config).then((response) => {
            console.log('Got  upload for host response');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    })
}

export default {
    uploadFile,
    getUploads,
    deleteUpload,
    getUpload
}