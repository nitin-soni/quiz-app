import React, {Component} from 'react';
import Container from './components/Container';
import {BrowserRouter as Router} from "react-router-dom";
import {history} from './helpers';
import { alertActions } from './actions'
import { connect } from 'react-redux'
import config from 'react-global-configuration'
config.set({
    apiUrl: 'http://quiz-app.demo/api'
    // apiUrl: 'http://localhost/quiz-app/web/public/api'
    // apiUrl: 'http://localhost/blog/public/api'
});

class App extends Component {
    constructor(props) {
        super(props);
        const {dispatch} = this.props;
        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });
    }
    render() {
        return (
            <div className="App">
                <Router forceRefresh={false} history={history}>
                    <Container/>
                </Router>
            </div>
        );
    }
}
function mapStateToProps(state) {
    const {alert} = state;
    return {
        alert
    }
}
export default connect(mapStateToProps)(App);
