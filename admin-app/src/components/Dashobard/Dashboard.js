import React, {Component} from 'react';
import {connect} from 'react-redux'
import {dashBoardAction} from "../../actions/dashboard.actions";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalUsers: 0,
            totalQuestions: 0,
            totalQuizes: 0,
            totalRequests: 0
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        dispatch(dashBoardAction.getStats());
        document.getElementById('container').className = '';
    }

    render() {
        const { users:totalUsers, request:totalRequests, questions:totalQuestions, quizes:totalQuizes } = this.props.totalCounts;
        return (
            <div className="container-fluid">
                {/* Page Heading  */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>

                </div>

                {/* Content Row  */}
                <div className="row">
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card border-left-success shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total
                                            Users
                                        </div>
                                        <div
                                            className="h5 mb-0 font-weight-bold text-gray-800">{totalUsers}</div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-users fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card border-left-primary shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total
                                            Questions
                                        </div>
                                        <div
                                            className="h5 mb-0 font-weight-bold text-gray-800">{totalQuestions}</div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-question-circle fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card border-left-primary shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total
                                            Quizes
                                        </div>
                                        <div
                                            className="h5 mb-0 font-weight-bold text-gray-800">{totalQuizes}</div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card border-left-warning shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div
                                            className="text-xs font-weight-bold text-warning text-uppercase mb-1">Pending
                                            Requests
                                        </div>
                                        <div
                                            className="h5 mb-0 font-weight-bold text-gray-800">{totalRequests}</div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-comments fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        totalCounts: state.dashboard.totalCounts
    }
}

export default connect(mapStateToProps)(Dashboard);