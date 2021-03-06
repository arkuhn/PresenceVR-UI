import axios from 'axios';
import { API_URL } from "../config/api.config";
import { safeGetUser } from './firebase';

function getInterview(id){
        return safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
            let config = {headers: {Authorization: `${token}`,
                                    "Access-Control-Allow-Origin": "*"}};
            return axios.get(API_URL + `/api/interviews/${id}`, config).then((response) => {
                console.log('got a result');
                console.log(response);
                return response;
            })
        })

}

//Takes in an interview object
function createInterview(data){
    return  safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
        let config = {headers: {Authorization: `${token}`}};
        return axios.post(API_URL + '/api/interviews', { data }, config).then((response) => {
            console.log('Interview created response');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    })
}

//returns all interviews for user. takes in host
function getAllInterviews(id){
    return  safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
        let config = {headers: {Authorization: `${token}`}};
        return axios.get(API_URL + `/api/interviews/`
        , config).then((response) => {
            console.log('Got all interviews for host response');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    })
}

//takes in updated interview object
function updateInterview(data, id){
    return  safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
        let config = {headers: {Authorization: `${token}`}};
        return axios.put(API_URL + `/api/interviews/${id}`, { data }, config).then((response) => {
            console.log('Update interview result');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    })
}

//will work same as interview object
function deleteInterview(id){
    return  safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
        let config = {headers: {Authorization: `${token}`, id }};
        return axios.delete(API_URL + `/api/interviews/`, config).then((response) => {
            console.log('Delete interview result');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    })
}

function patchInterview(id, field, value, operation) {
    return  safeGetUser().then((user) => user.getIdToken(true)).then((token) => {
        let config = {headers: {Authorization: `${token}`}};
        return axios.patch(API_URL + `/api/interviews/${id}`, {field, value, op: operation}, config).then((response) => {
            console.log('Patched interview');
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        });
    });
}

export default {
    getInterview, createInterview, getAllInterviews, updateInterview, deleteInterview, patchInterview
}
