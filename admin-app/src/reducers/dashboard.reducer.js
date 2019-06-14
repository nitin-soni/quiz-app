import {dashboardConstants} from './../constants/dashboard.constants'
const initalState = {
    totalCounts : {
        users: 0,
        quizes: 0,
        request: 0,
        questions: 0,
    }
}
export function dashboard(state = initalState, action) {
    switch (action.type) {
        case dashboardConstants.STATS_REQUEST :
            return {
                totalCounts : {
                    users: action.data.total_users,
                    quizes: action.data.total_quizes,
                    request: action.data.total_request,
                    questions: action.data.total_questions,
                }
            }
        default:
            return state;
    }
}