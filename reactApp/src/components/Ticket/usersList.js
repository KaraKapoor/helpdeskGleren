import React, { Component } from "react";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import MaterialTable from "material-table";
import TicketDataService from "../../services/ticket.service";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Moment from 'moment';
import * as url from "../../http-common";
class UsersList extends Component {
    tableRef = React.createRef();
    constructor(props) {
        super(props);
        this.clickAdd = this.clickAdd.bind(this);
        this.savePageLocation = this.savePageLocation.bind(this);
        this.state = {
            locale: { 'format': 'DD/MM/YYYY' },
        };
        this.columns = [
            { title: "Full Name", field: "fullName", render: rowData =><span><i class="fa fa-users" aria-hidden="true"></i>
            &nbsp;&nbsp;<Link onClick={this.savePageLocation("/usersList")} to={`/users/id:${rowData.id}`}>{rowData.fullName}</Link> 
            </span> },
            { title: "Email Id", field: "email" },
            { title: "Mobile No.", field: "mobile" },
            { title: "Designation", field: "designation" },
            { title: "Role", field: "helpdeskRole" }
        ];
    }

    componentDidMount() {


    }
    showErrorToast = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
            className: "error-toast"
        });
    };
    showSuccessToast = (msg) => {
        toast.success(msg, {
            position: toast.POSITION.TOP_CENTER,
            className: "success-toast"
        });
    };
    showWarningToast = (msg) => {
        toast.warning(msg, {
            position: toast.POSITION.TOP_CENTER,
            className: "warning-toast"
        });
    };

    savePageLocation(path) {
        sessionStorage.setItem("previousPageLocation", path);
    }

    onTeamSelectionChange(e) {
        console.log(e);
    }

    clickAdd() {
        this.props.history.push("/users");
    }
    async remoteData(query, status) {
        let data;
        let pageNumber;
        let pageCount;
        let orderDirection = query.orderDirection;
        let orderBy = undefined;
        if (query.orderBy) {
            orderBy = query.orderBy.field;
        }

        await TicketDataService.getAllUsersList(query.pageSize, query.page, query.search, orderDirection, orderBy)
            .then(async (response) => {
                //let result = response.data;
                for (var i of response.data.users) {
                    i.fullName = i.fullName;
                    i.email = i.email;
                    i.mobile = i.mobile;
                    i.designation=i.designation;
                    i.helpdeskRole=i.helpdeskRole;
                }
                data = response.data.users;
                pageNumber = response.data.currentPage;
                pageCount = response.data.totalItems;
            })
        return Promise.resolve(
            {
                data: data,
                page: pageNumber,
                totalCount: pageCount
            }
        );
    }
    render() {

        return (
            <div id="test">
                <div style={{ marginTop: "20px" }}>
                    <h5 className="formHeading">Teams</h5>
                    <div>
                        <div style={{display:"flex",flexDirection:"row",marginLeft:"83%"}}>
                            <Button style={{ color: "#fff", backgroundColor: "#1f3143",float:"right",marginLeft:"50px",marginBottom:"10px"}} onClick={this.clickAdd} variant="primary" type="submit">Add User
                            </Button>
                        </div>
                        <MaterialTable
                            title="Users List"
                            columns={this.columns}
                            data={this.remoteData.bind()}
                            tableRef={this.tableRef}
                            options={{
                                exportButton: false,
                                showSelectAllCheckbox: false,
                                toolbar: true,
                                showFirstLastPageButtons: false,
                                showTitle: true,
                                selection: false,
                                search: true,
                                padding: "dense",
                                pageSize: 8,
                                headerStyle: {
                                    backgroundColor: '#1f3143',
                                    color: '#FFD800',
                                    fontWeight: "bold",
                                },
                                selectionProps: rowData => ({
                                    color: 'default'
                                }),
                                showTextRowsSelected: false,
                            }}
                            onSelectionChange={(e) => {
                                this.onTeamSelectionChange(e);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default UsersList;