import {configService} from "./ConfigService";
import config from "react-global-configuration";
import {authHeader} from "../helpers";
export const unitService = {
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
    return fetch(`${config.get('apiUrl')}/unit?${queryString}`, requestOptions)
        .then(configService.handleResponse);
}
function createItem(item) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(item),
    };
    return fetch(`${config.get('apiUrl')}/unit`, requestOptions)
        .then(configService.handleResponse);
}
function updateItem(item) {
    console.log(item)
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(item),
    };
    return fetch(`${config.get('apiUrl')}/unit`, requestOptions)
        .then(configService.handleResponse);
}
function deleteItem(item) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(item),
    };
    return fetch(`${config.get('apiUrl')}/unit`, requestOptions)
        .then(configService.handleResponse);
}