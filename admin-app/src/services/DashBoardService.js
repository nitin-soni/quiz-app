import config from 'react-global-configuration';
import {authHeader} from "../helpers";
import {configService} from './ConfigService';
export const dashBoardService = {
    getStats
}

function getStats() {
    const requestOptions = {
        method: 'get',
        headers: authHeader(),
    };
    return fetch(`${config.get('apiUrl')}/dashboard/statics`, requestOptions)
        .then(configService.handleResponse)
        .then(data => {
            return data;
        }).catch(error => {
            console.log(error)
        });
}
