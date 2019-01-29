import axios from 'axios';
import { API_URL } from "../config/api.config";
import { firebaseAuth } from './firebase';    

//Takes in an interview object
function assetUpload(data){
    return firebaseAuth.currentUser.getIdToken(true).then((token) => {
        let config = {
            headers: { 
                'Authorization': `${token}`
            }
        };
        console.log('data')
        console.log(data)
        return axios.post(API_URL + '/api/upload/assets',  data , config).then((response) => {
            console.log('Asset uploaded response');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    })
}

export default {
    assetUpload
}