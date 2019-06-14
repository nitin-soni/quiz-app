import { alertConstants } from '../constants';
import alertify from 'alertifyjs';
export const alertActions = {
    success,
    error,
    clear
};

function success(message) {
    clear();
    alertify.success(message);
    return { type: alertConstants.SUCCESS, message };
}

function error(message) {
    clear();
    alertify.error(message);
    return { type: alertConstants.ERROR, message };
}

function clear() {
    alertify.dismissAll();
    return { type: alertConstants.CLEAR };
}