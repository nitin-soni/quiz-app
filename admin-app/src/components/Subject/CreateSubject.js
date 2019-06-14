import React, {Component} from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'
import SimpleReactValidator from 'simple-react-validator'
import {subjectService} from "../../services/SubjectService";
import {alertActions} from "../../actions";

class CreateSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            subject: {
                name: '',
                description: ''
            }
        };
        // this.toggleCreateSubjectModal = this.toggleCreateSubjectModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });
    }

    handleInputChange = event => {
        const {name, value} = event.target;
        const {subject} = this.state;
        this.setState({
            subject: {
                ...subject,
                [name]: value
            }
        });
    }

    resetItemForm = () => {
        this.setState({
            subject: {
                name: '',
                description: ''
            }
        });
        this.validator.purgeFields();
    }
    saveItem = event => {
        event.preventDefault();
        event.stopPropagation();
        if (this.validator.allValid()) {
            const {subject} = this.state;
            this.setState({isLoading: true});
            subjectService.createItem(subject).then(
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
            <div>
                <Modal isOpen={this.props.showCreateItemModal} toggle={this.props.toggleCreateItemModal}
                       className='modal-lg modal-dialog-centered' >
                    <form className="user" id='saveItemForm'>
                        <ModalHeader toggle={this.props.toggleCreateItemModal}>Create Subject</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <input type="text" className="form-control "
                                       id="name" name="name"
                                       placeholder="Subject Name" value={this.state.subject.name}
                                       onChange={this.handleInputChange}/>
                                {this.validator.message('name', this.state.subject.name, 'required')}
                            </div>
                            <div className="form-group">
                                <textarea type="text" className="form-control "
                                          id="description" name="description"
                                          placeholder="Enter description..."
                                          onChange={this.handleInputChange}
                                          value={this.state.subject.description}></textarea>
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
                            <Button color="secondary" onClick={()=>{this.props.toggleCreateItemModal();this.resetItemForm()}}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default CreateSubject;