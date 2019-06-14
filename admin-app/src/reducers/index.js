import { combineReducers } from 'redux';

import {authentication} from './authentication.reducers'
import {registration} from './registration.reducer'
import {alert} from './alert.reducer'
import {users} from './users.reducer'
import {dashboard} from './dashboard.reducer'

const rootReducer =  combineReducers({
    authentication,
    registration,
    alert,
    users,
    dashboard
});
export default rootReducer;