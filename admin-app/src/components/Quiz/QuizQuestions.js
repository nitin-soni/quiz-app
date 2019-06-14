import React, {Component} from 'react';
import {Modal, Button, ModalBody, ModalFooter, ModalHeader, Spinner} from 'reactstrap'
import {unitTopicService} from "../../services/UnitTopicService";
import {unitService} from "../../services/UnitService";
import {alertActions} from "../../actions";
import Select from 'react-select'
import {questionService} from "../../services";
import {quizService} from "../../services";
import SimpleReactValidator from "simple-react-validator";
import LaddaButton, {SLIDE_UP} from '@zumper/react-ladda'

class QuizQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUpdating: false,
            quizQuestions: [],
            quizQuestionsIds: [],
            question: {"subject_guid": "", "unit_guid": "", "unit_topic_guid": "", "topic_question": ""},
            subjects: [],
            units: [],
            unitTopic: [],
            topicQuestions: [],
            isUnitLoading: false,
            isTopicLoading: false,
            isQuestionLoading: false,
        };

        //create validator
        this.validator = new SimpleReactValidator({
            element: message => <div className='text-danger'>{message}</div>
        });

        this.addQuestion = this.addQuestion.bind(this);
        this.resetQuestion = this.resetQuestion.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.assignQuestions = this.assignQuestions.bind(this);
    }

    handleSelectChange = (value, name) => {
        const {question} = this.state;
        if (name === 'subject_guid') {
            this.getUnitForSubject(value.guid);
        }
        if (name === 'unit_guid') {
            this.getTopicsForUnit(value.guid);
        }
        if (name === 'unit_topic_guid') {
            this.getQuestionsForTopics(value.guid);
        }
        this.setState({
            question: {
                ...question,
                [name]: value
            }
        });
    }

    getUnitForSubject(subject_guid) {
        const queryString = `search={"subject_guid":"${subject_guid}"}`;
        this.setState({isUnitLoading: true});
        unitService.getAllItems(queryString)
            .then(
                success => {
                    const listData = success;
                    this.setState({
                        units: [
                            ...listData.data
                        ],
                        isUnitLoading: false
                    });
                },
                error => {
                    alertActions.error(error.message)
                    this.setState({isUnitLoading: false});
                }
            );
    }

    getTopicsForUnit(unit_guid) {
        const queryString = `search={"unit_guid":"${unit_guid}"}`;
        this.setState({isTopicLoading: true});
        unitTopicService.getAllItems(queryString)
            .then(
                success => {
                    const listData = success;
                    this.setState({
                        unitTopic: [
                            ...listData.data
                        ],
                        isTopicLoading: false
                    });
                },
                error => {
                    alertActions.error(error.message)
                    this.setState({isTopicLoading: false});
                }
            );
    }

    getQuestionsForTopics(unit_topic_guid) {
        const queryString = `search={"unit_topic_guid":"${unit_topic_guid}"}`;
        this.setState({isQuestionLoading: true});
        questionService.getAllItems(queryString)
            .then(
                success => {
                    const listData = success;
                    this.setState({
                        topicQuestions: [
                            ...listData.data
                        ],
                        isQuestionLoading: false
                    });
                },
                error => {
                    this.setState({isQuestionLoading: false});
                    alertActions.error(error.message)
                }
            );
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.subjects !== "undefined") {
            this.setState({subjects: nextProps.subjects});
            this.setState({
                subjects: nextProps.subjects
            });
        }
        if (nextProps.showQuestionModal) {
            this.getQuizQuestions(nextProps.quiz.guid);
        } else {
            this.setState({
                quizQuestions: [],
                quizQuestionsIds: [],
                units: [],
                unitTopic: [],
                topicQuestions: [],
            }, this.resetQuestion);
        }
    }

    getQuizQuestions(quiz_guid) {
        this.setState({isLoading: true});
        quizService.getQuizQuestions(quiz_guid).then(
            success => {
                const quizQuestionsIds = [];
                const quizQuestions = [];
                success.data.map(item => {
                    quizQuestionsIds.push(item.guid);
                    quizQuestions.push({"subject_guid": "", "unit_guid": "", "unit_topic_guid": "", "topic_question": item});
                })
                this.setState({
                    isLoading: false,
                    quizQuestions: quizQuestions,
                    quizQuestionsIds: quizQuestionsIds
                });
                alertActions.success(success.message);
            },
            error => {
                console.log(error);
                this.setState({isLoading: false});
            }
        );
    }

    addQuestion() {
        if (this.validator.allValid()) {
            const {question, quizQuestions, quizQuestionsIds} = this.state;
            if (this.props.quiz.total_question <= quizQuestions.length) {
                alertActions.error('This quiz can have maximum ' + this.props.quiz.total_question + ' questions.');
                return false;
            }
            if (quizQuestionsIds.includes(question.topic_question.guid)) {
                alertActions.error('This question has been already assigned to quiz.');
            } else {
                quizQuestions.push(question);
                quizQuestionsIds.push(question.topic_question.guid);
                this.setState({
                    quizQuestions: quizQuestions,
                    quizQuestionsIds: quizQuestionsIds
                }, this.resetQuestion);
            }

        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    removeQuestion(index) {
        const {quizQuestions, quizQuestionsIds} = this.state;
        let question = quizQuestions[index];
        quizQuestions.splice(index, 1);
        quizQuestionsIds.splice(index, 1);
        this.setState({
            quizQuestions: quizQuestions,
            quizQuestionsIds: quizQuestionsIds
        }, this.resetQuestion);
    }

    resetQuestion() {
        this.setState({
            question: {"subject_guid": "", "unit_guid": "", "unit_topic_guid": "", "topic_question": ""},
            units: [],
            unitTopic: [],
            topicQuestions: [],
        });
    }

    assignQuestions() {
        const {quizQuestionsIds} = this.state;
        if (quizQuestionsIds.length <= 0) {
            alertActions.error('Please add atleast one question to quiz.');
            return false;
        } else {
            const reqData = {
                quiz_guid: this.props.quiz.guid,
                questions: quizQuestionsIds
            }
            this.setState({isUpdating: true});
            quizService.assignQuestions(reqData).then(
                success => {
                    this.setState({isUpdating: false});
                    this.props.toggleQuestionModal();
                },
                error => {
                    this.setState({isUpdating: false});
                    alertActions.success(error.message);
                }
            );
        }

    }

    render() {
        const {quiz} = this.props;
        const {quizQuestions, subjects} = this.state;
        return (
            <Modal
                isOpen={this.props.showQuestionModal}
                toggle={this.props.toggleQuestionModal}
                className='modal-lg modal-full modal-dialog-centered'
            >
                <ModalHeader toggle={this.props.toggleQuestionModal}>
                    Manage Questions for <b>{quiz.name}</b>
                </ModalHeader>
                <ModalBody>
                    <form className="user" id='saveItemForm'>
                        <h6>Add Question</h6>
                        <hr/>
                        <div className="row">
                            <div className="col-2">
                                <div className="form-group">
                                    <Select
                                        options={subjects}
                                        onChange={(value) => this.handleSelectChange(value, 'subject_guid')}
                                        isSearchable={true}
                                        getOptionLabel={(option) => option['name']}
                                        getOptionValue={(option) => option['guid']}
                                        id="subject_guid"
                                        name="subject_guid"
                                        placeholder='Select Subject'
                                        value={this.state.question.subject_guid}
                                    />
                                    {this.validator.message('subject', this.state.question.subject_guid, 'required')}
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="form-group">
                                    <Select
                                        options={this.state.units}
                                        onChange={(value) => this.handleSelectChange(value, 'unit_guid')}
                                        isSearchable={true}
                                        getOptionLabel={(option) => option['name']}
                                        getOptionValue={(option) => option['guid']}
                                        id="unit_guid"
                                        name="unit_guid"
                                        placeholder='Select Unit'
                                        value={this.state.question.unit_guid}
                                        isLoading={this.state.isUnitLoading}
                                    />
                                    {this.validator.message('unit', this.state.question.unit_guid, 'required')}
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="form-group">
                                    <Select
                                        options={this.state.unitTopic}
                                        onChange={(value) => this.handleSelectChange(value, 'unit_topic_guid')}
                                        isSearchable={true}
                                        getOptionLabel={(option) => option['name']}
                                        getOptionValue={(option) => option['guid']}
                                        id="unit_topic_guid"
                                        name="unit_topic_guid"
                                        placeholder='Select Unit Topic'
                                        value={this.state.question.unit_topic_guid}
                                        isLoading={this.state.isTopicLoading}
                                    />
                                    {this.validator.message('unit_topic', this.state.question.unit_topic_guid, 'required')}
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="form-group">
                                    <Select
                                        options={this.state.topicQuestions}
                                        onChange={(value) => this.handleSelectChange(value, 'topic_question')}
                                        isSearchable={true}
                                        getOptionLabel={(option) => option['question']}
                                        getOptionValue={(option) => option['guid']}
                                        id="topic_question"
                                        name="topic_question"
                                        placeholder='Select Question'
                                        value={this.state.question.topic_question}
                                        isLoading={this.state.isQuestionLoading}
                                    />
                                    {this.validator.message('Question', this.state.question.topic_question, 'required')}
                                </div>
                            </div>
                            <div className="col-1">
                                <Button type="button" color="primary" onClick={this.addQuestion}>Add</Button>
                            </div>
                        </div>
                    </form>
                    <hr/>
                    <h6>Questions</h6>
                    <hr/>
                    <div className="row table-responsive">
                        {(this.state.isLoading) ?
                            <div className="col-12 text-center"><Spinner color="primary"/></div> : ''}
                        <div className="col-12">
                            <table className="table table-bordered ">
                                <tbody>
                                {
                                    quizQuestions.map((question, index) => {
                                        return (<tr key={`question-${index}`}>
                                            <td>
                                                {question.topic_question.question}
                                            </td>
                                            <td>
                                                <Button color='danger' onClick={(index) => {
                                                    this.removeQuestion(index)
                                                }}>
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </td>
                                        </tr>);
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <LaddaButton
                        loading={this.state.isUpdating}
                        onClick={this.assignQuestions}
                        color="blue"
                        size='S'
                        style={SLIDE_UP}
                        spinnerSize={30}
                        spinnerColor="#ddd"
                        spinnerLines={12}
                        className="btn btn-primary"
                    >Update
                    </LaddaButton>
                    <Button type="button" color="secondary" onClick={() => {
                        this.props.toggleQuestionModal(false);
                        this.resetQuestion()
                    }}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default QuizQuestions;