import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'
import SimpleReactValidator from 'simple-react-validator'
import {unitService} from "../../services/UnitService";
import {unitTopicService} from "../../services/UnitTopicService";
import {alertActions} from "../../actions";

class CreateUnitTopic extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            item: {
                name: '',
                description: '',
                subject_guid: '',
                unit_guid:'',
            },
            subjects: [{guid:"", name:"Select Subject"}],
            units: [{guid:"", name:"Select Unit"}],
        };
        // this.toggleCreateSubjectModal = this.toggleCreateSubjectModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.getUnitForSubject = this.getUnitForSubject.bind(this);
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });
    }

    handleInputChange = event => {
        const {name, value} = event.target;
        const {item} = this.state;
        if(name==='subject_guid'){
            this.getUnitForSubject(value);
        }
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
                name: '',
                description: '',
                subject_guid: '',
                unit_guid:'',
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
            unitTopicService.createItem(item).then(
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
    getUnitForSubject(subject_guid) {
        const queryString = `search={"subject_guid":"${subject_guid}"}`;
        unitService.getAllItems(queryString)
            .then(
                success => {
                    const listData = success;
                    this.setState({
                        units: [
                            {guid:"", name:"Select Unit"},
                            ...listData.data
                        ]
                    });
                },
                error => {
                    alertActions.error(error.message)
                }
            );
    }
    componentWillReceiveProps(nextProps){
        if(typeof nextProps.subjects!=="undefined") {
            this.setState({subjects:nextProps.subjects});
        }
    }
    render(){
        return(
            <Modal
                isOpen={this.props.showCreateItemModal}
                toggle={this.props.toggleCreateItemModal}
                className='modal-lg modal-dialog-centered'
            >
                <form className="user" id='saveItemForm'>
                    <ModalHeader toggle={this.props.toggleCreateItemModal}>Add Unit Topic</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <input type="text" className="form-control "
                                   id="name" name="name"
                                   placeholder="Topic Name" value={this.state.item.name}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('name', this.state.item.name, 'required')}
                        </div>
                        <div className="form-group">
                                <textarea type="text" className="form-control "
                                          id="description" name="description"
                                          placeholder="Enter description..."
                                          onChange={this.handleInputChange}
                                          value={this.state.item.description}  />
                        </div>
                        <div className="form-group">
                            <select className="form-control "
                                    id="subject_guid" name="subject_guid"
                                    value={this.state.item.subject_guid}
                                    onChange={this.handleInputChange}>
                                {this.state.subjects.map((subject, index) => (
                                    <option value={subject.guid} key={subject.guid}>{subject.name}</option>
                                ))}
                            </select>
                            {this.validator.message('subject', this.state.item.subject_guid, 'required')}
                        </div>
                        <div className="form-group">
                            <select className="form-control "
                                    id="unit_guid" name="unit_guid"
                                    value={this.state.item.unit_guid}
                                    onChange={this.handleInputChange}>
                                {this.state.units.map((unit, index) => (
                                    <option value={unit.guid} key={unit.guid}>{unit.name}</option>
                                ))}
                            </select>
                            {this.validator.message('unit', this.state.item.unit_guid, 'required')}
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
                        <Button color="secondary" onClick={()=>{this.props.toggleCreateItemModal(); this.resetItemForm()}}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}
export default CreateUnitTopic;