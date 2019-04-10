import axios from 'axios';
import { API_URL } from "../config/api.config";
import { safeGetUser } from './firebase';

//Upload a file
function uploadFile(data, type){
    return safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
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
    return safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
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
    return safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
        let config = {headers: {Authorization: `${token}`}};
        return axios.delete(API_URL + `/api/uploads/${id}`,
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
    return safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
        let config = {headers: {Authorization: `${token}`}};
        return axios.get(API_URL + `/api/uploads/${id}`
        , config).then((response) => {
            console.log('Got  upload for host response');
            console.log(response);
            return response; 
        }).catch((error) => {
            console.log(error);
        });
    })
}

function getUploadFileURL(id) {
    return safeGetUser().then((user) => {
        return Promise.all([user.getIdToken(true),  Promise.resolve(user.email)])
    }).then(([token, email]) => {
        return API_URL + `/uploads/${email.replace(/[^a-zA-Z0-9]/g, '')}/${id}/${token}`
    })
    .catch((error) => {
        console.log(error);
    });
}

export default {
    uploadFile,
    getUploads,
    deleteUpload,
    getUpload,
    getUploadFileURL
}