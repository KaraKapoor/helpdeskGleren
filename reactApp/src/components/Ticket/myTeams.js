import React, { Component } from "react";
import MaterialTable from "material-table";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row, Breadcrumb } from "react-bootstrap";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import { Fragment } from "react";
import Select from "react-select";
import Moment from 'moment';
import { FormControlLabel, Switch } from "@material-ui/core";
import { Link } from "react-router-dom";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import AsyncSelect from "react-select/async";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import * as Constants from "../Shared/constants";
import * as url from "../../http-common";
class MyTeams extends Component {
    tableRef = React.createRef();
    constructor(props) {
        super(props);
        this.onChangeTeam = this.onChangeTeam.bind(this);
        this.remoteData = this.remoteData.bind(this);
        this.refreshTableData = this.refreshTableData.bind(this);
        this.onChangeFilteringTicketStatus = this.onChangeFilteringTicketStatus.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.onChangeDepartment = this.onChangeDepartment.bind(this);
        this.saveFilterSetting = this.saveFilterSetting.bind(this);
        this.clearFilterSetting = this.clearFilterSetting.bind(this);
        this.onChangeHelpTopic = this.onChangeHelpTopic.bind(this);
        this.onAssigneeNameChange = this.onAssigneeNameChange.bind(this);
        this.onChangeOverDue = this.onChangeOverDue.bind(this);
        this.handleClosedDateRangeChange = this.handleClosedDateRangeChange.bind(this);
        this.savePageLocation = this.savePageLocation.bind(this);
        this.exportData = this.exportData.bind(this);
        this.filterTickets = this.filterTickets.bind(this);
        this.showClosedDataRange = false;
        this.showTable = false;
        this.state = {
            userId: undefined,
            selectedTeamId: undefined,
            selectedTeamName: undefined,
            showNestedTickets: false,
            userTeams: [],
            filteringTicketStatusOptions: [],
            departmentOptions: [],
            overDueOptions: [],
            start: Moment().subtract(29, 'days'),
            end: Moment(),
            closedStart: Moment().subtract(29, 'days'),
            closedEnd: Moment(),
            locale: { 'format': 'DD/MM/YYYY' },
            exportDataDownloadLink: "",
            helpTopicOptions: [],
            selectedAssigneeOption: {},
            userFilterSettings: [],
            defaultTicketStatus: [],
            defaultDepartmentFilter: {},
            renderData: false,
            defaultOverdueFilter: {},
            defaultHelptopicFilter: {},
            depId: "",
            assigneeId: undefined,
            defaultSelectedTeam:undefined
        };
        this.columns = [
            {
                title: "Ticket Number", field: "id",
                render: rowData => <Link to={`/viewTicket/id:${rowData.id}`} onClick={this.savePageLocation}>{rowData.id}</Link>
            },
            { title: "Created Date", field: "initialCreatedDate" },
            { title: "Subject", field: "subject" },
            { title: "From", field: "fullName" },
            { title: "Mobile", field: "userMobile" },
            { title: "Assignee", field: "assigneeFullName" },
            { title: "Branch", field: "branch" },
            { title: "Sch/Col", field: "schCol" },
            { title: "Ticket Status", field: "ticketStatus" },
            { title: "Department", field: "departmentName" },
            { title: "Helptopic", field: "helptopicName" },
            { title: "Initial Due Date", field: "level1DueDate" },
            { title: "Closed Date", field: "closedDate" },
            { title: "Closed By", field: "closedBy" },
            { title: "OverDue", field: "isTicketOverdue" },
            { title: "Satisfactory", field: "ticketSatisfaction" }
        ];
        this.state.userId = sessionStorage.getItem("userId");
        this.filterTicketStatus = [];
    }
    componentDidMount() {
        this.getAllTeamsOfUser();
        this.getFilteringTicketStatus();
        this.getDepartmentOptions();
        this.getOverDueOptions();
        this.getUserFilterSettings();
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
    savePageLocation() {
        sessionStorage.setItem("previousPageLocation", "/myTeams");
        sessionStorage.setItem("previousSelectedTeamId", this.state.selectedTeamId);
    }
    async getDepartmentOptions() {
        const res = await TicketDataService.getAllDepartments();
        const data = res.data;

        const options = data.map((d) => ({
            value: d.id,
            label: d.departmentName,
        }));
        options.push({ value: "All", label: "All" });
        this.setState({ departmentOptions: options });
    }
    async onChangeDepartment(e) {
        this.createUserSettingsArray(Constants.TICKET_DEPARTMENT_NAME, e);
        this.setState({ topicId: undefined, topicName: undefined });
        this.setState({ assigneeFullName: "", assigneeId: "" });
        //Get all helpTopic corresponding to departments
        const dataObj = {
            departmentId: e.value,
        };
        const res = await TicketDataService.getAllHelpTopicByDepartmentId(dataObj);
        const data = res.data;

        const options = data.map((d) => ({
            value: d.id,
            label: d.helpTopicName,
        }));
        this.setState({ helpTopicOptions: options });
        //End-Get all helpTopic corresponding to departments

        this.setState({ depId: e.value, deptName: e.label });
    }
    handleDateRangeChange(event, picker) {
        this.createUserSettingsArray(Constants.TICKET_CREATED_DATE_RANGE, picker);
        this.setState({ start: picker.startDate });
        this.setState({ end: picker.endDate });
    }

    handleClosedDateRangeChange(event, picker) {
        this.createUserSettingsArray(Constants.TICKET_CLOSED_DATE_RANGE, picker);
        this.setState({ closedStart: picker.startDate });
        this.setState({ closedEnd: picker.endDate });
    }
    onChangeTeam(e) {
        this.setState({ selectedTeamId: e.value });
        this.setState({ selectedTeamName: e.label });
        this.setState({defaultSelectedTeam:{label:e.label,value:e.value}});
        this.showTable = true;
    }

    onChangeNestedTickets = () => {
        if (this.state.showNestedTickets === true) {
            this.setState({ showNestedTickets: false });
            this.refreshTableData();
        } else {
            this.setState({ showNestedTickets: true });
            this.refreshTableData();
        }

    }
    async onChangeFilteringTicketStatus(e) {
        this.filterTicketStatus = [];
        /**<Case-1>None of the status is selected by user */
        if (e === null || e.length === 0) {
            this.filterTicketStatus = [];
            this.createUserSettingsArray(Constants.TICKET_STATUS, null);
        } else {
            for (let i of e) {
                this.filterTicketStatus.push(i.label);
            }
            let currentlySelectedStatus = [];
            for (let j of this.state.defaultTicketStatus) {
                currentlySelectedStatus.push(j.label);
            }
            /**<Case-2>All status is selected by user */
            if (this.filterTicketStatus.includes("All") && !currentlySelectedStatus.includes("All")) {
                this.setState({ defaultTicketStatus: this.state.filteringTicketStatusOptions });
                this.createUserSettingsArray(Constants.TICKET_STATUS, this.state.filteringTicketStatusOptions);
            }
            /**<Case-3>All status is unselected by user */
            else if (!this.filterTicketStatus.includes("All") && currentlySelectedStatus.includes("All")) {
                this.setState({ defaultTicketStatus: [] });
                this.createUserSettingsArray(Constants.TICKET_STATUS, []);
            }
            /**<Case-4>If user unselects any status from in between then remove the All status also.*/
            else if (this.filterTicketStatus.includes("All") && this.filterTicketStatus.length <= 14 && currentlySelectedStatus.includes("All") && currentlySelectedStatus.length <= 15) {
                let status = [];
                for (let k of e) {
                    if (k.label == "All") {

                    } else {
                        status.push(k);
                    }
                }
                this.setState({ defaultTicketStatus: status });
                this.createUserSettingsArray(Constants.TICKET_STATUS, status);
            }
            /**<Case-5>If user selects the last status then automatically select the All status also as now all are selected*/
            else if (!this.filterTicketStatus.includes("All") && currentlySelectedStatus.length == 13 && this.filterTicketStatus.length == 14) {
                this.setState({ defaultTicketStatus: this.state.filteringTicketStatusOptions });
                this.createUserSettingsArray(Constants.TICKET_STATUS, this.state.filteringTicketStatusOptions);
            }
            /**<Case-6>If user selects the Open status then automatically select the other open statuses also*/
            else if (this.filterTicketStatus.includes("Open") && !this.filterTicketStatus.includes("Resolved", "Closed") && !currentlySelectedStatus.includes("Open")) {
                let openStatuses = [];
                openStatuses.push({
                    value: 2,
                    label: "Open",
                },
                    {
                        value: 3,
                        label: "Awaiting for user response",
                    },
                    {
                        value: 4,
                        label: "Assigned to an engineer",
                    },
                    {
                        value: 5,
                        label: "Indent at Branch approval",
                    },
                    {
                        value: 6,
                        label: "Indent at DM approval",
                    },
                    {
                        value: 7,
                        label: "Indent at CO approval",
                    },
                    {
                        value: 8,
                        label: "Branch dependent",
                    },
                    {
                        value: 9,
                        label: "Warehouse dependent",
                    },
                    {
                        value: 10,
                        label: "Vendor dependent",
                    },
                    {
                        value: 11,
                        label: "Work in progress",
                    },
                    {
                        value: 12,
                        label: "Escalated to Next level",
                    },
                    {
                        value: 15,
                        label: "Re-Open",
                    })
                this.setState({ defaultTicketStatus: openStatuses });
                this.createUserSettingsArray(Constants.TICKET_STATUS, openStatuses);
            }
            /**<Case-7>If user any other status apart from Open & All then select it.*/
            else {
                this.setState({ defaultTicketStatus: e });
                this.createUserSettingsArray(Constants.TICKET_STATUS, e);
            }
        }

        if (this.filterTicketStatus.includes("Closed")) {
            this.showClosedDataRange = true;
        } else {
            this.showClosedDataRange = false;
        }

    }

    async getAllTeamsOfUser() {
        //Check if navigation is coming from breadcrumb then show selected team
        let teamId=sessionStorage.getItem("previousSelectedTeamId");
        const req = {
            teamLeadId: this.state.userId
        }
        const res = await TicketDataService.getAllTeamsOfLead(req);
        const data = res.data.data;
        let options=[];
        for(let i of data){
            if (teamId !== undefined && i.id == teamId) {
                this.setState({
                    defaultSelectedTeam: {
                        value: i.id,
                        label: i.teamName
                    }
                })
                this.setState({ selectedTeamId: i.id });
                this.setState({ selectedTeamName: i.teamName });
                this.showTable = true;
                this.refreshTableData();
            }
            options.push({
                value: i.id,
                label: i.teamName,
            })
        }
        this.setState({ userTeams: options });
    }
    async saveFilterSetting() {
        await TicketDataService.saveFilterSettings(this.state.userFilterSettings)
            .then((resp) => {
                console.log(resp);
            })
    }

    getOverDueOptions() {
        const options = [
            {
                value: 1,
                label: "Yes",
            },
            {
                value: 2,
                label: "No",
            }
        ];
        this.setState({ overDueOptions: options });
    }

    onChangeOverDue(e) {
        this.createUserSettingsArray(Constants.TICKET_OVERDUE, e);
        this.setState({ overdue: e.label })

    }

    async remoteData(query, status) {
        let data;
        let pageNumber;
        let pageCount;
        let teamId = this.state.selectedTeamId;
        let showNestedTickets = this.state.showNestedTickets
        let ticketStatus = this.filterTicketStatus;
        let departmentId = this.state.depId;
        let helpTopicId = this.state.topicId;
        let assigneeId = this.state.assigneeId;
        let isTicketOverdue = this.state.overdue;
        let orderDirection = query.orderDirection;
        let orderBy = undefined;
        if (query.orderBy) {
            orderBy = query.orderBy.field;
        }
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();

        //Ends-Process Date

        //Starts-Process Closed Date Range
        let ClosedStartDate = undefined;
        let ClosedEndDate = undefined;
        if (this.showClosedDataRange) {
            ClosedStartDate = new Date(this.state.closedStart);
            ClosedStartDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
            ClosedStartDate = ClosedStartDate.toISOString();

            ClosedEndDate = new Date(this.state.closedEnd);
            ClosedEndDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
            ClosedEndDate = ClosedEndDate.toISOString();
        } else {
            ClosedStartDate = undefined;
            ClosedEndDate = undefined;
        }

        //End-Process Closed Date Range

        await TicketDataService.getAllTicketsByTeamId(query.pageSize, query.page, query.search, orderDirection, orderBy, teamId, showNestedTickets, departmentId, ticketStatus, startDate, endDate, helpTopicId, assigneeId, isTicketOverdue, ClosedStartDate, ClosedEndDate,this.state.userId)
            .then(async (response) => {
                let result = response.data;
                //Change the date format before showing in the table 
                for (var i of result.teams) {
                    i.initialCreatedDate = Moment(i.initialCreatedDate).format('DD/MM/YYYY hh:mm A');
                    i.departmentName = i.department.departmentName;
                    i.userMobile = i.user.mobile;
                    i.closedBy = i.closedBy;
                    i.helptopicName = i.helptopic.helpTopicName;
                    i.isTicketOverdue = i.isTicketOverdue;
                    i.ticketSatisfaction = i.ticketSatisfaction;
                    if (i.level1DueDate !== null) {
                        i.level1DueDate = Moment(i.level1SlaDue).format('DD/MM/YYYY hh:mm A');
                    }
                    if (i.closedDate !== null) {
                        i.closedDate = Moment(i.closedDate).format('DD/MM/YYYY hh:mm A');
                    }
                }
                // Date processing end.
                /*Read the subject field from dynamicFormJson and insert new key subject in response used in showing subject in tickets list.*/
                for (var i of result.teams) {
                    for (let j of Object.entries(i.dynamicFormJson)) {
                        let search = "_";
                        let replaceWith = "";
                        let processString = j[0].toString().toLowerCase().split(search).join(replaceWith);
                        // let processString = j[0].toString().toLowerCase().replaceAll(/_/g, "")
                        if (processString.includes("issuesummary")) {
                            i['subject'] = j[1];
                        }
                    }
                }
                data = result.teams;
                pageNumber = result.currentPage;
                pageCount = result.totalItems;
                this.setState({ currentPageTickets: result.teams });
            })
        return Promise.resolve(
            {
                data: data,
                page: pageNumber,
                totalCount: pageCount
            }
        );
    }

    createUserSettingsArray(settingName, settingValue) {

        switch (settingName) {
            case Constants.TICKET_STATUS: {
                if (settingValue === null) {
                    const obj = {
                        userId: this.state.userId,
                        settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
                        settingValue: null,
                        settingName: settingName,
                    }
                    this.state.userFilterSettings.push(obj);
                    this.saveFilterSetting();
                } else {
                    let settingValueArray = [];
                    for (let i of settingValue) {
                        const obj = {
                            value: i.value,
                            label: i.label,
                        }
                        settingValueArray.push(obj);
                    }
                    const obj = {
                        userId: this.state.userId,
                        settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
                        settingValue: settingValueArray,
                        settingName: settingName,
                    }
                    this.state.userFilterSettings.push(obj);
                    this.saveFilterSetting();//Auto Save in backend.
                }
                break;
            }
            case Constants.TICKET_DEPARTMENT_NAME: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
                    settingValue: settingValue,
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;

            }
            case Constants.TICKET_ASSIGNEE_NAME: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
                    settingValue: settingValue,
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;

            }
            case Constants.TICKET_HELPTOPIC_NAME: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
                    settingValue: settingValue,
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;

            }
            case Constants.TICKET_OVERDUE: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
                    settingValue: settingValue,
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;
            }
            case Constants.TICKET_CREATED_DATE_RANGE: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
                    settingValue: {
                        startDate: settingValue.startDate,
                        endDate: settingValue.endDate
                    },
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;
            }
            case Constants.TICKET_CLOSED_DATE_RANGE: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
                    settingValue: {
                        closedStart: settingValue.startDate,
                        closedEnd: settingValue.endDate
                    },
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;
            }

        }
    }
    async getHelpTopicByDepartment(departmentId) {
        //Get all helpTopic corresponding to departments
        const dataObj = {
            departmentId: departmentId,
        };
        const res = await TicketDataService.getAllHelpTopicByDepartmentId(dataObj);

        const options = res.data.map((d) => ({
            value: d.id,
            label: d.helpTopicName,
        }));
        this.setState({ helpTopicOptions: options });
        //End-Get all helpTopic corresponding to departments
    }
    getUserFilterSettings() {
        const obj = {
            settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
            userId: this.state.userId
        }

        TicketDataService.getUserSettingsByType(obj).
            then((resp) => {
                this.setState({ userFilterSettings: resp.data.data });
                if (resp.data.data) {
                    for (let i of resp.data.data) {
                        switch (i.settingName) {
                            case Constants.TICKET_STATUS: {
                                this.setState({ defaultTicketStatus: i.settingValue });
                                for (let j of i.settingValue) {
                                    this.filterTicketStatus.push(j.label);
                                    if (j.label === 'Closed') {
                                        this.showClosedDataRange = true;
                                    } else {
                                        this.showClosedDataRange = false;
                                    }
                                }
                                break;
                            }
                            case Constants.TICKET_DEPARTMENT_NAME: {
                                this.setState({ defaultDepartmentFilter: i.settingValue });
                                this.setState({ depId: i.settingValue.value, deptName: i.settingValue.label });
                                this.getHelpTopicByDepartment(i.settingValue.value);
                                break;
                            }
                            case Constants.TICKET_HELPTOPIC_NAME: {
                                this.setState({ defaultHelptopicFilter: i.settingValue });
                                this.setState({ topicId: i.settingValue.value, topicName: i.settingValue.label });
                                break;
                            }
                            case Constants.TICKET_OVERDUE: {
                                this.setState({ defaultOverdueFilter: i.settingValue });
                                this.setState({ overdue: i.settingValue.label });
                                break;
                            }
                            case Constants.TICKET_CREATED_DATE_RANGE: {
                                this.setState({ start: Moment(i.settingValue.startDate) });
                                this.setState({ end: Moment(i.settingValue.endDate) });
                                break;
                            }
                            case Constants.TICKET_CLOSED_DATE_RANGE: {
                                this.setState({ closedStart: Moment(i.settingValue.closedStart) });
                                this.setState({ closedEnd: Moment(i.settingValue.closedEnd) });
                                break;
                            }
                            case Constants.TICKET_ASSIGNEE_NAME: {
                                ;
                                this.setState({ selectedAssigneeOption: i.settingValue });
                                this.setState({ assigneeId: i.settingValue.value });
                                break;
                            }

                        }
                    }
                }
                this.setState({ renderData: true });
                this.filterTickets();
            })
    }
    getFilteringTicketStatus() {
        const options = [
            {
                value: 1,
                label: "All",
            },
            {
                value: 2,
                label: "Open",
            },
            {
                value: 3,
                label: "Awaiting for user response",
            },
            {
                value: 4,
                label: "Assigned to an engineer",
            },
            {
                value: 5,
                label: "Indent at Branch approval",
            },
            {
                value: 6,
                label: "Indent at DM approval",
            },
            {
                value: 7,
                label: "Indent at CO approval",
            },
            {
                value: 8,
                label: "Branch dependent",
            },
            {
                value: 9,
                label: "Warehouse dependent",
            },
            {
                value: 10,
                label: "Vendor dependent",
            },
            {
                value: 11,
                label: "Work in progress",
            },
            {
                value: 12,
                label: "Escalated to Next level",
            },
            {
                value: 13,
                label: "Resolved",
            },
            {
                value: 14,
                label: "Closed",
            },
            {
                value: 15,
                label: "Re-Open",
            }
        ];
        this.setState({ filteringTicketStatusOptions: options });
    }
    clearFilterSetting() {
        const obj = {
            settingType: Constants.MY_TEAMS_TICKETS_FILTERS,
            userId: this.state.userId
        }
        TicketDataService.clearUserSettings(obj).
            then((resp) => {
                this.showSuccessToast(Constants.LBL_CLEAR_FILTER_MESSAGE);
                window.location.reload();
            })
    }
    filterTickets() {
        this.refreshTableData();
    }
    async exportData() {
        let departmentId = this.state.depId;
        let ticketStatus = this.filterTicketStatus;
        let helpTopicId = this.state.topicId;
        let assigneeId = this.state.assigneeId;
        let teamId = this.state.selectedTeamId;
        let showNestedTickets = this.state.showNestedTickets
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date

        //Starts-Process Closed Date Range
        let ClosedStartDate = undefined;
        let ClosedEndDate = undefined;
        if (this.showClosedDataRange) {
            ClosedStartDate = new Date(this.state.closedStart);
            ClosedStartDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
            ClosedStartDate = ClosedStartDate.toISOString();

            ClosedEndDate = new Date(this.state.closedEnd);
            ClosedEndDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
            ClosedEndDate = ClosedEndDate.toISOString();
        } else {
            ClosedStartDate = undefined;
            ClosedEndDate = undefined;
        }

        //End-Process Closed Date Range
        this.state.exportDataDownloadLink = url.baseURL + `/api/dataExport/downloadMyTeamTickets/?departmentId=${departmentId}&ticketStatus=${ticketStatus}&startDate=${startDate}&endDate=${endDate}&helpTopicId=${helpTopicId}&assigneeId=${assigneeId}&isTicketOverdue=${this.state.overdue}&closedStartDate=${ClosedStartDate}&closedEndDate=${ClosedEndDate}&teamId=${teamId}&showNestedTickets=${showNestedTickets}&userId=${this.state.userId}`;
        window.location.href = this.state.exportDataDownloadLink;
        // window.open(this.state.exportDataDownloadLink);
    }
    refreshTableData() {
        if (this.tableRef.current !== null) {
            this.tableRef.current.state.query.page = 0;
            this.tableRef.current.state.query.pageSize = 20;
            this.tableRef.current && this.tableRef.current.onQueryChange();
        }

    }
    async onChangeHelpTopic(e) {
        this.createUserSettingsArray(Constants.TICKET_HELPTOPIC_NAME, e);
        this.setState({
            topicId: e.value,
            topicName: e.label,
        });
    }
    async getHelpTopicOptions() {
        const res = await TicketDataService.getAllHelpTopics();
        const data = res.data;

        const options = data.map((d) => ({
            value: d.id,
            label: d.helpTopicName,
        }));
        this.setState({ helpTopicOptions: options });
    }
    onAssigneeNameChange = (selectedOption) => {
        if (selectedOption) {
            this.createUserSettingsArray(Constants.TICKET_ASSIGNEE_NAME, selectedOption);
            this.setState({
                selectedAssigneeOption: selectedOption,
            });
            this.setState({ assigneeId: selectedOption.value });
        }
    };
    fetchAssigneeName = (inputValue, callback) => {
        if (!inputValue) {
            callback([]);
        } else {
            setTimeout(() => {
                fetch(
                    url.baseURL + `/api/user/findByUserName/?fullName=${inputValue}`,
                    {
                        method: "GET",
                    }
                )
                    .then((resp) => {
                        return resp.json();
                    })
                    .then((data) => {
                        const tempArray = [];
                        data.forEach((element) => {
                            tempArray.push({
                                label: `${element.fullName}<${element.email}>`,
                                value: element.id,
                            });
                        });
                        callback(tempArray);
                    })
                    .catch((error) => {
                        console.log(error, "catch the hoop");
                    });
            });
        }
    };
    render() {
        return (
            <div id="test">
                <div style={{ marginTop: "20px" }}>
                    <h5 className="formHeading">My Teams</h5>
                </div>
                <div>
                    <Fragment>
                        {
                            (this.showTable === true) &&
                            <Breadcrumb>
                                <Breadcrumb.Item href="/myTeams">My Teams</Breadcrumb.Item>
                                <Breadcrumb.Item active>
                                    Team Tickets
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        }
                        <Row>
                            <Col xs={12} md={4} lg={4}>
                                <Form.Label className="formlabel" >Select Team</Form.Label>
                                <Select
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                    }}
                                    options={this.state.userTeams}
                                    onChange={this.onChangeTeam.bind(this)}
                                    value={this.state.defaultSelectedTeam}
                                    placeholder="Select Team"
                                />
                            </Col>
                        </Row>
                        {
                            this.showTable &&
                            <div >
                                {
                                    <Fragment>
                                        <Row>
                                            <Col xs={12} md={4} lg={4}>
                                                <Form.Label className="formlabel">Select Status</Form.Label>
                                                <ReactMultiSelectCheckboxes
                                                    onChange={(e) => {
                                                        this.onChangeFilteringTicketStatus(e);
                                                    }}
                                                    value={this.state.defaultTicketStatus}
                                                    placeholderButtonLabel="Select Status"
                                                    width="400px"
                                                    options={this.state.filteringTicketStatusOptions}
                                                />
                                            </Col>
                                            <Col xs={12} md={4} lg={4}>
                                                <Form.Label className="formlabel" >Created Date Range</Form.Label><br></br>
                                                <DateRangePicker
                                                    onEvent={this.handleDateRangeChange.bind()}
                                                    initialSettings={{
                                                        locale: this.state.locale,
                                                        startDate: this.state.start.toDate(),
                                                        endDate: this.state.end.toDate(),
                                                        ranges: {
                                                            Today: [Moment().toDate(), Moment().toDate()],
                                                            Yesterday: [
                                                                Moment().subtract(1, 'days').toDate(),
                                                                Moment().subtract(1, 'days').toDate(),
                                                            ],
                                                            'Last 7 Days': [
                                                                Moment().subtract(6, 'days').toDate(),
                                                                Moment().toDate(),
                                                            ],
                                                            'Last 30 Days': [
                                                                Moment().subtract(29, 'days').toDate(),
                                                                Moment().toDate(),
                                                            ],
                                                            'This Month': [
                                                                Moment().startOf('month').toDate(),
                                                                Moment().endOf('month').toDate(),
                                                            ],
                                                            'Last Month': [
                                                                Moment().subtract(1, 'month').startOf('month').toDate(),
                                                                Moment().subtract(1, 'month').endOf('month').toDate(),
                                                            ],
                                                            'Last 3 Months': [
                                                                Moment().subtract(3, 'month').startOf('month').toDate(),
                                                                Moment().toDate(),
                                                            ],
                                                            'Last 1 Year': [
                                                                Moment().subtract(12, 'month').startOf('month').toDate(),
                                                                Moment().toDate(),
                                                            ],
                                                        },
                                                    }}>
                                                    <input type="text" className="form-control" />
                                                </DateRangePicker>
                                            </Col>
                                            <Col xs={12} md={4} lg={4}>
                                                <Form.Label className="formlabel">Department</Form.Label>
                                                <Select
                                                    styles={{
                                                        // Fixes the overlapping problem of the component
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    defaultValue={this.state.defaultDepartmentFilter}
                                                    options={this.state.departmentOptions}
                                                    onChange={this.onChangeDepartment.bind(this)}
                                                    placeholder="Select department"
                                                />
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: "10px" }}>
                                            <Col xs={12} md={4} lg={4}>
                                                <Form.Label className="formlabel">Select HelpTopic</Form.Label>
                                                <Select
                                                    styles={{
                                                        // Fixes the overlapping problem of the component
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    options={this.state.helpTopicOptions}
                                                    value={{ value: this.state.topicId, label: this.state.topicName }}
                                                    defaultValue={this.state.defaultHelptopicFilter}
                                                    onChange={this.onChangeHelpTopic.bind(this)}
                                                    placeholder="Select HelpTopic"
                                                />
                                            </Col>
                                            <Col xs={12} md={4} lg={4}>
                                                <Form.Group controlId="formBasicAssigneeName">
                                                    <Form.Label className="formlabel">
                                                        Assignee Name
                                                    </Form.Label>
                                                    <AsyncSelect
                                                        styles={{
                                                            // Fixes the overlapping problem of the component
                                                            menu: provided => ({ ...provided, zIndex: 9999 })
                                                        }}
                                                        value={this.state.selectedAssigneeOption}
                                                        loadOptions={this.fetchAssigneeName}
                                                        placeholder="Search Assignee Name"
                                                        onChange={(e) => {
                                                            this.onAssigneeNameChange(e);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} md={4} lg={4}>
                                                <Form.Label className="formlabel">OverDue</Form.Label>
                                                <Select
                                                    styles={{
                                                        // Fixes the overlapping problem of the component
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    defaultValue={this.state.defaultOverdueFilter}
                                                    options={this.state.overDueOptions}
                                                    onChange={this.onChangeOverDue.bind(this)}
                                                    placeholder="Select overdue"
                                                />
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: "10px" }}>
                                            {
                                                this.showClosedDataRange === true &&
                                                <Col xs={12} md={4} lg={4}>
                                                    <Form.Label className="formlabel" >Closed Date Range</Form.Label><br></br>
                                                    <DateRangePicker
                                                        onEvent={this.handleClosedDateRangeChange.bind()}
                                                        initialSettings={{
                                                            locale: this.state.locale,
                                                            startDate: this.state.closedStart.toDate(),
                                                            endDate: this.state.closedEnd.toDate(),
                                                            ranges: {
                                                                Today: [Moment().toDate(), Moment().toDate()],
                                                                Yesterday: [
                                                                    Moment().subtract(1, 'days').toDate(),
                                                                    Moment().subtract(1, 'days').toDate(),
                                                                ],
                                                                'Last 7 Days': [
                                                                    Moment().subtract(6, 'days').toDate(),
                                                                    Moment().toDate(),
                                                                ],
                                                                'Last 30 Days': [
                                                                    Moment().subtract(29, 'days').toDate(),
                                                                    Moment().toDate(),
                                                                ],
                                                                'This Month': [
                                                                    Moment().startOf('month').toDate(),
                                                                    Moment().endOf('month').toDate(),
                                                                ],
                                                                'Last Month': [
                                                                    Moment().subtract(1, 'month').startOf('month').toDate(),
                                                                    Moment().subtract(1, 'month').endOf('month').toDate(),
                                                                ],
                                                                'Last 3 Months': [
                                                                    Moment().subtract(3, 'month').startOf('month').toDate(),
                                                                    Moment().toDate(),
                                                                ],
                                                                'Last 1 Year': [
                                                                    Moment().subtract(12, 'month').startOf('month').toDate(),
                                                                    Moment().toDate(),
                                                                ],
                                                            },
                                                        }}>
                                                        <input type="text" className="form-control" />
                                                    </DateRangePicker>
                                                </Col>
                                            }

                                        </Row>
                                    </Fragment>
                                }

                                <Row style={{ marginBottom: "10px" }}>
                                    <Col xs={12} md={2} lg={2}>
                                        <Form.Label style={{ visibility: "hidden" }}>Change Status</Form.Label><br></br>
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143" }} variant="primary" type="submit" onClick={this.filterTickets}>
                                            Filter Tickets
                                        </Button>
                                    </Col>
                                    <Col xs={12} md={2} lg={2}>
                                        <Form.Label style={{ visibility: "hidden" }}>Change Status</Form.Label><br></br>
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.exportData}>
                                            Export Data
                                        </Button>
                                    </Col>
                                    <Col xs={12} md={2} lg={2}>
                                        <Form.Label style={{ visibility: "hidden" }}>Clear Filter</Form.Label>
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.clearFilterSetting}>
                                            Clear Filter
                                        </Button>
                                    </Col>
                                </Row>

                            </div>
                        }
                    </Fragment>
                    {this.showTable && <MaterialTable
                        title={this.state.selectedTeamName + ' ' + 'Team' + 'Tickets'}
                        columns={this.columns}
                        actions={[
                            {
                                icon: () => <FormControlLabel
                                    value="top"
                                    control={<Switch color="primary" checked={this.state.showNestedTickets} />}
                                    onChange={this.onChangeNestedTickets}
                                    label="Nested Tickets"
                                    labelPlacement="top"

                                />,
                                tooltip: "View nested level tickets of team leads",
                                onClick: () => console.log("Clicked"),
                                isFreeAction: true
                            }
                        ]}
                        data={this.remoteData.bind()}
                        tableRef={this.tableRef}
                        localization={{
                            toolbar: {
                                searchPlaceholder: 'Enter TicketNo, Assignee Name, MobileNo',
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
                            pageSize: 20,
                            maxBodyHeight: '450px',
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
                    }
                </div>

            </div>
        );
    }

}

export default MyTeams;