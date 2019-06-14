import { userConstants } from './../constants/user.constants'
let user = false;
try{
    user = JSON.parse(localStorage.getItem('user'));
}catch (e) {
    user = false;
}
const initialState = user ? {loggedIn: false, user: user} : {};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST :
            return {
                loggingIn: true,
                user: action.user
            };
        case userConstants.LOGIN_SUCCESS :
            return {
                loggedIn: true,
                user: action.user
            };
        case userConstants.LOGIN_FAILURE :
            return {
                loggingIn: false,
            };
        case userConstants.LOGOUT:
            return {};
        default:
            return state;
    }
}