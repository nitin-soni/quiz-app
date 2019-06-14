export function authHeader(){
    // return authorization header with basic auth credentials
    // let user = JSON.parse(localStorage.getItem('user'));
    let user = false;
    try{
        user = JSON.parse(localStorage.getItem('user'));
    }catch (e) {
        user = false;
    }
    if(user && user.access_token && user.token_type) {
        return {
            'Authorization' : user.token_type + ' ' + user.access_token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }else {
        return {};
    }
}