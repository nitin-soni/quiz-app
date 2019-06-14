import React, {Component} from 'react'
import UserDropdownMenu from "./UserDropdownMenu";
import NotificationMenu from "./NotificationMenu";
import MessageMenu from "./MessageMenu";

class TopBar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                {/*  Sidebar Toggle (Topbar)  */}
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars"></i>
                </button>

                {/*  Topbar Navbar  */}
                <ul className="navbar-nav ml-auto">
                    {/*  Nav Item - Alerts  */}
                    <li className="nav-item dropdown no-arrow mx-1">
                        <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-bell fa-fw"></i>
                            {/*  Counter - Alerts  */}
                            <span className="badge badge-danger badge-counter">3+</span>
                        </a>
                        {/*  Dropdown - Alerts  */}
                        <NotificationMenu/>
                    </li>

                    {/*  Nav Item - Messages  */}
                    <li className="nav-item dropdown no-arrow mx-1">
                        <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-envelope fa-fw"></i>
                            {/*  Counter - Messages  */}
                            <span className="badge badge-danger badge-counter">7</span>
                        </a>
                        {/*  Dropdown - Messages  */}
                        <MessageMenu/>
                    </li>

                    <div className="topbar-divider d-none d-sm-block"></div>

                    {/*  Nav Item - User Information  */}

                    {/*  Dropdown - User Information  */}
                    <UserDropdownMenu/>


                </ul>

            </nav>
        );
    }
}

export default TopBar;