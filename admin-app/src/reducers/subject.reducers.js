import { subjectConstants } from "../constants";
const initialState = {isLoading: false, showCreateSubjectModal: false};
export function subjects(state = initialState, action) {
    switch (action.type){
        case subjectConstants.CREATE_REQUEST :
            return {
                isLoading: true,
                showCreateSubjectModal: true
            };
        case subjectConstants.CREATE_FAILURE:
        case subjectConstants.UPDATE_FAILURE:
        case subjectConstants.DELETE_FAILURE:
        case subjectConstants.GETALL_FAILURE:
            return {
                error: action,
                showCreateSubjectModal: true
            }
        case subjectConstants.TOGGLE_CREATE_MODAL:
            console.log(action);
            return {
                showCreateSubjectModal: !action.currentState.showCreateSubjectModal
            };
        default :
            return state;
    }
}