import React, {Component} from 'react';
import {alertActions} from "../../actions";
import {Button} from 'reactstrap';
import ReactTable from 'react-table';
import alertify from 'alertifyjs';
import {userService} from "../../services/UserService";
import EditUser from './EditUser'
import CreateUser from "./CreateUser";

class ListAllUser extends Component {
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
                    Cell: (row) => (<span>{row.original.first_name} {row.original.last_name}</span>),
                    Footer: (row) => (<b>{this.state.totalItemCount} Results</b>),
                },
                {
                    Header: "Email",
                    accessor: "email",
                    Cell: (row) => (<a href={`mailto:${row.original.email}`}>{row.original.email}</a>),
                },
                {
                    Header: "Phone Number",
                    accessor: "phone_number",
                    Cell: (row) => (<a href={`tel:${row.original.phone_number}`}>{row.original.phone_number}</a>),
                },
                {
                    Header: "Role",
                    accessor: "role.display_name",
                    Filter: ({filter, onChange}) =>
                        <select
                            onChange={event => onChange(event.target.value)}
                            style={{width: "100%"}}
                            value={filter ? filter.value : "all"}
                        >
                            <option value="all">Show All</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="teacher">Teacher</option>
                            <option value="user">Student</option>
                        </select>
                },
                {
                    Header: "Status",
                    accessor: "status",
                    sortable: false,
                    Filter: ({filter, onChange}) =>
                        <select
                            onChange={event => onChange(event.target.value)}
                            style={{width: "100%"}}
                            value={filter ? filter.value : "all"}
                        >
                            <option value="all">Show All</option>
                            <option value="ACTIVE">Active</option>
                            <option value="DEACTIVE">Deactive</option>
                        </select>
                },
                {
                    Header: "Action",
                    className: "text-center",
                    width: 150,
                    filterable: null,
                    sortable: false,

                    Cell: (row) => (
                        <div>
                            {
                                (row.original.status === 'Active') ?
                                    <Button id={`deact-btn-${row.original.status}`} color="warning"
                                            onClick={() => this.toggleUserStatus(row.original.guid)}>
                                        <i className='fas fa-ban fa-sm'></i>
                                    </Button>
                                    :
                                    <Button id={`act-btn-${row.original.status}`} color="success"
                                            onClick={() => this.toggleUserStatus(row.original.guid)}>
                                        <i className='fas fa-check fa-sm'></i>
                                    </Button>
                            }
                            {' '}
                            <Button id={`edit-btn-${row.original.s_no}`} color="primary"
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
            rowData: []
        };
        //bind this to data table related functions
        this.changeSorting = this.changeSorting.bind(this);
        this.changeCurrentPage = this.changeCurrentPage.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.changeTableFilters = this.changeTableFilters.bind(this);

        //data related functions
        this.fetchAllItems = this.fetchAllItems.bind(this);

        this.confirmDeleteItem = this.confirmDeleteItem.bind(this);
        this.toggleEditItemModal = this.toggleEditItemModal.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.toggleUserStatus = this.toggleUserStatus.bind(this);

        this.toggleCreateItemModal = this.toggleCreateItemModal.bind(this);
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
        filters.map((value) => {
            if (value.id === 'role.display_name') {
                filterVal['role'] = value.value;
            } else {
                filterVal[value.id] = value.value;
            }
            return filterVal;
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
        userService.getAllItems(queryString)
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
        userService.deleteItem({guid: this.state.itemToRemove}).then(
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
        if (reloadItemList === true) {
            this.fetchAllItems();
        }
    }

    editItem(item) {
        console.log(item)
        this.setState(
            {
                itemToEdit: item,
                showEditItemModal: !this.state.showEditItemModal
            }
        );
    }
    toggleCreateItemModal(reloadItemList = false) {
        this.setState({showCreateItemModal: !this.state.showCreateItemModal});
        if(reloadItemList===true){
            this.fetchAllItems();
        }
    }
    toggleUserStatus(user){
        userService.toggleUserStatus(user).then(
            success => {
                alertActions.success(success.message);
                this.fetchAllItems();
            },
            error => {
                alertActions.error(error.message);
            }
        )
    }
    componentDidMount() {
        this.fetchAllItems();
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    {/* Page Heading  */}
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">Manage Users</h1>
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
                <CreateUser
                    toggleCreateItemModal={this.toggleCreateItemModal}
                    showCreateItemModal={this.state.showCreateItemModal}
                />
                <EditUser
                    toggleEditItemModal={this.toggleEditItemModal}
                    showEditItemModal={this.state.showEditItemModal}
                    itemToEdit={this.state.itemToEdit}
                />
            </div>
        )
    }
}

export default ListAllUser;