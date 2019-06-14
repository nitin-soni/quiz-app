// import authHeader from '../helpers/auth-header';
import config from 'react-global-configuration';
import {configService} from './ConfigService'
import {authHeader} from "../helpers";
export const userService = {
    login,
    logout,
    signup,
    createItem,
    updateItem,
    deleteItem,
    getAllItems,
    toggleUserStatus
}

function login(userName, password) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({ "username": userName, "password": password})
    };
     return fetch(`${config.get('apiUrl')}/auth/signin`, requestOptions)
    //return fetch('https://reqres.in/api/login', requestOptions)
        .then(configService.handleResponse)
        .then(user => {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user.data));
            }
            return user;
        });
        //.catch(() => console.log("Can’t access response. Blocked by browser?"));
}
function logout() {
    localStorage.removeItem('user');
}
function signup(user) {
    const requestData = {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.emailAddress,
        phone_number: user.phoneNumber,
        password: user.password,
        password_confirmation: user.confirmPassword,
        dob: user.dob,
        gender: user.gender,
    };
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'},
        accept: 'application/json',
        body: JSON.stringify(requestData),
        // mode: 'no-cors'
    };
    return fetch(`${config.get('apiUrl')}/auth/signup`, requestOptions)
        .then(configService.handleResponse);
}

function getAllItems(queryString) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
        accept: 'application/json',
    };
    return fetch(`${config.get('apiUrl')}/user?${queryString}`, requestOptions)
        .then(configService.handleResponse);
}
function createItem(item) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(item),
    };
    return fetch(`${config.get('apiUrl')}/user`, requestOptions)
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
    return fetch(`${config.get('apiUrl')}/user`, requestOptions)
        .then(configService.handleResponse);
}
function deleteItem(item) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify(item),
    };
    return fetch(`${config.get('apiUrl')}/user`, requestOptions)
        .then(configService.handleResponse);
}
function toggleUserStatus(guid) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        accept: 'application/json',
        body: JSON.stringify({'guid':guid}),
    };
    return fetch(`${config.get('apiUrl')}/user/toggle-status`, requestOptions)
        .then(configService.handleResponse);
}