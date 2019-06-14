import {userService} from "./index";

export const configService = {
    handleResponse
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if(response.status === 401 ) {
                //Do user logout of 401
                userService.logout();
                window.location.reload(true);
            }
            const error = (data && data) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    })
}