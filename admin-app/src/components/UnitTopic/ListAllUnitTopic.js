import React from 'react'
import {alertActions} from "../../actions";
import alertify from "alertifyjs";
import {Button} from 'reactstrap';
import ReactTable from 'react-table';
import CreateUnitTopic from './CreateUnitTopic'
import EditUnitTopic from './EditUnitTopic'
import {subjectService} from "../../services/SubjectService";
import {unitTopicService} from "../../services/UnitTopicService";

class ListAllUnitTopic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateItemModal: false,
            showEditItemModal: false,
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
                    Footer: (row) => (<div>Total</div>)
                },
                {
                    Header: "Name",
                    accessor: "name",
                    Footer: (row) => (<b>{this.state.totalItemCount} Results</b>),
                },
                {
                    Header: "Subject Name",
                    accessor: "subject_name",
                    sortable: false,
                    filterable: false,
                },
                {
                    Header: "Unit Name",
                    accessor: "unit_name",
                    sortable: false,
                    filterable: false,
                },
                {
                    Header: "Action",
                    className: "text-center",
                    width: 150,
                    filterable: false,
                    sortable: false,

                    Cell: (row) => (
                        <div>
                            <Button id={`edit-btn-${row.original.s_no}`} color="warning"
                                    onClick={() => this.editItem(row.original)}>
                                <i className='fas fa-pencil-alt fa-sm'></i>
                            </Button>{' '}
                            <Button id={`delete-btn-${row.original.s_no}`} color="danger"
                                    onClick={() => this.confirmDeleteItem(row.original.guid)}>
                                <i className='fas fa-trash fa-sm'></i>
                            </Button>{' '}
                        </div>
                    )
                }
            ],
            rowData: [],
            subjects: [{guid: "", name: "Select Subject"}]
        };

        this.toggleCreateItemModal = this.toggleCreateItemModal.bind(this);
        this.toggleEditItemModal = this.toggleEditItemModal.bind(this);
        this.fetchAllItems = this.fetchAllItems.bind(this);
        this.editItem = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.confirmDeleteItem = this.confirmDeleteItem.bind(this);

        this.changeSorting = this.changeSorting.bind(this);
        this.changeCurrentPage = this.changeCurrentPage.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.changeTableFilters = this.changeTableFilters.bind(this);
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
        filters.map((value) => (filterVal[value.id] = value.value));
        this.setState({
            tableFilter: filterVal,
        }, this.fetchAllItems);
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

    toggleEditItemModal(reloadItemList = false) {
        console.log(reloadItemList)
        const showModel = !this.state.showEditItemModal;
        this.setState({showEditItemModal: showModel});
        if (reloadItemList === true) {
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

    deleteItem() {
        this.setState({isLoading: true});
        unitTopicService.deleteItem({guid: this.state.itemToRemove}).then(
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

    confirmDeleteItem(itemGuid) {
        this.setState({itemToRemove: itemGuid});
        alertify.confirm('Delete item ', "Are you sure, you want to delete this ?",
            this.deleteItem,
            function () {
            }
        );
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
        unitTopicService.getAllItems(queryString)
            .then(
                success => {
                    const listData = success;
                    this.setState({
                        itemsList: (listData && listData.data) ? listData.data : [],
                        isLoading: false,
                        totalItemCount: (listData && listData.total) ? listData.total : 0,
                        totalPageCount: (listData && listData.total_pages) ? listData.total_pages : 0,
                    });
                },
                error => {
                    this.setState({isLoading: false});
                    alertActions.error(error.message)
                }
            );
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

    render() {
        return (
            <div>
                <div className="container-fluid">
                    {/* Page Heading  */}
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">Manage Units Topics</h1>
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

                <CreateUnitTopic
                    toggleCreateItemModal={this.toggleCreateItemModal}
                    showCreateItemModal={this.state.showCreateItemModal}
                    subjects={this.state.subjects}
                />
                <EditUnitTopic
                    toggleEditItemModal={this.toggleEditItemModal}
                    showEditItemModal={this.state.showEditItemModal}
                    itemToEdit={this.state.itemToEdit}
                    subjects={this.state.subjects}
                />
            </div>
        )
    }
}

export default ListAllUnitTopic;