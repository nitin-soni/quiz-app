import React, {Component} from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'
import SimpleReactValidator from 'simple-react-validator'
import {quizService} from "../../services/QuizService";
import {alertActions} from "../../actions";
import DatePicker from 'react-datepicker'

class CreateQuiz extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            item: {
                name: '',
                description: '',
                level: '',
                type: '',
                total_question: '',
                quiz_time: '',
                start_date: '',
                end_date: '',
            },
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
        const {item} = this.state;
        this.setState({
            item: {
                ...item,
                [name]: value
            }
        });
    }
    handleDateChange = (date, event, name) => {
        const {item} = this.state;
        console.log(name, date)
        this.setState({
            item: {
                ...item,
                [name]: date
            }
        });
    }

    resetItemForm = () => {
        this.setState({
            item: {
                name: '',
                description: '',
                level: '',
                type: '',
                total_question: '',
                quiz_time: '',
                start_date: '',
                end_date: '',
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
            quizService.createItem(item).then(
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

    render(){
        return(
            <Modal isOpen={this.props.showCreateItemModal} toggle={this.props.toggleCreateItemModal}
                   className='modal-lg modal-dialog-centered'>
                <form className="user" id='saveItemForm'>
                    <ModalHeader toggle={this.props.toggleCreateItemModal}>Create Quiz</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <input type="text" className="form-control "
                                   id="name" name="name"
                                   placeholder="Quiz Name" value={this.state.item.name}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('name', this.state.item.name, 'required')}
                        </div>
                        <div className="form-group">
                                <textarea type="text" className="form-control "
                                          id="description" name="description"
                                          placeholder="Enter description..."
                                          onChange={this.handleInputChange}
                                          value={this.state.item.description}></textarea>
                            {this.validator.message('description', this.state.item.description, 'required')}
                        </div>
                        <div className="form-group">
                            <select
                                className="form-control "
                                id="level" name="level"
                                value={this.state.item.level}
                                onChange={this.handleInputChange}
                            >
                                <option value=''>Select Level</option>
                                <option value='easy'>Easy</option>
                                <option value='medium'>Medium</option>
                                <option value='hard'>Hard</option>
                            </select>
                            {this.validator.message('Quiz Level', this.state.item.level, 'required')}
                        </div>
                        <div className="form-group">
                            <select
                                className="form-control "
                                id="type" name="type"
                                value={this.state.item.type}
                                onChange={this.handleInputChange}
                            >
                                <option value=''>Select Quiz Type</option>
                                <option value='no_limit'>Without Limit</option>
                                <option value='time_based'>Time Based</option>
                                <option value='time_per_question'>Time per question</option>
                            </select>
                            {this.validator.message('Quiz type', this.state.item.type, 'required')}
                        </div>
                        {
                            (this.state.item.type==='time_based' || this.state.item.type==='time_per_question') ?
                                <div className="form-group">
                                    <input type="number" className="form-control "
                                           id="quiz_time" name="quiz_time"
                                           placeholder="Time in minutes" value={this.state.item.quiz_time}
                                           onChange={this.handleInputChange}/>
                                    {this.validator.message('name', this.state.item.quiz_time, 'required')}
                                </div>
                                : ''
                        }
                        <div className="form-group">
                            <input type="number" className="form-control "
                                   id="total_question" name="total_question"
                                   placeholder="Total Question" value={this.state.item.total_question}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('name', this.state.item.total_question, 'required')}
                        </div>
                        <div className="form-group">
                            <DatePicker
                                className="form-control"
                                selected={this.state.item.start_date}
                                onChange={(date, event)=>this.handleDateChange(date, event,'start_date')}
                                placeholderText="Quiz Start Date"
                                showMonthDropdown={false}
                                showYearDropdown={false}
                                dropdownMode="select"
                                dateFormat="d-MM-yyyy"
                                isClearable={false}
                                name="start_date"
                                minDate={new Date()}
                            />
                            {this.validator.message('quiz start date', this.state.item.start_date, 'required')}
                        </div>
                        <div className="form-group">
                            <DatePicker
                                className="form-control"
                                selected={this.state.item.end_date}
                                onChange={(date, event)=>this.handleDateChange(date, event,'end_date')}
                                placeholderText="Quiz End Date"
                                showMonthDropdown={false}
                                showYearDropdown={false}
                                dropdownMode="select"
                                dateFormat="d-MM-yyyy"
                                isClearable={false}
                                name="end_date"
                                minDate={this.state.item.start_date}
                            />
                            {this.validator.message('quiz end date', this.state.item.end_date, 'required')}
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
                        <Button color="secondary" onClick={()=>{this.props.toggleCreateItemModal();this.resetItemForm()}}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}
export default CreateQuiz;