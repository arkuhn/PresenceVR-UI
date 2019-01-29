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

export default {
    uploadFile,
    getUploads
}