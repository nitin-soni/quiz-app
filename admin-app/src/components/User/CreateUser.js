import React from 'react'
import SimpleReactValidator from "simple-react-validator";
import {alertActions} from "../../actions";
import {userService} from "../../services/UserService";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'

class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            item: {
                guid: '',
                first_name: '',
                last_name: '',
                gender: '',
                status: '',
                role: {name: '', display_name: 'Select Role'},
                user_role: '',
                email: '',
                phone_number: '',
                username: '',
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });
    }

    handleInputChange = event => {
        const {name, value} = event.target;
        const {item} = this.state;
        this.setState({
            item: {
                ...item,
                [name]: value
            }
        });
    }
    resetItemForm = () => {
        this.setState({
            item: {
                guid: '',
                first_name: '',
                last_name: '',
                gender: '',
                status: '',
                role: {name: '', display_name: 'Select Role'},
                user_role: '',
                email: '',
                phone_number: '',
                username: '',
            }
        });
        this.validator.purgeFields();
    }
    saveItem = event => {
        event.preventDefault();
        event.stopPropagation();
        if (this.validator.allValid()) {
            const {item} = this.state;
            this.setState({isLoading: true});
            userService.createItem(item).then(
                success => {
                    alertActions.success(success.message);
                    this.props.toggleCreateItemModal(true);
                    this.resetItemForm();
                    this.setState({isLoading: false});
                },
                error => {
                    console.log(error)
                    alertActions.error(error.message);
                    this.setState({isLoading: false});
                }
            )
        } else {
            this.validator.showMessages();
            // re render to show messages for the first time
            this.forceUpdate();
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.showCreateItemModal}
                toggle={this.props.toggleCreateItemModal}
                className='modal-lg modal-dialog-centered'
            >
                <form className="user" id='saveItemForm'>
                    <ModalHeader toggle={this.props.toggleCreateItemModal}>Create User</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input type="text" className="form-control "
                                   id="first_name" name="first_name"
                                   placeholder="First Name" value={this.state.item.first_name}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('first_name', this.state.item.first_name, 'required')}
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input type="text" className="form-control "
                                   id="last_name" name="last_name"
                                   placeholder="Last Name" value={this.state.item.last_name}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('last_name', this.state.item.last_name, 'required')}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control "
                                   id="email" name="email"
                                   placeholder="Email" value={this.state.item.email}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('email', this.state.item.email, 'required')}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone_number">Phone Number</label>
                            <input type="text" className="form-control "
                                   id="phone_number" name="phone_number"
                                   placeholder="Phone Number" value={this.state.item.phone_number}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('phone_number', this.state.item.phone_number, 'required')}
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="form-check-inline">
                                <label className="form-check-label">
                                    <input type="radio" className="form-check-input" name="gender" value='male' checked={this.state.item.gender==='male'} onChange={this.handleInputChange}/>Male
                                </label>
                            </div>
                            <div className="form-check-inline">
                                <label className="form-check-label">
                                    <input type="radio" className="form-check-input" name="gender" value='female' checked={this.state.item.gender==='female'}  onChange={this.handleInputChange}/>Female
                                </label>
                            </div>
                            {this.validator.message('gender', this.state.item.gender, 'required')}
                        </div>
                        <div className="form-group">
                            <label htmlFor='user-role'>Role</label>
                            <select
                                className="form-control "
                                id="user_role" name="user_role"
                                value={this.state.item.user_role}
                                onChange={this.handleInputChange}
                            >
                                <option value=''>Select</option>
                                <option value='super_admin'>Super Administrator</option>
                                <option value='teacher'>Teacher</option>
                                <option value='user'>Student</option>
                            </select>
                            {this.validator.message('User Role', this.state.item.user_role, 'required')}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <LaddaButton
                            loading={this.state.isLoading}
                            onClick={this.saveItem}
                            color="blue"
                            size='S'
                            style={SLIDE_UP}
                            spinnerSize={30}
                            spinnerColor="#ddd"
                            spinnerLines={12}
                            className="btn btn-primary"
                        >Save
                        </LaddaButton>
                        {/*<Button color="primary" onClick={this.saveItem}>Save</Button>*/}
                        <Button color="secondary"
                                onClick={() => {this.props.toggleCreateItemModal(); this.resetItemForm()}}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}

export default CreateUser;