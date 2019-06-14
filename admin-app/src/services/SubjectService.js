import {configService} from "./ConfigService";
import config from "react-global-configuration";
import {authHeader} from "../helpers";
export const subjectService = {
    createItem,
    updateItem,
    deleteItem,
    getAllItems
}
function getAllItems(queryString) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
        accept: 'application/json',
    };
    return fetch(`${config.get('apiUrl')}/subject?${queryString}`, requestOptions)
        .then(configService.handleResponse);
}
function createItem(subject) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(subject),
    };
    return fetch(`${config.get('apiUrl')}/subject`, requestOptions)
        .then(configService.handleResponse);
}
function updateItem(subject) {
    console.log(subject)
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(subject),
    };
    return fetch(`${config.get('apiUrl')}/subject`, requestOptions)
        .then(configService.handleResponse);
}
function deleteItem(subject) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(subject),
    };
    return fetch(`${config.get('apiUrl')}/subject`, requestOptions)
        .then(configService.handleResponse);
}