import React, {Component} from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'
import SimpleReactValidator from 'simple-react-validator'
import {subjectService} from "../../services/SubjectService";
import {alertActions} from "../../actions";

class EditSubject extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.itemToEdit)
        this.state = {
            isLoading: false,
            item: {
                guid: '',
                name: '',
                description: ''
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
            console.log(nextProps)
            this.setState({
                item: {
                    guid: nextProps.itemToEdit.guid,
                    name: nextProps.itemToEdit.name,
                    description: nextProps.itemToEdit.description
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
                name: '',
                description: ''
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
            subjectService.updateItem(item).then(
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

    render() {
        const {name, description} = this.state.item;
        return (
            <Modal
                isOpen={this.props.showEditItemModal}
                toggle={this.props.toggleEditItemModal}
                className='modal-lg modal-dialog-centered'
                onClosed={(e) => {
                    this.resetItemForm()
                }}>
                <form className="user" id='saveItemForm'>
                    <ModalHeader toggle={this.props.toggleEditItemModal}>Edit Subject</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <input type="text" className="form-control "
                                   id="name" name="name"
                                   placeholder="Subject Name" value={name}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('name', name, 'required')}
                        </div>
                        <div className="form-group">
                                <textarea type="text" className="form-control "
                                          id="description" name="description"
                                          placeholder="Enter description..."
                                          onChange={this.handleInputChange}
                                          value={description}></textarea>
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

export default EditSubject;