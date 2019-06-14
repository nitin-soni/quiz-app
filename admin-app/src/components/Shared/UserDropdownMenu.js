import React, {Component} from 'react'
import {Link, NavLink} from 'react-router-dom'
import routes from './../../helpers/routes';
import {store} from './../../helpers/store'
// import {connect} from 'react-redux';

class UserDropdownMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedInUser: store.getState().authentication.user,
        };
    }

    render() {
        return (
            <li className="nav-item dropdown no-arrow">
                <button className="btn btn-link nav-link dropdown-toggle" id="userDropdown"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                        {`${this.state.loggedInUser.first_name} ${this.state.loggedInUser.last_name}`}
                    </span>
                    <img className="img-profile rounded-circle"
                         src="https://source.unsplash.com/QAB-WJcbgJk/60x60" alt=''/>
                </button>
                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                     aria-labelledby="userDropdown">
                    <NavLink className="dropdown-item" to={routes.updateProfile}>
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profile
                    </NavLink>
                    <NavLink className="dropdown-item" to={routes.changePassword}>
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Update Password
                    </NavLink>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/login">
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                    </Link>
                </div>
            </li>
        );
    }
}
export default UserDropdownMenu;
// const mapStateToProps = (state) => {
//     return {
//         loggedInUser: state.authentication.user
//     }
// }
// export default connect(mapStateToProps)(UserDropdownMenu);