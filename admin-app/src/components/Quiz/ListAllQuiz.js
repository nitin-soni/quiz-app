import React from 'react';
import CreateQuiz from './CreateQuiz';
import EditQuiz from './EditQuiz';
import {alertActions} from "../../actions";
import {Button} from 'reactstrap';
import ReactTable from 'react-table';
import alertify from 'alertifyjs';
import {quizService} from "../../services/QuizService";
import QuizQuestions from "./QuizQuestions";
import {subjectService} from "../../services/SubjectService";
class ListAllQuiz extends React.Component{
    constructor(props){
        super(props);
        const quizLevel = {
            '' : 'Show All',
            'easy' : 'Easy',
            'medium' : 'Medium',
            'hard' : 'Hard'
        };
        const quizType = {
            '' : 'Show All',
            'no_limit' : 'Without Limit',
            'time_based' : 'Time Based',
            'time_per_question' : 'Time per question'
        };
        this.state = {
            quiz:{},
            showCreateItemModal: false,
            showEditItemModal: false,
            showQuestionModal: false,
            isLoading: false,
            itemToRemove: null,
            itemToEdit: {},
            itemsList: [],
            tableSorting: [{columnName: 'name', direction: 'asc'}],
            tableFilter: [],
            totalItemCount: 0,
            totalPageCount: -1,
            pageSize: 5,
            pageSizeOptions: [5, 10, 20, 30, 40, 50],
            currentPage: 0,
            tableColumns: [
                {
                    accessor: "s_no",
                    width: 60,
                    Header: "S. No",
                    filterable: false,
                    sortable: false,
                    className: "text-center",
                    Footer :(row) => (<div>Total</div>)
                },
                {
                    Header: "Name",
                    accessor: "name",
                    Footer :(row) => (<b>{this.state.totalItemCount} Results</b>),
                },
                {
                    Header: "Level",
                    accessor: "level",
                    sortable: false,
                    Cell: (row) => (<span>{quizLevel[row.original.level]}</span>),
                    Filter: ({filter, onChange}) =>
                        <select
                            onChange={event => onChange(event.target.value)}
                            style={{width: "100%"}}
                            value={filter ? filter.value : "all"}
                        >
                            {Object.keys(quizLevel).map(function(key, index) {
                                return <option key={index} value={key}>{quizLevel[key]}</option>;
                            })}
                        </select>
                },
                {
                    Header: "Type",
                    accessor: "type",
                    sortable: false,
                    Cell: (row) => (<span>{quizType[row.original.type]}</span>),
                    Filter: ({filter, onChange}) =>
                        <select
                            onChange={event => onChange(event.target.value)}
                            style={{width: "100%"}}
                            value={filter ? filter.value : "all"}
                        >
                            {Object.keys(quizType).map(function(key, index) {
                                return <option key={index} value={key}>{quizType[key]}</option>;
                            })}
                        </select>
                },
                {
                    Header: "Total Question",
                    accessor: "total_question",
                    filterable: false,
                    width: 100,
                    className: 'text-center'
                },
                {
                    Header: "Action",
                    className: "text-center",

                    filterable: null,
                    sortable: false,

                    Cell: (row) => (
                        <div>
                            <Button id={`edit-btn-${row.original.s_no}`} color="primary"
                                    onClick={() => this.manageQuestion(row.original)}>
                                 Questions
                            </Button>
                            {' '}
                            <Button id={`edit-btn-${row.original.s_no}`} color="warning"
                                    onClick={() => this.editItem(row.original)}>
                                <i className='fas fa-pencil-alt fa-sm'></i>
                            </Button>
                            {' '}
                            <Button id={`delete-btn-${row.original.s_no}`} color="danger"
                                    onClick={() => this.confirmDeleteItem(row.original.guid)}>
                                <i className='fas fa-trash fa-sm'></i>
                            </Button>
                            {' '}
                        </div>
                    )
                }
            ],
            rowData: [],
            subjects: [{guid: "", name: "Select Subject"}]
        };
        //bind this to data table related functions
        this.changeSorting = this.changeSorting.bind(this);
        this.changeCurrentPage = this.changeCurrentPage.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.changeTableFilters = this.changeTableFilters.bind(this);

        this.toggleCreateItemModal = this.toggleCreateItemModal.bind(this);
        this.confirmDeleteItem = this.confirmDeleteItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

        this.toggleEditItemModal = this.toggleEditItemModal.bind(this);
        this.editItem = this.editItem.bind(this);

        this.manageQuestion = this.manageQuestion.bind(this);
        this.toggleQuestionModal = this.toggleQuestionModal.bind(this);
    }

    changeSorting(tableSorting) {
        let sortVal = [];
        tableSorting.map((value) =>
            sortVal.push({
                columnName: value.id,
                direction: ((value.desc === true) ? 'desc' : 'asc')
            })
        );
        this.setState({
            tableSorting: sortVal
        });
        this.fetchAllItems();
    }

    changeCurrentPage(currentPage) {
        this.setState({
            currentPage,
        }, this.fetchAllItems);
    }

    changeTableFilters(filters) {
        let filterVal = {};
        filters.map((value) => filterVal[value.id] = value.value);
        this.setState({tableFilter: filterVal}, this.fetchAllItems);
    }

    changePageSize(pageSize) {
        this.setState({
            pageSize: pageSize,
            currentPage: 0
        }, this.fetchAllItems);
    }

    toggleCreateItemModal(reloadItemList = false) {
        this.setState({showCreateItemModal: !this.state.showCreateItemModal});
        if (reloadItemList === true) {
            this.fetchAllItems();
        }
    }

    toggleQuestionModal() {
        this.setState({showQuestionModal: !this.state.showQuestionModal});
    }

    queryString() {
        const {tableSorting, pageSize, tableFilter} = this.state;
        let {currentPage} = this.state;
        currentPage = currentPage + 1;
        let queryString = `per_page=${pageSize}&page=${currentPage}`;
        const columnSorting = tableSorting[0];
        if (columnSorting) {
            const sortingDirectionString = columnSorting.direction === 'desc' ? 'desc' : 'asc';
            queryString = `${queryString}&sort_by=${columnSorting.columnName}&sort_order=${sortingDirectionString}`;
        }
        if (tableFilter) {
            // let param = Object.keys(tableFilter).map(key => key + '=' + tableFilter[key]).join('&')
            queryString += '&search=' + JSON.stringify(tableFilter);
        }
        return queryString;
    }


    fetchAllItems() {
        this.setState({isLoading: true});
        const queryString = this.queryString();
        quizService.getAllItems(queryString)
            .then(
                success => {
                    const listData = success;
                    this.setState({
                        itemsList: listData.data,
                        isLoading: false,
                        totalItemCount: listData.total,
                        totalPageCount: listData.total_pages,
                    });
                },
                error => {
                    this.setState({isLoading: false});
                    alertActions.error(error.message)
                }
            );
    }

    confirmDeleteItem(itemGuid) {
        this.setState({itemToRemove: itemGuid});
        alertify.confirm('Delete item ', "Are you sure, you want to delete this ?",
            this.deleteItem,
            function () {
            }
        );
    }

    deleteItem() {
        this.setState({isLoading: true});
        quizService.deleteItem({guid: this.state.itemToRemove}).then(
            success => {
                alertActions.success(success.message);
                this.setState({isLoading: false, itemToRemove: null});
                this.fetchAllItems();
            },
            error => {
                console.log(error)
                this.setState({isLoading: false});
            }
        );
    }
    toggleEditItemModal(reloadItemList = false) {
        const showModel = !this.state.showEditItemModal;
        this.setState({showEditItemModal: showModel});
        if(reloadItemList===true){
            this.fetchAllItems();
        }
    }

    editItem(item) {
        this.setState(
            {
                itemToEdit: item,
                showEditItemModal: !this.state.showEditItemModal
            }
        );
    }
    manageQuestion(quiz){
        this.setState({quiz: quiz},this.toggleQuestionModal);
    }
    getAllSubjects() {
        subjectService.getAllItems('')
            .then(
                success => {
                    const listData = success;
                    const {subjects} = this.state;
                    this.setState({
                        subjects: [
                            ...subjects,
                            ...listData.data
                        ]
                    });
                },
                error => {
                    alertActions.error(error.message)
                }
            );
    }
    componentDidMount() {
        this.fetchAllItems();
        this.getAllSubjects();
    }
    render(){
        return(
            <div>
                <div className="container-fluid">
                    {/* Page Heading  */}
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">Manage Quiz</h1>
                        <button type="button" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                                onClick={this.toggleCreateItemModal}>
                            <i className="fas fa-plus fa-sm text-white-50"></i> Create New
                        </button>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <ReactTable
                                data={this.state.itemsList}
                                columns={this.state.tableColumns}
                                loading={this.state.isLoading}
                                defaultPageSize={this.state.pageSize}
                                pageSizeOptions={this.state.pageSizeOptions}
                                sortable={true}
                                multiSort={true}
                                resizable={true}
                                filterable={true}
                                onSortedChange={this.changeSorting}
                                onPageSizeChange={this.changePageSize}
                                onPageChange={this.changeCurrentPage}
                                onFilteredChange={this.changeTableFilters}
                                manual={true}
                                minRows="0"
                                pages={this.state.totalPageCount}
                                // PaginationComponent={Pagination}
                            />
                        </div>
                    </div>
                </div>
                <CreateQuiz toggleCreateItemModal={this.toggleCreateItemModal}
                               showCreateItemModal={this.state.showCreateItemModal}/>
                <EditQuiz
                    toggleEditItemModal={this.toggleEditItemModal}
                    showEditItemModal={this.state.showEditItemModal}
                    itemToEdit={this.state.itemToEdit}
                />
                <QuizQuestions
                    toggleQuestionModal={this.toggleQuestionModal}
                    showQuestionModal={this.state.showQuestionModal}
                    quiz={this.state.quiz}
                    subjects={this.state.subjects}
                />
            </div>
        )
    }
}
export default ListAllQuiz;