import {dashboardConstants} from "../constants";
import {dashBoardService} from "../services";

export const dashBoardAction = {
    getStats
}

function getStats() {
    return dispatch => {
        dashBoardService.getStats().then(
            response =>  {
                dispatch(success(response.data));
            }
        )
    }
    function success(data) { return {type:dashboardConstants.STATS_REQUEST, data} }
}