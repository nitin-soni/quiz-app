import React from 'react'
import {userService} from "../../services/UserService";
import SimpleReactValidator from "simple-react-validator";
import {alertActions} from "../../actions";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'

class EditUser extends React.Component{
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
                role: {name:'', display_name:'Select Role'},
                user_role: '',
                email: '',
                phone_number: '',
                username: '',
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showEditItemModal) {
            this.setState({
                item: {
                    guid: nextProps.itemToEdit.guid,
                    first_name: nextProps.itemToEdit.first_name,
                    last_name: nextProps.itemToEdit.last_name,
                    gender: nextProps.itemToEdit.gender,
                    status: nextProps.itemToEdit.status,
                    role: nextProps.itemToEdit.role,
                    user_role: nextProps.itemToEdit.role.name,
                    email: nextProps.itemToEdit.email,
                    phone_number: nextProps.itemToEdit.phone_number,
                    username: nextProps.itemToEdit.username,
                },
                subjects: nextProps.subjects
            })
        }
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
                role: {name:'', display_name:'Select Role'},
                user_role: '',
                email: '',
                phone_number: '',
                username: '',
            }
        });
        this.validator.purgeFields();
    }
    updateItem = event => {
        event.preventDefault();
        event.stopPropagation();
        if (this.validator.allValid()) {
            const {item} = this.state;
            this.setState({isLoading: true});
                userService.updateItem(item).then(
                success => {
                    alertActions.success(success.message);
                    this.props.toggleEditItemModal(true);
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
    render(){
        const {first_name, last_name, email, phone_number, gender, user_role} = this.state.item;
        return(
            <Modal
                isOpen={this.props.showEditItemModal}
                toggle={this.props.toggleEditItemModal}
                className='modal-lg modal-dialog-centered'
                onClosed={(e) => {
                    this.resetItemForm()
                }}>
                <form className="user" id='saveItemForm'>
                    <ModalHeader toggle={this.props.toggleEditItemModal}>Update User</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input type="text" className="form-control "
                                   id="first_name" name="first_name"
                                   placeholder="First Name" value={first_name}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('first_name', first_name, 'required')}
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input type="text" className="form-control "
                                   id="last_name" name="last_name"
                                   placeholder="Last Name" value={last_name}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('last_name', last_name, 'required')}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control "
                                   id="email" name="email"
                                   placeholder="Email" value={email}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('email', email, 'required')}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone_number">Phone Number</label>
                            <input type="text" className="form-control "
                                   id="phone_number" name="phone_number"
                                   placeholder="Phone Number" value={phone_number}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('phone_number', phone_number, 'required')}
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="form-check-inline">
                                <label className="form-check-label">
                                    <input type="radio" className="form-check-input" name="gender" value='male' checked={gender==='male'} onChange={this.handleInputChange}/>Male
                                </label>
                            </div>
                            <div className="form-check-inline">
                                <label className="form-check-label">
                                    <input type="radio" className="form-check-input" name="gender" value='female' checked={gender==='female'}  onChange={this.handleInputChange}/>Female
                                </label>
                            </div>
                            {this.validator.message('gender', gender, 'required')}
                        </div>
                        <div className="form-group">
                            <label htmlFor='user-role'>Role</label>
                            <select
                                className="form-control "
                                id="user_role" name="user_role"
                                value={user_role}
                                onChange={this.handleInputChange}
                            >
                                <option value=''>Select</option>
                                <option value='super_admin'>Super Administrator</option>
                                <option value='teacher'>Teacher</option>
                                <option value='user'>Student</option>
                            </select>
                            {this.validator.message('User Role', user_role, 'required')}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <LaddaButton
                            loading={this.state.isLoading}
                            onClick={this.updateItem}
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
                        <Button type="button" color="secondary"
                                onClick={() => {this.props.toggleEditItemModal(false); this.resetItemForm()}}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}
export default EditUser;