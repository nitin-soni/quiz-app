import React, {Component} from 'react'
import { Link, Redirect } from 'react-router-dom'
import SimpleReactValidator from 'simple-react-validator'
import {userActions} from './../../actions/user.actions'
import {connect} from 'react-redux';
import LaddaButton, { SLIDE_UP } from '@zumper/react-ladda'

class Login extends Component{
    constructor(props){
        super(props);
        this.props.dispatch(userActions.logout());
        this.state = {
            user: {
                username: '',
                password: '',
            }
        };
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });
        this.handleInputChange = this.handleInputChange.bind(this);
        this.doLogin = this.doLogin.bind(this);
    }
    handleInputChange = event => {
        const {name, value} = event.target;
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }
    doLogin = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.validator.allValid()) {
            this.setState({ submitted: true });
            const {user} = this.state;
            const { dispatch } = this.props;
            dispatch(userActions.login(user.username, user.password));
        } else {
            this.validator.showMessages();
            // re render to show messages for the first time
            this.forceUpdate();
        }
    }
    componentDidMount() {
        document.getElementById('container').className = 'container';
    }
    render(){
        document.body.classList.add('bg-gradient-primary');
        const { loggingIn, loggedIn } = this.props;
        let loginPageContent;
        if(loggedIn){
            loginPageContent = <Redirect to='/'/>
        }else {
            loginPageContent = <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">

                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            {/* Nested Row within Card Body */}
                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                        </div>
                                        <form className="user">
                                            <div className="form-group">
                                                <input type="text" className="form-control form-control-user"
                                                       id="username" name="username"
                                                       placeholder="Enter Email Address..." onChange={this.handleInputChange}/>
                                                {this.validator.message('password', this.state.user.username, 'required')}
                                            </div>
                                            <div className="form-group">
                                                <input type="password" className="form-control form-control-user"
                                                       id="password" name="password" placeholder="Password" onChange={this.handleInputChange}/>
                                                {this.validator.message('password', this.state.user.password, 'required')}
                                            </div>
                                            {/*<button className="btn btn-primary btn-user btn-block" onClick={this.doLogin}>*/}
                                            {/*Login*/}
                                            {/*</button>*/}
                                            <LaddaButton
                                                loading={loggingIn}
                                                onClick={this.doLogin}
                                                color="blue"
                                                size='S'
                                                style={SLIDE_UP}
                                                spinnerSize={30}
                                                spinnerColor="#ddd"
                                                spinnerLines={12}
                                                className="btn btn-primary btn-user btn-block"
                                            >
                                                Login
                                            </LaddaButton>
                                        </form>
                                        <hr />
                                        <div className="text-center">
                                            <Link className="small" to="forgot-password">Forgot Password?</Link>
                                        </div>
                                        <div className="text-center">
                                            {/*<a className="small" href="signup"></a>*/}
                                            <Link to="/signup" className="small">Create an Account!</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        }
        return(
            loginPageContent
        )
    }
}
function mapStateToProps(state) {
    const { loggingIn, loggedIn } = state.authentication;
    return {
        loggingIn,
        loggedIn
    }
}
Login.defaultProps = {
    loggedIn: false
}
export default connect(mapStateToProps)(Login);