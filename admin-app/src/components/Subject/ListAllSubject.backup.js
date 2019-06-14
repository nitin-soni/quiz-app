import React, {Component} from 'react';
import CreateSubject from "./CreateSubject";
import {subjectService} from "../../services/SubjectService";
import {alertActions} from "../../actions";
import {Button, Tooltip} from 'reactstrap';
import ReactTable from 'react-table';
import alertify from 'alertifyjs';

class ListAllSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateSubjectModal: false,
            isLoading: false,
            itemToRemove: null,
            itemToEdit: null,
            itemsList: [],
            tableSorting: [{columnName: 'name', direction: 'asc'}],
            tableFilter: [],
            totalItemCount: 0,
            totalPageCount: -1,
            pageSize: 5,
            pageSizeOptions: [5, 10, 20, 30, 40, 50],
            currentPage: 0,
            selected: {},
            selectAll:0,
            tableColumns: [
                {
                    id: "checkbox",
                    accessor: "",
                    className:"text-center",
                    Cell: ({ original }) => {
                        return (
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={this.state.selected[original.guid] === true}
                                onChange={() => this.toggleRow(original.guid)}
                            />
                        );
                    },
                    Header: x => {
                        return (
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={this.state.selectAll === 1}
                                ref={input => {
                                    if (input) {
                                        input.indeterminate = this.state.selectAll === 2;
                                    }
                                }}
                                onChange={() => this.toggleSelectAll()}
                            />
                        );
                    },
                    sortable: false,
                    filterable: false,
                    width: 45
                },
                {accessor: "s_no",width: 60, Header: "S. No", filterable: false, sortable: false},
                {Header: "Name", accessor: "name"},
                {
                    Header: "Action",
                    className:"text-center",
                    width:150,
                    filterable: null,
                    sortable: false,
                    Cell: (row) => (
                        <div>
                            <Button id="edit-btn-{row.original.s_no}" color="warning" onClick={() => this.editItem(row.original)}>
                                <i className='fas fa-pencil-alt fa-sm'></i>
                            </Button>{' '}
                            <Button id="delete-btn-{row.original.s_no}" color="danger" onClick={() => this.confirmDeleteItem(row.original.guid)}>
                                <i className='fas fa-trash fa-sm'></i>
                            </Button>{' '}
                        </div>
                    )
                }
            ],
            rowData: []
        };
        this.toggleCreateSubjectModal = this.toggleCreateSubjectModal.bind(this);
        this.fetchAllItems = this.fetchAllItems.bind(this);
        this.editItem = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.confirmDeleteItem = this.confirmDeleteItem.bind(this);

        this.changeSorting = this.changeSorting.bind(this);
        this.changeCurrentPage = this.changeCurrentPage.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.changeTableFilters = this.changeTableFilters.bind(this);
        this.toggleRow = this.toggleRow.bind(this);
    }
    toggleRow(guid) {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[guid] = !this.state.selected[guid];
        this.setState({
            selected: newSelected,
            selectAll: 2
        });
    }
    toggleSelectAll() {
        let newSelected = {};

        if (this.state.selectAll === 0) {
            this.state.itemsList.forEach(x => {
                newSelected[x.guid] = true;
            });
        }

        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
    }
    changeSorting(tableSorting) {
        let sortVal = [];
        tableSorting.map((value) => {
            sortVal.push({
                columnName: value.id,
                direction: ((value.desc === true) ? 'desc' : 'asc')
            })
        });
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
        filters.map((value) => {
            console.log(value)
            // filterVal.push({'name':value.id, 'value':value.value})
            filterVal[value.id] = value.value;
        });
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

    toggleCreateSubjectModal() {
        this.setState({showCreateSubjectModal: !this.state.showCreateSubjectModal});
        console.log(this.state.showCreateSubjectModal)
    }

    editItem(item) {
        console.log(item);
    }

    deleteItem() {
        this.setState({isLoading: true});
        subjectService.deleteItem({guid: this.state.itemToRemove}).then(
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
            function () {}
        );
    }

    queryString() {
        const {tableSorting, pageSize, tableFilter} = this.state;
        let {currentPage} = this.state;
        currentPage = currentPage + 1;
        console.log(pageSize);
        let queryString = `per_page=${pageSize}&page=${currentPage}`;
        const columnSorting = tableSorting[0];
        if (columnSorting) {
            const sortingDirectionString = columnSorting.direction === 'desc' ? ' desc' : 'asc';
            queryString = `${queryString}&sort_by=${columnSorting.columnName}&sort_order=${sortingDirectionString}`;
        }
        if (tableFilter) {
            // let param = Object.keys(tableFilter).map(key => key + '=' + tableFilter[key]).join('&')
            queryString += '&search=' + JSON.stringify(tableFilter);
        }
        console.log(queryString)
        return queryString;
    }



    fetchAllItems() {
        this.setState({isLoading: true});
        const queryString = this.queryString();
        subjectService.getAllItems(queryString)
            .then(
                success => {
                    const listData = success.data;
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

    componentDidMount() {
        this.fetchAllItems();
    }

    render() {
        const {isLoading} = this.state;
        return (
            <div>
                <div className="container-fluid">
                    {/* Page Heading  */}
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">Manage Subject</h1>
                        <button type="button" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                                onClick={this.toggleCreateSubjectModal}>
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
                <CreateSubject toggleCreateSubjectModal={this.toggleCreateSubjectModal}
                               showCreateSubjectModal={this.state.showCreateSubjectModal}/>
            </div>
        )
    }
}

export default ListAllSubject;