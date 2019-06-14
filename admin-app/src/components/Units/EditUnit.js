import React from 'react'
import {alertActions} from "../../actions";
import {unitService} from "../../services/UnitService";
import SimpleReactValidator from "simple-react-validator";
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
class EditUnit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            item: {
                guid: '',
                name: '',
                description: '',
                subject_guid: ''
            },
            subjects: [{guid:"", name:"Select"}]
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            item: {
                guid: nextProps.itemToEdit.guid,
                name: nextProps.itemToEdit.name,
                description: nextProps.itemToEdit.description,
                subject_guid: nextProps.itemToEdit.subject_guid,
            },
            subjects:nextProps.subjects
        })
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
                description: '',
                subject_guid: '',
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
            unitService.updateItem(item).then(
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
        const {name, description, subject_guid} = this.state.item;
        return(
            <Modal
                isOpen={this.props.showEditItemModal}
                toggle={this.props.toggleEditItemModal}
                className='modal-lg modal-dialog-centered'
                onClosed={(e) => {
                    this.resetItemForm()
                }}>
                <form className="user" id='saveItemForm'>
                    <ModalHeader toggle={this.props.toggleEditItemModal}>Edit Unit</ModalHeader>
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
                        <div className="form-group">
                            <select className="form-control "
                                    id="subject_guid" name="subject_guid"
                                    value={subject_guid}
                                    onChange={this.handleInputChange}>
                                {this.state.subjects.map((subject, index) => (
                                    <option value={subject.guid} key={subject.guid}>{subject.name}</option>
                                ))}
                            </select>
                            {this.validator.message('subject', subject_guid, 'required')}
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
                        <Button type="button" color="secondary" onClick={()=>{this.props.toggleEditItemModal(false);this.resetItemForm()}}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}
export default EditUnit;