import React from 'react'
import SimpleReactValidator from "simple-react-validator";
import {alertActions} from "../../actions";
import {quizService} from "../../services/QuizService";
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import DatePicker from 'react-datepicker'
class EditQuiz extends React.Component{
    constructor(props) {
        super(props);
        console.log(this.props.itemToEdit)
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
            subjects: [{guid:"", name:"Select"}]
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.showEditItemModal) {
            this.setState({
                item: {
                    guid: nextProps.itemToEdit.guid,
                    name: nextProps.itemToEdit.name,
                    description: nextProps.itemToEdit.description,
                    level: nextProps.itemToEdit.level,
                    type: nextProps.itemToEdit.type,
                    total_question: nextProps.itemToEdit.total_question,
                    quiz_time: nextProps.itemToEdit.quiz_time,
                    start_date: nextProps.itemToEdit.start_date,
                    end_date: nextProps.itemToEdit.end_date,
                },
                subjects:nextProps.subjects
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
                start_date: null,
                end_date: null,
            },
        });
        this.validator.purgeFields();
    }
    updateItem = event => {
        event.preventDefault();
        event.stopPropagation();
        if (this.validator.allValid()) {
            const {item} = this.state;
            this.setState({isLoading: true});
            quizService.updateItem(item).then(
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
        const {name, description, level, type, total_question, quiz_time} = this.state.item;
        const start_date = new Date(this.state.item.start_date);
        const end_date = new Date(this.state.item.end_date);
        return(
            <Modal
                isOpen={this.props.showEditItemModal}
                toggle={this.props.toggleEditItemModal}
                className='modal-lg modal-dialog-centered'
                onClosed={(e) => {
                    this.resetItemForm()
                }}>
                <form className="user" id='saveItemForm'>
                    <ModalHeader toggle={this.props.toggleEditItemModal}>Edit Quiz</ModalHeader>
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
                            {this.validator.message('description', description, 'required')}
                        </div>
                        <div className="form-group">
                            <select
                                className="form-control "
                                id="level" name="level"
                                value={level}
                                onChange={this.handleInputChange}
                            >
                                <option value=''>Select Level</option>
                                <option value='easy'>Easy</option>
                                <option value='medium'>Medium</option>
                                <option value='hard'>Hard</option>
                            </select>
                            {this.validator.message('Quiz Level', level, 'required')}
                        </div>
                        <div className="form-group">
                            <select
                                className="form-control "
                                id="type" name="type"
                                value={type}
                                onChange={this.handleInputChange}
                            >
                                <option value=''>Select Quiz Type</option>
                                <option value='no_limit'>Without Limit</option>
                                <option value='time_based'>Time Based</option>
                                <option value='time_per_question'>Time per question</option>
                            </select>
                            {this.validator.message('Quiz type', type, 'required')}
                        </div>
                        {
                            (type==='time_based' || type==='time_per_question') ?
                                <div className="form-group">
                                    <input type="number" className="form-control "
                                           id="quiz_time" name="quiz_time"
                                           placeholder="Time in minutes" value={quiz_time}
                                           onChange={this.handleInputChange}/>
                                    {this.validator.message('name', quiz_time, 'required')}
                                </div>
                                : ''
                        }
                        <div className="form-group">
                            <input type="number" className="form-control "
                                   id="total_question" name="total_question"
                                   placeholder="Total Question" value={total_question}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('name', total_question, 'required')}
                        </div>
                        <div className="form-group">
                            <DatePicker
                                className="form-control"
                                selected={start_date}
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
                            {this.validator.message('quiz start date', start_date, 'required')}
                        </div>
                        <div className="form-group">
                            <DatePicker
                                className="form-control"
                                selected={end_date}
                                onChange={(date, event)=>this.handleDateChange(date, event,'end_date')}
                                placeholderText="Quiz End Date"
                                showMonthDropdown={false}
                                showYearDropdown={false}
                                dropdownMode="select"
                                dateFormat="d-MM-yyyy"
                                isClearable={false}
                                name="end_date"
                                minDate={new Date(start_date)}
                            />
                            {this.validator.message('quiz end date', end_date, 'required')}
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
export default EditQuiz;