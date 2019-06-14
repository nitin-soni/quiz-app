import React, {Component} from 'react'

class MessageMenu extends Component{
    render(){
        return(
            <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                 aria-labelledby="messagesDropdown">
                <h6 className="dropdown-header">
                    Message Center
                </h6>
                <a className="dropdown-item d-flex align-items-center" href="/messages">
                    <div className="dropdown-list-image mr-3">
                        <img className="rounded-circle" src="https://source.unsplash.com/fn_BT9fwg_E/60x60"
                             alt="" />
                        <div className="status-indicator bg-success"></div>
                    </div>
                    <div className="font-weight-bold">
                        <div className="text-truncate">Hi there! I am wondering if you can help me with a
                            problem I've been having.
                        </div>
                        <div className="small text-gray-500">Emily Fowler · 58m</div>
                    </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="/messages">
                    <div className="dropdown-list-image mr-3">
                        <img className="rounded-circle" src="https://source.unsplash.com/AU4VPcFN4LE/60x60"
                             alt="" />
                        <div className="status-indicator"></div>
                    </div>
                    <div>
                        <div className="text-truncate">I have the photos that you ordered last month, how
                            would you like them sent to you?
                        </div>
                        <div className="small text-gray-500">Jae Chun · 1d</div>
                    </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="/messages">
                    <div className="dropdown-list-image mr-3">
                        <img className="rounded-circle" src="https://source.unsplash.com/CS2uCrpNzJY/60x60"
                             alt=""/>
                        <div className="status-indicator bg-warning"></div>
                    </div>
                    <div>
                        <div className="text-truncate">Last month's report looks great, I am very happy with
                            the progress so far, keep up the good work!
                        </div>
                        <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                    </div>
                </a>
                <a className="dropdown-item d-flex align-items-center" href="/messages">
                    <div className="dropdown-list-image mr-3">
                        <img className="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                             alt=""/>
                        <div className="status-indicator bg-success"></div>
                    </div>
                    <div>
                        <div className="text-truncate">Am I a good boy? The reason I ask is because someone
                            told me that people say this to all dogs, even if they aren't good...
                        </div>
                        <div className="small text-gray-500">Chicken the Dog · 2w</div>
                    </div>
                </a>
                <a className="dropdown-item text-center small text-gray-500" href="/messages">Read More Messages</a>
            </div>
        );
    }
}
export default MessageMenu;