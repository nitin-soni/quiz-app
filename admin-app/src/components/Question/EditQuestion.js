import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert} from 'reactstrap';
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'
import SimpleReactValidator from 'simple-react-validator'
import {questionService} from "../../services";
import {alertActions} from "../../actions";
import {unitService} from "../../services/UnitService";
import {unitTopicService} from "../../services/UnitTopicService";

class EditQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            item: {
                question: '',
                description: '',
                level: '',
                type: 'single_choice',
                subject_guid: '',
                unit_guid: '',
                unit_topic_guid: '',
            },
            answers: [
                {answer: '', is_correct: '1'}
            ],
            noAnswers: false,
            subjects: [{guid: "", name: "Select Subject"}],
            units: [{guid: "", name: "Select Unit"}],
            unitTopic: [{guid: "", name: "Select Unit Topic"}],
        };
        // this.toggleCreateSubjectModal = this.toggleCreateSubjectModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });
        this.getUnitForSubject = this.getUnitForSubject.bind(this);
        this.addNewAnswer = this.addNewAnswer.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.itemToEdit.guid) {
            console.log(nextProps.itemToEdit);
            this.setState({
                item: {
                    guid: nextProps.itemToEdit.guid,
                    question: nextProps.itemToEdit.question,
                    description: nextProps.itemToEdit.description,
                    level: nextProps.itemToEdit.level,
                    type: nextProps.itemToEdit.type,
                    subject_guid: nextProps.itemToEdit.subject_guid,
                    unit_guid: nextProps.itemToEdit.unit_guid,
                    unit_topic_guid: nextProps.itemToEdit.unit_topic_guid,
                },
                answers: nextProps.itemToEdit.answers,
                subjects: nextProps.subjects
            }, () => {
                this.getUnitForSubject(nextProps.itemToEdit.subject_guid);
                this.getTopicsForUnit(nextProps.itemToEdit.unit_guid)
            });
        }
    }

    handleInputChange = event => {
        const {name, value} = event.target;
        const {item} = this.state;
        if (name === 'subject_guid') {
            this.getUnitForSubject(value);
        }
        if (name === 'unit_guid') {
            this.getTopicsForUnit(value);
        }
        this.setState({
            item: {
                ...item,
                [name]: value
            }
        });
    }
    handleAnswerChange = (event) => {
        let {name, value} = event.target;
        const dataIndex = event.target.getAttribute('data-index');
        let {answers} = this.state;
        if (this.state.item.type === 'single_choice') {
            const tempAnswers = answers.map((answer, index) => {
                answer.is_correct = '0';
                return answer;
            })
            answers = tempAnswers;
        }
        if (name === 'is_correct') {
            value = event.target.checked ? '1' : '0';
        }
        answers[dataIndex][name] = value;
        this.setState({
            answers: answers
        });
        console.log(answers)
    }
    resetItemForm = () => {
        this.setState({
            item: {
                question: '',
                description: '',
                level: '',
                type: '',
                subject_guid: '',
                unit_guid: '',
                unit_topic_guid: '',
            },
            answers: [
                {answer: '', is_correct: '0'}
            ],
            units: [{guid: "", name: "Select Unit"}],
            unitTopic: [{guid: "", name: "Select Unit Topic"}],
        });
        this.validator.purgeFields();
    }
    updateItem = event => {
        event.preventDefault();
        event.stopPropagation();
        const {item, answers} = this.state;
        if (this.validator.allValid()) {
            if (answers.length < 1) {
                this.setState({noAnswers: true});
                return false;
            }
            item.answers = answers;
            this.setState({isLoading: true});
            questionService.updateItem(item).then(
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
            if (answers.length < 1) {
                this.setState({noAnswers: true});
            }
            this.validator.showMessages();
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
                            {guid: "", name: "Select Unit"},
                            ...listData.data
                        ]
                    });
                },
                error => {
                    alertActions.error(error.message)
                }
            );
    }

    getTopicsForUnit(unit_guid) {
        const queryString = `search={"unit_guid":"${unit_guid}"}`;
        unitTopicService.getAllItems(queryString)
            .then(
                success => {
                    const listData = success;
                    this.setState({
                        unitTopic: [
                            {guid: "", name: "Select Unit Topic"},
                            ...listData.data
                        ]
                    });
                },
                error => {
                    alertActions.error(error.message)
                }
            );
    }

    addNewAnswer() {
        const {answers} = this.state;
        const is_correct = answers.length > 0 ? '0' : '1';
        answers.push({answer: '', is_correct: is_correct})
        this.setState({
            answers: answers
        });
    }

    removeAnswer(index) {
        const {answers} = this.state;
        answers.splice(index, 1);
        this.setState({
            answers: answers
        });
    }

    render() {
        const {question, description, level, type, subject_guid, unit_guid, unit_topic_guid} = this.state.item;
        const {answers} = this.state;
        return (
            <Modal
                isOpen={this.props.showEditItemModal}
                toggle={this.props.toggleEditItemModal}
                className='modal-lg modal-dialog-centered'
                onClosed={(e) => {
                    this.resetItemForm()
                }}>
                <form className="user" id='saveItemForm'>
                    <ModalHeader toggle={this.props.toggleEditItemModal}>Edit Answer</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <input type="text" className="form-control "
                                   id="question" name="question"
                                   placeholder="Question" value={question}
                                   onChange={this.handleInputChange}/>
                            {this.validator.message('name', question, 'required')}
                        </div>
                        <div className="form-group">
                                <textarea type="text" className="form-control "
                                          id="description" name="description"
                                          placeholder="Enter description..."
                                          onChange={this.handleInputChange}
                                          value={description}></textarea>
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
                                <option value='single_choice'>Single Choice</option>
                                <option value='multiple_choice'>Multiple Choice</option>
                            </select>
                            {this.validator.message('Question type', type, 'required')}
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
                        <div className="form-group">
                            <select className="form-control "
                                    id="unit_guid" name="unit_guid"
                                    value={unit_guid}
                                    onChange={this.handleInputChange}>
                                {this.state.units.map((unit, index) => (
                                    <option value={unit.guid} key={unit.guid}>{unit.name}</option>
                                ))}
                            </select>
                            {this.validator.message('unit', unit_guid, 'required')}
                        </div>
                        <div className="form-group">
                            <select className="form-control "
                                    id="unit_topic_guid" name="unit_topic_guid"
                                    value={unit_topic_guid}
                                    onChange={this.handleInputChange}>
                                {this.state.unitTopic.map((unit, index) => (
                                    <option value={unit.guid} key={unit.guid}>{unit.name}</option>
                                ))}
                            </select>
                            {this.validator.message('unit topic', unit_topic_guid, 'required')}
                        </div>

                        <hr/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h5 className="mb-0 text-gray-800">Answers</h5>
                                <button type="button"
                                        className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                                        onClick={this.addNewAnswer}>
                                    <i className="fas fa-plus fa-sm text-white-50"></i> Add
                                </button>
                            </div>
                            {(this.state.noAnswers === true) ? (
                                <Alert color="danger">
                                    Answer for question is required.
                                </Alert>
                            ) : ''}
                            <table className="table ">
                                <thead>
                                <tr>
                                    <th>Answer</th>
                                    <th>Correct</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    answers.map((answer, index) => {
                                        return <tr key={index}>
                                            <td>
                                                <input type="text" className="form-control"
                                                       id={`answer-${index}`}
                                                       name="answer"
                                                       placeholder="Answer"
                                                       value={answer.answer}
                                                       data-index={index}
                                                       onChange={(event) => this.handleAnswerChange(event)}/>
                                                {this.validator.message('answer', answer.answer, 'required')}
                                            </td>
                                            <td>
                                                {
                                                    (this.state.item.type === 'multiple_choice') ?
                                                        <input type="checkbox" data-index={index}
                                                               id={`correct-${index}`} name='is_correct'
                                                               placeholder="Question"
                                                               defaultChecked={answer.is_correct == '1'}
                                                               onChange={(event) => this.handleAnswerChange(event)}/>
                                                        :
                                                        <input type="radio" data-index={index}
                                                               id={`correct-${index}`} name="is_correct"
                                                               placeholder="Question"
                                                               defaultChecked={answer.is_correct == '1'}
                                                               onChange={(event) => this.handleAnswerChange(event)}/>
                                                }
                                                {this.validator.message('is_correct', answer.is_correct, 'required')}
                                            </td>
                                            <td>
                                                <Button color="danger" type="button"
                                                        onClick={() => this.removeAnswer(index)}>
                                                    <i className='fas fa-trash'></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            </table>
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
                        <Button type="button" color="secondary" onClick={() => {
                            this.props.toggleEditItemModal(false);
                            this.resetItemForm()
                        }}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}

export default EditQuestion;