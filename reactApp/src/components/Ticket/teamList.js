import React, { Component } from "react";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import MaterialTable from "material-table";
import TicketDataService from "../../services/ticket.service";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Moment from 'moment';
import * as url from "../../http-common";
class TeamList extends Component {
    tableRef = React.createRef();
    constructor(props) {
        super(props);
        this.clickAdd = this.clickAdd.bind(this);
        this.remoteData = this.remoteData.bind(this);
        this.savePageLocation = this.savePageLocation.bind(this);
        this.exportData = this.exportData.bind(this);
        this.state = {
            locale: { 'format': 'DD/MM/YYYY' },
        };
        this.columns = [
            { title: "Team Name", field: "teamName", render: rowData =><span><i class="fa fa-users" aria-hidden="true"></i>
            &nbsp;&nbsp;<Link onClick={this.savePageLocation("/teamList")} to={`/addTeam/id:${rowData.id}`}>{rowData.teamName}</Link> 
            </span> },
            { title: "Created By", field: "createdBy" },
            { title: "Created Date", field: "createdAt" },
            { title: "Modified By", field: "updatedBy" },
            { title: "Modified Date", field: "updatedAt" }
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
        this.props.history.push("/addTeam");
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

        await TicketDataService.getAllTeams(query.pageSize, query.page, query.search, orderDirection, orderBy)
            .then(async (response) => {
                let result = response.data;
                for (var i of result.teams) {
                    i.createdAt = Moment(i.createdAt).format('DD/MM/YYYY hh:mm A');
                    i.updatedAt = Moment(i.updatedAt).format('DD/MM/YYYY hh:mm A');
                    i.createdBy = i.createdByDetails.fullName;
                    i.updatedBy = i.updatedByDetails.fullName;
                }
                data = result.teams;
                pageNumber = result.currentPage;
                pageCount = result.totalItems;
            })
        return Promise.resolve(
            {
                data: data,
                page: pageNumber,
                totalCount: pageCount
            }
        );
    }
    async exportData() {

        this.state.exportDataDownloadLink = url.baseURL + `/api/dataExport/downloadAllAdminTeams`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }
    render() {
        // if (!this.state.data) {
        //   return <div />; //Render component once api call's are completed.
        // }
        return (
            <div id="test">
                <div style={{ marginTop: "20px" }}>
                    <h5 className="formHeading">Teams</h5>
                    <div>
                        <div style={{display:"flex",flexDirection:"row",marginLeft:"83%"}}>
                            <Button style={{ color: "#fff", backgroundColor: "#1f3143",float:"right",marginLeft:"10px"}} onClick={this.clickAdd} variant="primary" type="submit">Add Team
                            </Button>
                            <Button style={{ color: "#fff", backgroundColor: "#1f3143",float:"right",marginLeft:"10px"}} variant="primary" type="submit" onClick={this.exportData}>
                                Export
                            </Button>
                        </div>
                        <MaterialTable
                            title="Teams List"
                            columns={this.columns}
                            data={this.remoteData.bind()}
                            tableRef={this.tableRef}
                            localization={{
                                toolbar: {
                                    searchPlaceholder: 'Enter Team Name',
                                }
    
                            }}
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
export default TeamList;