import {userConstants} from "../constants";
import {userService} from "../services";
import {alertActions} from "./alert.actions";
import {history} from "../helpers";

export const userActions = {
    login,
    logout,
    signup
}

function login(userName, password) {
    return dispatch => {
        dispatch(request({ userName }));
        userService.login(userName, password)
            .then(
                user => {
                    dispatch(success(user.data));
                    history.push('/');
                    dispatch(alertActions.success(user.message.toString()));
                    // window.location.reload();
                },
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()))
                }
            );
    }
    function request(user) { return {type:userConstants.LOGIN_REQUEST, user} }
    function success(user) { return {type:userConstants.LOGIN_SUCCESS, user} }
    function failure(error) { return {type:userConstants.LOGIN_FAILURE, error} }
}
function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function signup(user) {
    return dispatch => {
        dispatch(request(user));
        userService.signup(user)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    console.log(error)
                }
            )
    }
    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}