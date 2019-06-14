import {subjectConstants} from "../constants";
import {subjectService} from "../services/SubjectService";
import {alertActions} from "./alert.actions";

export const subjectActions = {
    createSubject,
    updateSubject,
    deleteSubject,
    toggleCreateSubjectModal
}

function createSubject(subject) {
    return dispatch => {
        dispatch(request({subject}));
        subjectService.createSubject(subject)
            .then(
                subject => {
                    dispatch(success(subject));
                    dispatch(alertActions.success(subject.message.toString()));
                },
                error => {
                    console.log(error)
                    dispatch(failure(error))
                    dispatch(alertActions.error(error.toString()));
                }
            )
    }

    function request(subject) {
        return {type: subjectConstants.CREATE_REQUEST, subject}
    };

    function success(subject) {
        return {type: subjectConstants.CREATE_SUCCESS, subject}
    };

    function failure(error) {
        return {type: subjectConstants.CREATE_FAILURE, error}
    };
}

function updateSubject(subject) {
    return dispatch => {
        dispatch(request({subject}));
        subjectService.updateSubject(subject)
            .then(
                subject => {
                    dispatch(success(subject));
                },
                error => {
                    dispatch(failure(error))
                }
            )
    }

    function request(subject) {
        return {type: subjectConstants.UPDATE_REQUEST, subject}
    };

    function success(subject) {
        return {type: subjectConstants.UPDATE_SUCCESS, subject}
    };

    function failure(error) {
        return {type: subjectConstants.UPDATE_FAILURE, error}
    };
}

function toggleCreateSubjectModal(currentState) {
    console.log(currentState.showCreateSubjectModal)
    return {type: subjectConstants.TOGGLE_CREATE_MODAL, currentState}
}

function deleteSubject(subject) {
    return dispatch => {
        dispatch(request({subject}));
        subjectService.deleteSubject(subject)
            .then(
                subject => {
                    dispatch(success(subject));
                },
                error => {
                    dispatch(failure(error))
                }
            )
    }

    function request(subject) {
        return {type: subjectConstants.DELETE_REQUEST, subject}
    }

    function success(subject) {
        return {type: subjectConstants.DELETE_SUCCESS, subject}
    }

    function failure(error) {
        return {type: subjectConstants.DELETE_FAILURE, subject}
    }
}