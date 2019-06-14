import config from 'react-global-configuration';
import {configService} from './ConfigService'
import {authHeader} from "../helpers";
export const quizService = {
    createItem,
    updateItem,
    deleteItem,
    getAllItems,
    assignQuestions,
    getQuizQuestions
}

function getAllItems(queryString) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
        accept: 'application/json',
    };
    return fetch(`${config.get('apiUrl')}/quiz?${queryString}`, requestOptions)
        .then(configService.handleResponse);
}
function getQuizQuestions(queryString) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
        accept: 'application/json',
    };
    return fetch(`${config.get('apiUrl')}/quiz/questions/${queryString}`, requestOptions)
        .then(configService.handleResponse);
}
function createItem(item) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(item),
    };
    return fetch(`${config.get('apiUrl')}/quiz`, requestOptions)
        .then(configService.handleResponse);
}
function updateItem(item) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(item),
    };
    return fetch(`${config.get('apiUrl')}/quiz`, requestOptions)
        .then(configService.handleResponse);
}
function deleteItem(item) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(item),
    };
    return fetch(`${config.get('apiUrl')}/quiz`, requestOptions)
        .then(configService.handleResponse);
}
function assignQuestions(item) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(item),
    };
    return fetch(`${config.get('apiUrl')}/quiz/assign-question`, requestOptions)
        .then(configService.handleResponse);
}