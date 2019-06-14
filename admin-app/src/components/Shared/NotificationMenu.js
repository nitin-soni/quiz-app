import React, {Component} from 'react'

class NotificationMenu extends Component{
    render(){
        return(
            <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                 aria-labelledby="alertsDropdown">
                <h6 className="dropdown-header">
                    Alerts Center
                </h6>
                <a className="dropdown-item d-flex align-items-center" href="/notification">
                    <div className="mr-3">
                        <div className="icon-circle bg-primary">
                            <i className="fas fa-file-alt text-white"></i>
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">December 12, 2019</div>
                        <span className="font-weight-bold">A new monthly report is ready to download!</span>
                    </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="/notification">
                    <div className="mr-3">
                        <div className="icon-circle bg-success">
                            <i className="fas fa-donate text-white"></i>
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">December 7, 2019</div>
                        $290.29 has been deposited into your account!
                    </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="/notification">
                    <div className="mr-3">
                        <div className="icon-circle bg-warning">
                            <i className="fas fa-exclamation-triangle text-white"></i>
                        </div>
                    </div>
                    <div>
                        <div className="small text-gray-500">December 2, 2019</div>
                        Spending Alert: We've noticed unusually high spending for your account.
                    </div>
                </a>
                <a className="dropdown-item text-center small text-gray-500" href="/notification">Show All Alerts</a>
            </div>
        );
    }
}
export default NotificationMenu;