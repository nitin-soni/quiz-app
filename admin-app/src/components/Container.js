import React, {Component} from 'react';
import './../vendor/fontawesome-free/css/all.min.css'

import "react-datepicker/dist/react-datepicker.css";
import 'alertifyjs/build/css/alertify.min.css'
import 'alertifyjs/build/css/themes/semantic.min.css'
// import 'ladda/dist/ladda.min.css'
import 'ladda/dist/ladda-themeless.min.css';
import 'react-table/react-table.css'

import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min';
import './../css/sb-admin-2.css';
import './../css/custom.css';
// import '../js/sb-admin-2.min'

import routes from './../helpers/routes';
import {ForgotPassword, Login, Signup} from './Auth'
import Dashboard from './Dashobard/Dashboard'
import { Route, Switch} from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import ListAllSubject from "./Subject/ListAllSubject";
import ListAllUnit from "./Units/ListAllUnit";
import ListAllUnitTopic from "./UnitTopic/ListAllUnitTopic";
import ListAllQuestion from "./Question/ListAllQuestion";
import ListAllQuiz from "./Quiz/ListAllQuiz";
import ListAllUser from "./User/ListAllUser";
import ChangePassword from "./Profile/ChangePassword";
import UpdateProfile from "./Profile/UpdateProfile";
import SiteSettings from "./Settings/SiteSettings";
import Page404 from './Page404';

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {authed: false};
    }
    render() {
        document.body.classList.add('bg-gradient-primary');
        return (
            <div id='container'>
                {/*<h1 className='text-white'>Jai ho {routes.login}</h1>*/}
                <Switch>
                    <Route path={routes.login} exact component={Login}/>
                    <Route path={routes.signup} component={Signup}/>
                    <Route path={routes.forgotPassword} component={ForgotPassword}/>
                    <PrivateRoute path={routes.dashboard} exact component={Dashboard}/>
                    <PrivateRoute path={routes.unitsList} component={ListAllUnit}/>
                    <PrivateRoute path={routes.unitTopicList} component={ListAllUnitTopic}/>
                    <PrivateRoute path={routes.questionList} component={ListAllQuestion}/>
                    <PrivateRoute path={routes.usersList} component={ListAllUser}/>
                    <PrivateRoute path={routes.quizList} component={ListAllQuiz}/>
                    <PrivateRoute path={routes.changePassword} component={ChangePassword}/>
                    <PrivateRoute path={routes.updateProfile} component={UpdateProfile}/>
                    <PrivateRoute path={routes.settings} component={SiteSettings}/>
                    <PrivateRoute path={routes.subjects} component={ListAllSubject}/>
                    <Route component={Page404} />
                </Switch>
                {/*Scroll to Top Button*/}
                <a className="scroll-to-top rounded" href="#page-top">
                    <i className="fas fa-angle-up"></i>
                </a>
            </div>
        )
    }
}

export default Container;