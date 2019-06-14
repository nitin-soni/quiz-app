import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {Sidebar, FooterNav, TopBar} from './../components/Shared'

function PrivateRoute({component: Component, authed, ...rest}) {
        return (
        <Route
            {...rest}
            render={(props) => localStorage.getItem('user')
                ? <div id="wrapper">
                    {/*<Route path="/all-subjects" component={ListAllSubject}/>*/}
                    <Sidebar/>
                    {/*Main Content*/}
                    <div id="content-wrapper" className="d-flex flex-column">
                        <TopBar/>
                        <Component {...props} />
                        <FooterNav/>
                    </div>
                    {/*End of Main Content*/}
                </div>
                : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>}
        />
    )
}
export default PrivateRoute;