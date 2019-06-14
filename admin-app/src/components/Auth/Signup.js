import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import DatePicker from 'react-datepicker'
import {connect} from 'react-redux';
import {userActions} from './../../actions/user.actions'
// import addDays from "date-fns/addDays";
import addDays from "date-fns/add_days"

import SimpleReactValidator from 'simple-react-validator';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                emailAddress: '',
                password: '',
                confirmPassword: '',
                dob: '',
                gender: 'male',
                phoneNumber: ''
            },
            submitted: false
        };
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDobChange = this.handleDobChange.bind(this);
        this.doSignup = this.doSignup.bind(this);
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
    handleDobChange = (date, event) => {
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                dob: date
            }
        });
    }
    doSignup = (event) => {
        event.preventDefault();
        if (this.validator.allValid()) {
            this.setState({ submitted: true });
            const {user} = this.state;
            const { dispatch } = this.props;
            dispatch(userActions.signup(user));
        } else {
            this.validator.showMessages();
            // re render to show messages for the first time
            this.forceUpdate();
        }
    }
    capitalizeFirstLetter = (event) => {
        let {name, value} = event.target;
        const {user} = this.state;
        value = (value.charAt(0).toUpperCase() + value.substr(1));
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
        event.target.value = value;
    }

    render() {
        return (
            <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                    {/*Nested Row within Card Body*/}
                    <div className="row">
                        <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
                        <div className="col-lg-7">
                            <div className="p-5">
                                <div className="text-center">
                                    <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                                </div>
                                <form className="user">
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="text" className="form-control form-control-user"
                                                   name="firstName" id="firstName" placeholder="First Name"
                                                   onChange={this.handleInputChange}
                                                   onKeyUp={this.capitalizeFirstLetter}/>
                                            {this.validator.message('firstName', this.state.user.firstName, 'required|alpha')}
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control form-control-user"
                                                   name="lastName" id="lastName" placeholder="Last Name"
                                                   onKeyUp={this.capitalizeFirstLetter}/>
                                            {this.validator.message('lastName', this.state.user.lastName, 'required|alpha')}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-user"
                                               name="emailAddress" id="emailAddress" placeholder="Email Address"
                                               onChange={this.handleInputChange}/>
                                        {this.validator.message('emailAddress', this.state.user.emailAddress, 'required|email')}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-check-label form-check-inline">Gender</label>
                                        <label className="form-check-inline form-check-label ">
                                            <input type="radio" name="gender" value="male" className="form-check-input"
                                                   onChange={this.handleInputChange} defaultChecked/>Male
                                        </label>
                                        <label className="form-check-inline form-check-label">
                                            <input type="radio" name="gender" value="female"
                                                   className="form-check-input" onChange={this.handleInputChange}/>Female
                                        </label>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="text" className="form-control form-control-user"
                                                   name="phoneNumber" id="phoneNumber" placeholder="Phone Number"
                                                   onChange={this.handleInputChange}/>
                                            {this.validator.message('phoneNumber', this.state.user.phoneNumber, 'required|phone')}
                                        </div>
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <DatePicker
                                                className="form-control form-control-user"
                                                selected={this.state.user.dob}
                                                onChange={this.handleDobChange}
                                                placeholderText="Date of Birth"
                                                showMonthDropdown={false}
                                                showYearDropdown={false}
                                                dropdownMode="select"
                                                dateFormat="d-MM-yyyy"
                                                isClearable={false}
                                                maxDate={addDays(new Date(), 0)}
                                            />
                                            {this.validator.message('dob', this.state.user.dob, 'required')}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="password" className="form-control form-control-user"
                                                   name="password" id="password" placeholder="Password"
                                                   onChange={this.handleInputChange}/>
                                            {this.validator.message('password', this.state.user.password, 'required')}
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="password" className="form-control form-control-user"
                                                   name="confirmPassword" id="confirmPassword"
                                                   placeholder="Repeat Password" onChange={this.handleInputChange}/>
                                            {this.validator.message('confirmPassword', this.state.user.confirmPassword, 'required')}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="custom-control custom-checkbox small">
                                            By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy.
                                            You may receive SMS notifications from us and can opt out at any time.
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-user btn-block"
                                            onClick={this.doSignup}>
                                        Sign Up
                                    </button>
                                </form>
                                <hr/>
                                <div className="text-center">
                                    <Link className="small" to="forgot-password">Forgot Password?</Link>
                                </div>
                                <div className="text-center">
                                    <Link className="small" to="login">Already have an account? Login!</Link>
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
    const {registering} = state.registration;
    return {
        registering
    }
}

export default connect(mapStateToProps)(Signup);