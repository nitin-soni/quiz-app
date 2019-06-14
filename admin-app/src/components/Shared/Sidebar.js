import React, {Component} from 'react'
import {NavLink} from 'react-router-dom';
import $ from 'jquery/dist/jquery'
import routes from './../../helpers/routes';
class Sidebar extends Component {
    constructor(){
        super();
        this.toggleSideMenu = this.toggleSideMenu.bind(this);
    }
    toggleSideMenu = () => {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
    }
    render() {
        return (
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                {/*Sidebar - Brand*/}
                <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" to={routes.dashboard}>
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">Quiz Admin <sup></sup></div>
                </NavLink>

                {/* Divider */}
                <hr className="sidebar-divider my-0"/>

                {/*  Nav Item - Dashboard  */}
                <li className="nav-item ">
                    <NavLink className="nav-link" to={routes.dashboard} activeClassName="active" exact strict>
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span></NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to={routes.subjectsList} activeClassName="active">
                        <i className="fas fa-fw fa-table"></i>
                        <span>Subjects</span></NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to={routes.unitsList} activeClassName="active">
                        <i className="fas fa-fw fa-table"></i>
                        <span>Units</span></NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to={routes.unitTopicList} activeClassName="active">
                        <i className="fas fa-fw fa-table"></i>
                        <span>Unit Topics</span></NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to={routes.questionList} activeClassName="active">
                        <i className="fas fa-fw fa-table"></i>
                        <span>Questions</span></NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to={routes.quizList} activeClassName="active">
                        <i className="fas fa-fw fa-table"></i>
                        <span>Quiz</span></NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to={routes.usersList} activeClassName="active">
                        <i className="fas fa-fw fa-table"></i>
                        <span>Users</span></NavLink>
                </li>

                {/*  Divider  */}
                <hr className="sidebar-divider d-none d-md-block"/>

                {/*  Sidebar Toggler (Sidebar)  */}
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" onClick={this.toggleSideMenu}></button>
                </div>

            </ul>
        );
    }
}

export default Sidebar;