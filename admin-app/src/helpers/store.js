import { createStore, applyMiddleware, compose  } from 'redux';
import thunkMiddleware from 'redux-thunk'
// import {createLogger} from 'redux-logger'
import rootReducer from './../reducers'


// const loggerMiddlerWare = createLogger();
const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(
        thunkMiddleware,
        // loggerMiddlerWare
    )
);

export const store = createStore(
    rootReducer,
    enhancer
);