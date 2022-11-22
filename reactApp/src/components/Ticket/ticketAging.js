import React, { Component, Fragment } from "react";
import MaterialTable, { MTableBody, MTableToolbar } from "material-table";
import TicketDataService from "../../services/ticket.service";
import "../Ticket/addTicket.css";
import Moment, { locale } from 'moment';
import { Col, Form, Button, Row, Modal, Table } from "react-bootstrap";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as url from "../../http-common";
import { toast } from 'react-toastify';
import * as Constants from "../Shared/constants";
import { TableCell, TableFooter, TableHead, TableRow } from "@material-ui/core";
import Select from "react-select";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import commonUtils from "../Shared/commonUtils";
class TicketAging extends Component {
    tableRef = React.createRef();
    constructor(props) {
        super(props);
        this.remoteData = this.remoteData.bind(this);
        this.remoteData1 = this.remoteData1.bind(this);
        this.remoteData2 = this.remoteData2.bind(this);
        this.remoteData3 = this.remoteData3.bind(this);
        this.remoteData4 = this.remoteData4.bind(this);
        this.remoteData5 = this.remoteData5.bind(this);
        this.remoteData6 = this.remoteData6.bind(this);
        this.remoteData7 = this.remoteData7.bind(this);
        this.remoteData8 = this.remoteData8.bind(this);
        this.remoteData9 = this.remoteData9.bind(this);
        this.remoteData10 = this.remoteData10.bind(this);
        this.remoteData11 = this.remoteData11.bind(this);
        this.remoteData12 = this.remoteData12.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.filterTickets = this.filterTickets.bind(this);
        this.exportData = this.exportData.bind(this);
        this.exportData1 = this.exportData1.bind(this);
        this.exportData2 = this.exportData2.bind(this);
        this.exportData3 = this.exportData3.bind(this);
        this.exportData4 = this.exportData4.bind(this);
        this.exportData5 = this.exportData5.bind(this);
        this.exportData6 = this.exportData6.bind(this);
        this.exportData7 = this.exportData7.bind(this);
        this.exportData8 = this.exportData8.bind(this);
        this.exportData9 = this.exportData9.bind(this);
        this.exportData10 = this.exportData10.bind(this);
        this.exportData11 = this.exportData11.bind(this);
        this.exportData12 = this.exportData12.bind(this);
        this.saveFilterSetting = this.saveFilterSetting.bind(this);
        this.clearFilterSetting = this.clearFilterSetting.bind(this);
        this.onChangeAnalyticView = this.onChangeAnalyticView.bind(this);
        this.onChangeTeamAssociatedAgent = this.onChangeTeamAssociatedAgent.bind(this);
        this.onChangeTeamLead = this.onChangeTeamLead.bind(this);
        this.onCloseTable1PopUp = this.onCloseTable1PopUp.bind(this);
        this.onCloseTable3PopUp = this.onCloseTable3PopUp.bind(this);
        this.onCloseTable5PopUp = this.onCloseTable5PopUp.bind(this);
        this.onCloseTable7PopUp = this.onCloseTable7PopUp.bind(this);
        this.onCloseTable9PopUp = this.onCloseTable9PopUp.bind(this);
        this.onCloseTable11PopUp = this.onCloseTable11PopUp.bind(this);
        this.onCloseTable12PopUp = this.onCloseTable12PopUp.bind(this);
        this.onChangeTeams = this.onChangeTeams.bind(this);
        this.onChangeDepartmentAssociatedTeam = this.onChangeDepartmentAssociatedTeam.bind(this);
        this.state = {
            userId: undefined,
            GrandTotal: undefined,
            GrandOpenTotal: undefined,
            GrandClosedCount: undefined,
            GrandClosedPercentage: undefined,
            GrandOverdueCount: undefined,
            GrandOverDuePercentage: undefined,
            start: Moment().subtract(29, 'days'),
            end: Moment(),
            locale: { 'format': 'DD/MM/YYYY' },
            userFilterSettings: [],
            renderData: false,
            analyticsViewOptions: [],
            selectedAnalyticView: undefined,
            selectedTeams: [],
            showTable: false,
            showTable1: false,
            showTable2: false,
            showTable3: false,
            showTable4: false,
            showTable5: false,
            showTable6: false,
            showTable7: false,
            showTable8: false,
            showTable9: false,
            showTable10: false,
            showTable11: false,
            showTable12: false,
            showTable1PopUp: false,
            showTable3PopUp: false,
            showTable5PopUp: false,
            showTable7PopUp: false,
            showTable9PopUp: false,
            showTable11PopUp: false,
            showTable12PopUp: false,
            selectedAgingRowData: undefined,
            isTeamLead: false,
            isCentralPoolAgent: false,
            isCentralAdmin: false,
            isAgent: false,
            defaultDepartmentFilter: [],
            defaultTeamLeadFilter: [],
            defaultHelptopicFilter: [],
            departmentOptions: [],
            helpTopicOptions: [],
            myTeamOptions: [],
            departmentAssociatedTeams: [],
            defaultDepartmentAssociatedTeam: [],
            teamAssociatedAgents: [],
            defaultTeamAssociatedAgent: [],
            teamLeads:[],
            displayTable:false



        };
        this.userColumns = [
            { title: "S.No", field: "SNo", width: "2%" },
            { title: "Department", field: "DepartmentName" },
            { title: "Total Tickets", field: "TotalTickets" },
            { title: "Open", field: "OpenCount" },
            { title: "Closed", field: "ClosedCount" },
            { title: "% of Closed", field: "ClosedPercentage", },
        ];
        this.agentColumns = [
            { title: "S.No", field: "SNo" },
            { title: "Department", field: "DepartmentName" },
            { title: "Total Tickets Assigned", field: "TotalAssignedTickets" },
            { title: "Open", field: "OpenCount" },
            { title: "Closed", field: "ClosedCount" },
            { title: "Overdue", field: "OverdueCount" },
            { title: "% of Closed", field: "ClosedPercentage" },
            { title: "% of Overdue", field: "OverduePercentage" },
        ];
        this.teamLeadAgentsColumns = [
            { title: "S.No", field: "SNo" },
            { title: "Agent", field: "AgentName" },
            { title: "Total Tickets Assigned", field: "TotalAssignedTickets" },
            { title: "Open", field: "OpenCount" },
            { title: "Closed", field: "ClosedCount" },
            { title: "Overdue", field: "OverdueCount" },
            { title: "% of Closed", field: "ClosedPercentage" },
            { title: "% of Overdue", field: "OverduePercentage" },
        ];
        this.table11Columns = [
            { title: "S.No", field: "SNo" },
            { title: "Lead Name", field: "AgentName" },
            { title: "Total Tickets Assigned", field: "TotalAssignedTickets" },
            { title: "Open", field: "OpenCount" },
            { title: "Closed", field: "ClosedCount" },
            { title: "Overdue", field: "OverdueCount" },
            { title: "% of Closed", field: "ClosedPercentage" },
            { title: "% of Overdue", field: "OverduePercentage" },
        ];
        this.table12Columns = [
            { title: "S.No", field: "SNo" },
            { title: "Lead Name", field: "AgentName" },
            { title: "Department Name", field: "DepartmentName" },
            { title: "Total Tickets Assigned", field: "TotalAssignedTickets" },
            { title: "Open", field: "OpenCount" },
            { title: "Closed", field: "ClosedCount" },
            { title: "Overdue", field: "OverdueCount" },
            { title: "% of Closed", field: "ClosedPercentage" },
            { title: "% of Overdue", field: "OverduePercentage" },
        ];
        this.teamLeadDepartmentColumns = [
            { title: "S.No", field: "SNo" },
            { title: "Department", field: "DepartmentName" },
            { title: "Team Name", field: "TeamName" },
            { title: "Total Tickets Assigned", field: "TotalAssignedTickets" },
            { title: "Open", field: "OpenCount" },
            { title: "Closed", field: "ClosedCount" },
            { title: "Overdue", field: "OverdueCount" },
            { title: "% of Closed", field: "ClosedPercentage" },
            { title: "% of Overdue", field: "OverduePercentage" },
        ];
        this.centralAgentDepartmentColumns = [
            { title: "S.No", field: "SNo" },
            { title: "Department", field: "DepartmentName" },
            { title: "Total Tickets Assigned", field: "TotalAssignedTickets" },
            { title: "Open", field: "OpenCount" },
            { title: "Closed", field: "ClosedCount" },
            { title: "Overdue", field: "OverdueCount" },
            { title: "% of Closed", field: "ClosedPercentage" },
            { title: "% of Overdue", field: "OverduePercentage" },
        ];
        this.teamLeadAgentSLAColumns = [
            { title: "S.No", field: "SNo" },
            { title: "Agent", field: "AgentName" },
            { title: "Total Tickets", field: "TotalAssignedTickets" },
            { title: "Open", field: "OpenCount" },
            { title: "Closed", field: "ClosedCount" },
            { title: "Overdue", field: "OverdueCount", },
            { title: "Average SLA(Days)", field: "AverageSLA", },
            { title: "Completed Avg(Days)", field: "CompletedDays", },
            { title: "Difference Days", field: "Difference", },
        ];
        this.table2Columns = [
            { title: "Department Name", field: "DepartmentName" },
            { title: "Helptopic Name", field: "HelpTopicName" },
            { title: "Total Tickets", field: "TotalTickets" },
            { title: "Open", field: "OpenTickets" },
            { title: "Closed", field: "ClosedTickets" },
            { title: "Overdue", field: "OverdueTickets", },
            { title: "% Closed", field: "ClosedTicketsPercent", },
            { title: "% Overdue", field: "OverdueTicketsPercent", },
            { title: "% In Progress", field: "OpenTicketsPercent", },
        ];
        this.table4Columns = [
            { title: "Department Name", field: "DepartmentName" },
            { title: "Team Name", field: "TeamName" },
            { title: "Helptopic Name", field: "HelpTopicName" },
            { title: "Total Tickets", field: "TotalTickets" },
            { title: "Open", field: "OpenTickets" },
            { title: "Closed", field: "ClosedTickets" },
            { title: "Overdue", field: "OverdueTickets", },
            { title: "% Closed", field: "ClosedTicketsPercent", },
            { title: "% Overdue", field: "OverdueTicketsPercent", },
            { title: "% In Progress", field: "OpenTicketsPercent", },
        ];
        this.table8Columns = [
            { title: "Department Name", field: "DepartmentName" },
            { title: "Helptopic Name", field: "HelpTopicName" },
            { title: "Total Tickets", field: "TotalTickets" },
            { title: "Open", field: "OpenTickets" },
            { title: "Closed", field: "ClosedTickets" },
            { title: "Overdue", field: "OverdueTickets", },
            { title: "% Closed", field: "ClosedTicketsPercent", },
            { title: "% Overdue", field: "OverdueTicketsPercent", },
            { title: "% In Progress", field: "OpenTicketsPercent", },
        ];
        this.state.userId = sessionStorage.getItem("userId");
    }

    componentDidMount() {
        this.state.isTeamLead = sessionStorage.getItem("isTeamLead");
        console.log(this.state.isTeamLead);
        this.state.isCentralPoolAgent = sessionStorage.getItem("isCentralPoolAgent");
        console.log(this.state.isCentralPoolAgent);
        this.state.isCentralAdmin = sessionStorage.getItem("isCentralAdmin");
        console.log(this.state.isCentralAdmin);
        this.state.isAgent = sessionStorage.getItem("isAgent");
        console.log(this.state.isAgent);
        this.getAnalyticsViewOptions();
        this.getUserFilterSettings();
        this.getDepartmentOptions();
        this.retriveStateAfterClearFilter();
    }
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
    handleDateRangeChange(event, picker) {
        this.createUserSettingsArray(Constants.TICKET_CREATED_DATE_RANGE, picker);
        this.setState({ start: picker.startDate });
        this.setState({ end: picker.endDate });
    }
    async filterTickets() {
        // if((this.state.showTable5 || this.state.showTable6)){
        //     return this.showWarningToast("Please select Team Name");
        // }else if((this.state.showTable7 === true || this.state.showTable8 || this.state.showTable9 === true || this.state.showTable10 === true || this.state.showTable12 === true) && this.state.defaultDepartmentAssociatedTeam.length<=0){
        //     return this.showWarningToast("Please select Team Name");
        // }else 
        
        if ((this.state.showTable2 || this.state.showTable3 || this.state.showTable4 || this.state.showTable5 || this.state.showTable6 || this.state.showTable7 || this.state.showTable8 || this.state.showTable9 || this.state.showTable10 || this.state.showTable11 || this.state.showTable12) && (commonUtils.do_Null_Undefined_EmptyArray_Check(this.state.defaultDepartmentFilter) === null)) {
            return this.showWarningToast("Please select the Department Name");
        } else if ((this.state.showTable7 || this.state.showTable8 || this.state.showTable9 || this.state.showTable10 || this.state.showTable12) && (commonUtils.do_Null_Undefined_EmptyArray_Check(this.state.defaultDepartmentAssociatedTeam) === null)) {
            return this.showWarningToast("Please select the Associated Team");
        } else if ((this.state.showTable3 || this.state.showTable4 || this.state.showTable5 || this.state.showTable6 || this.state.showTable11) && (commonUtils.do_Null_Undefined_EmptyArray_Check(this.state.selectedTeams) === null)) {
            return this.showWarningToast("Please select the Team Name");
        } else if ((this.state.showTable9 || this.state.showTable10) && (commonUtils.do_Null_Undefined_EmptyArray_Check(this.state.defaultTeamAssociatedAgent) === null)) {
            return this.showWarningToast("Please select the Team Agent");
        } else if((this.state.showTable8) && (commonUtils.do_Null_Undefined_EmptyArray_Check(this.state.defaultHelptopicFilter)===null)){
            return this.showWarningToast("Please select the Helptopic Name");
        } else {
            this.setState({ displayTable: true });
            this.tableRef.current && this.tableRef.current.onQueryChange();
        }

    }
    async exportData() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date
        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForUser?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }
    async exportData1() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date
        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForAgent?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }
    async exportData2() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date

        let departmentIds = [];
        for (let i of this.state.defaultDepartmentFilter) {
            departmentIds.push(i.value);
        }
        if (this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        }

        let helptopicIds = [];
        for (let i of this.state.defaultHelptopicFilter) {
            helptopicIds.push(i.value);
        }
        if (this.state.defaultHelptopicFilter.length == 0) {
            helptopicIds = undefined;
        }

        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForAgentWithHelptopic?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&departmentIds=${departmentIds}&helptopicIds=${helptopicIds}`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }

    async exportData3() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date

        if (this.state.depId === "All" || this.state.depId === undefined) {
            this.state.depId = null;
        }
        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let helptopicIds = [];
        if (this.state.defaultHelptopicFilter == null || this.state.defaultHelptopicFilter.length == 0) {
            helptopicIds = undefined;
        } else {
            for (let i of this.state.defaultHelptopicFilter) {
                helptopicIds.push(i.value);
            }
        }
        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForLeadWithDepartment?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&departmentIds=${departmentIds}&teams=${teamIds}`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }
    exportData4() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date

        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let helptopicIds = [];
        if (this.state.defaultHelptopicFilter == null || this.state.defaultHelptopicFilter.length == 0) {
            helptopicIds = undefined;
        } else {
            for (let i of this.state.defaultHelptopicFilter) {
                helptopicIds.push(i.value);
            }
        }

        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForLeadWithHelptopic?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&departmentIds=${departmentIds}&helptopicIds=${helptopicIds}&teams=${teamIds}`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }

    exportData5() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date


        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }


        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForLeadWithAgents?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&departmentIds=${departmentIds}&teams=${teamIds}`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }

    exportData6() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }
        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }
        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForLeadWithAgentsSLA?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&departmentIds=${departmentIds}&teams=${teamIds}`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }

    async exportData7() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date

        if (this.state.depId === "All" || this.state.depId === undefined) {
            this.state.depId = null;
        }
        let teamIds = [];
        for (let i of this.state.defaultDepartmentAssociatedTeam) {
            teamIds.push(i.value);
        }
        if (this.state.departmentAssociatedTeams.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let helptopicIds = [];
        if (this.state.defaultHelptopicFilter == null || this.state.defaultHelptopicFilter.length == 0) {
            helptopicIds = undefined;
        } else {
            for (let i of this.state.defaultHelptopicFilter) {
                helptopicIds.push(i.value);
            }
        }
        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForCentralAgentWithDepartment?startDate=${startDate}&endDate=${endDate}&isExport=true&departmentIds=${departmentIds}&teams=${teamIds}`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }

    async exportData8() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date

        let teamIds = [];
        for (let i of this.state.defaultDepartmentAssociatedTeam) {
            teamIds.push(i.value);
        }
        if (this.state.departmentAssociatedTeams.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let helptopicIds = [];
        if (this.state.defaultHelptopicFilter == null || this.state.defaultHelptopicFilter.length == 0) {
            helptopicIds = undefined;
        } else {
            for (let i of this.state.defaultHelptopicFilter) {
                helptopicIds.push(i.value);
            }
        }

        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForCentralAgentWithHelptopic?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&departmentIds=${departmentIds}&helptopicIds=${helptopicIds}&teams=${teamIds}`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }

    async exportData9() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date


        let teamIds = [];
        for (let i of this.state.defaultDepartmentAssociatedTeam) {
            teamIds.push(i.value);
        }
        if (this.state.defaultDepartmentAssociatedTeam.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let agentsInTeam = [];
        if (this.state.defaultTeamAssociatedAgent == null || this.state.defaultTeamAssociatedAgent.length == 0) {
            agentsInTeam = undefined;
        } else {
            for (let i of this.state.defaultTeamAssociatedAgent) {
                agentsInTeam.push(i.value);
            }
        }

        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForCentralAgentsWithAgents?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&departmentIds=${departmentIds}&teams=${teamIds}&agentsInTeam=${agentsInTeam}`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }
    exportData10() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }
        let teamIds = [];
        for (let i of this.state.departmentAssociatedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.departmentAssociatedTeams.length == 0) {
            teamIds = undefined;
        }

        let agentsInTeam = [];
        if (this.state.defaultTeamAssociatedAgent == null || this.state.defaultTeamAssociatedAgent.length == 0) {
            agentsInTeam = undefined;
        } else {
            for (let i of this.state.defaultTeamAssociatedAgent) {
                agentsInTeam.push(i.value);
            }
        }

        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForCentralAgentWithAgentsSLA?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&departmentIds=${departmentIds}&teams=${teamIds}&agentsInTeam=${agentsInTeam}`;
        // window.open(this.state.exportDataDownloadLink);
        window.location.href = this.state.exportDataDownloadLink;
    }
    
    exportData11() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date


        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }

        let leadIds = [];
        if (this.state.defaultTeamLeadFilter == null || this.state.defaultTeamLeadFilter.length == 0) {
            leadIds = undefined;
        } else {
            for (let i of this.state.defaultTeamLeadFilter) {
                leadIds.push(i.value);
            }
        }


        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForTeamLead?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&leadIds=${leadIds}&teams=${teamIds}`;
        window.location.href = this.state.exportDataDownloadLink;
    }
    exportData12() {
        //Starts-Process Date
        let startDate = new Date(this.state.start);
        startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
        startDate = startDate.toISOString();

        let endDate = new Date(this.state.end);
        endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
        endDate = endDate.toISOString();
        //End-Process Date


        let teamIds = [];
        for (let i of this.state.defaultDepartmentAssociatedTeam) {
            teamIds.push(i.value);
        }
        if (this.state.defaultDepartmentAssociatedTeam.length == 0) {
            teamIds = undefined;
        }

        let leadIds = [];
        if (this.state.defaultTeamLeadFilter == null || this.state.defaultTeamLeadFilter.length == 0) {
            leadIds = undefined;
        } else {
            for (let i of this.state.defaultTeamLeadFilter) {
                leadIds.push(i.value);
            }
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }


        this.state.exportDataDownloadLink = url.baseURL + `/api/analytics/getAnalyticsForCentralAgentTeamLeadView?userId=${this.state.userId}&startDate=${startDate}&endDate=${endDate}&isExport=true&leadIds=${leadIds}&teams=${teamIds}&departmentIds=${departmentIds}`;
        window.location.href = this.state.exportDataDownloadLink;
    }
    async remoteData(query) {
        let data;
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
        console.log(this.state.userId);
        await TicketDataService.findAnalyticsForUser(this.state.userId, orderDirection, orderBy, startDate, endDate)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData1(query) {
        let data;
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
        console.log(this.state.userId);
        await TicketDataService.findAnalyticsForAgents(this.state.userId, orderDirection, orderBy, startDate, endDate)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result[0].GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result[0].GrandOverDuePercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData2(query) {
        let data;
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

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }



        let helptopicIds = [];
        if (this.state.defaultHelptopicFilter == null || this.state.defaultHelptopicFilter.length == 0) {
            helptopicIds = undefined;
        } else {
            for (let i of this.state.defaultHelptopicFilter) {
                helptopicIds.push(i.value);
            }
        }


        console.log(this.state.userId);
        await TicketDataService.getAnalyticsForAgentWithHelptopic(this.state.userId, orderDirection, orderBy, startDate, endDate, departmentIds, helptopicIds)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result.GrandTotal });
                this.setState({ GrandOpenTotal: result.GrandOpenTotal });
                this.setState({ GrandClosedCount: result.GrandClosedCount });
                this.setState({ GrandClosedPercentage: result.GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result.GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result.GrandOverDuePercentage });
                this.setState({ GrandOpenPercentage: result.GrandOpenPercentage });
                data = result.Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData3(query) {
        //Validations   
        // if (this.state.selectedTeams.length == 0) {
        //     this.showWarningToast("Please select Team Name");
        // }

        let data;
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
        console.log(this.state.userId);
        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        await TicketDataService.getAnalyticsForLeadWithDepartment(this.state.userId, startDate, endDate, departmentIds, teamIds, orderDirection, orderBy)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result[0].GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result[0].GrandOverDuePercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData4(query) {
        //Validations   
        // if (this.state.selectedTeams.length == 0) {
        //     this.showWarningToast("Please select Team Name");
        // }
        let data = [];
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

        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let helptopicIds = [];
        if (this.state.defaultHelptopicFilter == null || this.state.defaultHelptopicFilter.length == 0) {
            helptopicIds = undefined;
        } else {
            for (let i of this.state.defaultHelptopicFilter) {
                helptopicIds.push(i.value);
            }
        }
        console.log(this.state.userId);
        await TicketDataService.getAnalyticsForLeadWithHelptopic(this.state.userId, orderDirection, orderBy, startDate, endDate, departmentIds, helptopicIds, teamIds)
            .then(async (response) => {
                let result = response.data;
                this.setState({ GrandTotal: result.GrandTotal });
                this.setState({ GrandOpenTotal: result.GrandOpenTotal });
                this.setState({ GrandClosedCount: result.GrandClosedCount });
                this.setState({ GrandClosedPercentage: result.GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result.GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result.GrandOverDuePercentage });
                this.setState({ GrandOpenPercentage: result.GrandOpenPercentage });
                if (result.Data !== undefined) {
                    data = result.Data;
                }

            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData5(query) {
        //Validations   
        // if (this.state.selectedTeams.length == 0) {
        //     this.showWarningToast("Please select Team Name");
        // }
        let data;
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

        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        console.log(this.state.userId);
        await TicketDataService.getAnalyticsForLeadWithAgents(this.state.userId, orderDirection, orderBy, startDate, endDate, departmentIds, teamIds)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result[0].GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result[0].GrandOverDuePercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData6(query) {
        //Validations   
        // if (this.state.selectedTeams.length == 0) {
        //     this.showWarningToast("Please select Team Name");
        // }
        let data;
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

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }
        console.log(this.state.userId);
        await TicketDataService.getAnalyticsForLeadWithAgentsSLA(this.state.userId, orderDirection, orderBy, startDate, endDate, departmentIds, teamIds)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result[0].GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result[0].GrandOverDuePercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData7(query) {
        let data;
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
        let teamIds = [];
        for (let i of this.state.defaultDepartmentAssociatedTeam) {
            teamIds.push(i.value);
        }
        if (this.state.defaultDepartmentAssociatedTeam.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        await TicketDataService.getAnalyticsForCentralAgentWithDepartment(startDate, endDate, departmentIds, teamIds, orderDirection, orderBy)
            .then(async (response) => {
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result[0].GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result[0].GrandOverDuePercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData8(query) {
        //Validations   
        // if (this.state.defaultDepartmentAssociatedTeam.length == 0) {
        //     this.showWarningToast("Please select Team Name");
        // }
        let data = [];
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

        let teamIds = [];
        for (let i of this.state.defaultDepartmentAssociatedTeam) {
            teamIds.push(i.value);
        }
        if (this.state.defaultDepartmentAssociatedTeam.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let helptopicIds = [];
        if (this.state.defaultHelptopicFilter == null || this.state.defaultHelptopicFilter.length == 0) {
            helptopicIds = undefined;
        } else {
            for (let i of this.state.defaultHelptopicFilter) {
                helptopicIds.push(i.value);
            }
        }
        console.log(this.state.userId);
        await TicketDataService.getAnalyticsForCentralAgentWithHelptopic(this.state.userId, orderDirection, orderBy, startDate, endDate, departmentIds, helptopicIds, teamIds)
            .then(async (response) => {
                let result = response.data;
                this.setState({ GrandTotal: result.GrandTotal });
                this.setState({ GrandOpenTotal: result.GrandOpenTotal });
                this.setState({ GrandClosedCount: result.GrandClosedCount });
                this.setState({ GrandClosedPercentage: result.GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result.GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result.GrandOverDuePercentage });
                this.setState({ GrandOpenPercentage: result.GrandOpenPercentage });
                if (result.Data !== undefined) {
                    data = result.Data;
                }

            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData9(query) {
        //Validations   
        // if (this.state.departmentAssociatedTeams.length == 0) {
        //     this.showWarningToast("Please select Team Name");
        // }
        let data;
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

        let teamIds = [];
        for (let i of this.state.defaultDepartmentAssociatedTeam) {
            teamIds.push(i.value);
        }
        if (this.state.defaultDepartmentAssociatedTeam.length == 0) {
            teamIds = undefined;
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let agentsInTeam = [];
        if (this.state.defaultTeamAssociatedAgent == null || this.state.defaultTeamAssociatedAgent.length == 0) {
            agentsInTeam = undefined;
        } else {
            for (let i of this.state.defaultTeamAssociatedAgent) {
                agentsInTeam.push(i.value);
            }
        }

        console.log(this.state.userId);
        await TicketDataService.getAnalyticsForCentralAgentWithAgents(this.state.userId, orderDirection, orderBy, startDate, endDate, departmentIds, teamIds, agentsInTeam)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result[0].GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result[0].GrandOverDuePercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData10(query) {
        //Validations   
        // if (this.state.departmentAssociatedTeams.length == 0) {
        //     this.showWarningToast("Please select Team Name");
        // }
        let data;
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

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        let teamIds = [];
        for (let i of this.state.defaultDepartmentAssociatedTeam) {
            teamIds.push(i.value);
        }
        if (this.state.defaultDepartmentAssociatedTeam.length == 0) {
            teamIds = undefined;
        }

        let agentsInTeam = [];
        if (this.state.defaultTeamAssociatedAgent == null || this.state.defaultTeamAssociatedAgent.length == 0) {
            agentsInTeam = undefined;
        } else {
            for (let i of this.state.defaultTeamAssociatedAgent) {
                agentsInTeam.push(i.value);
            }
        }
        console.log(this.state.userId);
        await TicketDataService.getAnalyticsForCentralAgentWithAgentsSLA(this.state.userId, orderDirection, orderBy, startDate, endDate, departmentIds, teamIds, agentsInTeam)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result[0].GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result[0].GrandOverDuePercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData11(query) {
        let data;
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

        let teamIds = [];
        for (let i of this.state.selectedTeams) {
            teamIds.push(i.value);
        }
        if (this.state.selectedTeams.length == 0) {
            teamIds = undefined;
        }

        let leadIds = [];
        if (this.state.defaultTeamLeadFilter == null || this.state.defaultTeamLeadFilter.length == 0) {
            leadIds = undefined;
        } else {
            for (let i of this.state.defaultTeamLeadFilter) {
                leadIds.push(i.value);
            }
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            return this.showWarningToast("Department Name is mandatory");
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        await TicketDataService.getAnalyticsForTeamLead(this.state.userId, orderDirection, orderBy, startDate, endDate, leadIds, teamIds,departmentIds)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result[0].GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result[0].GrandOverDuePercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async remoteData12(query) {
        let data;
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

        let teamIds = [];
        for (let i of this.state.defaultDepartmentAssociatedTeam) {
            teamIds.push(i.value);
        }
        if (this.state.defaultDepartmentAssociatedTeam.length == 0) {
            teamIds = undefined;
        }

        let leadIds = [];
        if (this.state.defaultTeamLeadFilter == null || this.state.defaultTeamLeadFilter.length == 0) {
            leadIds = undefined;
        } else {
            for (let i of this.state.defaultTeamLeadFilter) {
                leadIds.push(i.value);
            }
        }

        let departmentIds = [];
        if (this.state.defaultDepartmentFilter == null || this.state.defaultDepartmentFilter.length == 0) {
            departmentIds = undefined;
        } else {
            for (let i of this.state.defaultDepartmentFilter) {
                departmentIds.push(i.value);
            }
        }

        await TicketDataService.getAnalyticsForCentralAgentTeamLead(this.state.userId, orderDirection, orderBy, startDate, endDate, leadIds, teamIds,departmentIds)
            .then(async (response) => {
                console.log(response)
                let result = response.data;
                this.setState({ GrandTotal: result[0].GrandTotal });
                this.setState({ GrandOpenTotal: result[0].GrandOpenTotal });
                this.setState({ GrandClosedCount: result[0].GrandClosedCount });
                this.setState({ GrandClosedPercentage: result[0].GrandClosedPercentage });
                this.setState({ GrandOverdueCount: result[0].GrandOverdueCount });
                this.setState({ GrandOverDuePercentage: result[0].GrandOverDuePercentage });

                data = result[0].Data;
            })
        return Promise.resolve(
            {
                data: data,
            }
        );
    }
    async saveFilterSetting() {
        await TicketDataService.saveFilterSettings(this.state.userFilterSettings)
            .then((resp) => {
                console.log(resp);
            })
    }

    clearFilterSetting() {
        const obj = {
            settingType: Constants.ANALYTICS_FILTERS,
            userId: this.state.userId
        }
        TicketDataService.clearUserSettings(obj).
            then((resp) => {
                //Persist the current page state
                if (this.state.selectedAnalyticView.value === "User-View") {
                    this.savePageLocation("User-View");
                } else if (this.state.selectedAnalyticView.value === "Agent-Department-View") {
                    this.savePageLocation("Agent-Department-View");
                } else if (this.state.selectedAnalyticView.value === "Agent-HelpTopic-View") {
                    this.savePageLocation("Agent-HelpTopic-View");
                } else if (this.state.selectedAnalyticView.value === "TeamLead-Department-View") {
                    this.savePageLocation("TeamLead-Department-View");
                } else if (this.state.selectedAnalyticView.value === "TeamLead-Helptopic-View") {
                    this.savePageLocation("TeamLead-Helptopic-View");
                } else if (this.state.selectedAnalyticView.value === "TeamLead-Agents-View") {
                    this.savePageLocation("TeamLead-Agents-View");
                } else if (this.state.selectedAnalyticView.value === "TeamLead-Agents-SLA-View") {
                    this.savePageLocation("TeamLead-Agents-SLA-View");
                } else if (this.state.selectedAnalyticView.value === "Central-Agent-Department-View") {
                    this.savePageLocation("Central-Agent-Department-View");
                } else if (this.state.selectedAnalyticView.value === "Central-Agent-Helptopic-View") {
                    this.savePageLocation("Central-Agent-Helptopic-View");
                } else if (this.state.selectedAnalyticView.value === "Central-Agent-Agents-View") {
                    this.savePageLocation("Central-Agent-Agents-View");
                } else if (this.state.selectedAnalyticView.value === "Central-Agent-SLA-View") {
                    this.savePageLocation("Central-Agent-SLA-View");
                } else if (this.state.selectedAnalyticView.value === "Team-Lead-View") {
                    this.savePageLocation("Team-Lead-View");
                } else if (this.state.selectedAnalyticView.value === "Central Agent Team Lead View") {
                    this.savePageLocation("Central Agent Team Lead View");
                }
                //End: Persist the current page state
                this.showSuccessToast(Constants.LBL_CLEAR_FILTER_MESSAGE);
                this.getUserFilterSettings();
                window.location.reload();

            })
    }

    savePageLocation(location) {
        sessionStorage.setItem("previousPageLocation", location);
    }

    retriveStateAfterClearFilter() {
        //Retrieve the state after page load
        let value = sessionStorage.getItem("previousPageLocation");
        if (value == null || undefined) {
            return null;
        }
        let obj = {
            "label": value,
            "value": value,
        }
        if (value === "User-View") {
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "Agent-Department-View") {
            this.setState({ showTable: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable1: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "Agent-HelpTopic-View") {
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable2: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "TeamLead-Department-View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable3: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "TeamLead-Helptopic-View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable4: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "TeamLead-Agents-View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable5: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "TeamLead-Agents-SLA-View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable6: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "Central-Agent-Department-View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable7: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "Central-Agent-Helptopic-View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable8: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "Central-Agent-Agents-View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable9: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "Central-Agent-SLA-View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: true });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "Team-Lead-View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable12: false });
            this.setState({ showTable11: true });
            this.setState({ selectedAnalyticView: obj });
        } else if (value === "Central Agent Team Lead View") {
            this.getMyTeams();
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: true });
            this.setState({ selectedAnalyticView: obj });
        }
        sessionStorage.removeItem("previousPageLocation");
    }
    createUserSettingsArray(settingName, settingValue) {

        switch (settingName) {
            case Constants.TICKET_CREATED_DATE_RANGE: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.ANALYTICS_FILTERS,
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
            case Constants.TICKET_DEPARTMENT_NAME: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.ANALYTICS_FILTERS,
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
                    settingType: Constants.ANALYTICS_FILTERS,
                    settingValue: settingValue,
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;

            }
            case Constants.TEAM_NAME: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.ANALYTICS_FILTERS,
                    settingValue: settingValue,
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;

            }
            case Constants.TEAM_LEAD_NAME: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.ANALYTICS_FILTERS,
                    settingValue: settingValue,
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;

            }
            case Constants.DEPARTMENT_ASSOCIATED_TEAM_NAME: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.ANALYTICS_FILTERS,
                    settingValue: settingValue,
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;

            }
            case Constants.TEAM_ASSOCIATED_AGENT_NAME: {
                const obj = {
                    userId: this.state.userId,
                    settingType: Constants.ANALYTICS_FILTERS,
                    settingValue: settingValue,
                    settingName: settingName,
                }
                this.state.userFilterSettings.push(obj);
                this.saveFilterSetting();//Auto Save in backend.
                break;

            }
        }
    }

    getUserFilterSettings() {
        const obj = {
            settingType: Constants.ANALYTICS_FILTERS,
            userId: this.state.userId
        }

        TicketDataService.getUserSettingsByType(obj).
            then((resp) => {
                if (resp.data.data.length <= 0) {
                    this.setState({ defaultDepartmentFilter: [] });
                    this.setState({ defaultHelptopicFilter: [] });
                    this.setState({ selectedTeams: [] });
                    this.setState({ defaultDepartmentAssociatedTeam: [] });
                    this.setState({ defaultTeamLeadFilter: [] });
                }
                if (resp.data.data.length > 0) {
                    this.setState({ userFilterSettings: resp.data.data });
                    for (let i of resp.data.data) {
                        switch (i.settingName) {
                            case Constants.TICKET_CREATED_DATE_RANGE: {
                                this.setState({ start: Moment(i.settingValue.startDate) });
                                this.setState({ end: Moment(i.settingValue.endDate) });
                                break;
                            }
                            case Constants.TICKET_DEPARTMENT_NAME: {
                                this.setState({ defaultDepartmentFilter: i.settingValue });
                                // this.setState({ depId: i.settingValue.value, deptName: i.settingValue.label });
                                if (i.settingValue) {
                                    for (let j of i.settingValue) {
                                        this.getHelpTopicByDepartment(j.value);
                                    }
                                }

                                break;
                            }
                            case Constants.TICKET_HELPTOPIC_NAME: {
                                this.setState({ defaultHelptopicFilter: i.settingValue });
                                this.setState({ topicId: i.settingValue.value, topicName: i.settingValue.label });
                                break;
                            }
                            case Constants.TEAM_NAME: {
                                this.setState({ selectedTeams: i.settingValue });
                                if (i.settingValue) {
                                    let leads=[];
                                    for (let j of i.settingValue) {
                                        leads.push(j);
                                    }
                                    this.getTeamLeadsByTeam(leads);
                                }

                                break;
                            }
                            case Constants.TEAM_LEAD_NAME: {
                                this.setState({ defaultTeamLeadFilter: i.settingValue });
                                break;
                            }
                            case Constants.DEPARTMENT_ASSOCIATED_TEAM_NAME: {
                                this.setState({ defaultDepartmentAssociatedTeam: i.settingValue });
                                this.setState({ departmentAssociatedTeams: i.settingValue });
                                break;
                            }
                            case Constants.TEAM_ASSOCIATED_AGENT_NAME: {
                                this.setState({ defaultTeamAssociatedAgent: i.settingValue });
                                this.setState({ teamAssociatedAgents: i.settingValue });
                                break;
                            }
                        }
                    }
                }
                this.setState({ renderData: true });
                //this.filterTickets();
            })
    }
    async getAnalyticsViewOptions() {
        //Normal User
        if (this.state.isCentralPoolAgent === 'false' && this.state.isTeamLead === 'false' && this.state.isCentralAdmin === 'false' && this.state.isAgent === 'false') {
            const options = [
                {
                    "label": "User-View",
                    "value": "User-View",
                }
            ]

            this.setState({ analyticsViewOptions: options });
        }
        //Normal agent
        else if (this.state.isAgent === 'true' && this.state.isCentralPoolAgent === "false" && this.state.isTeamLead === 'false' && this.state.isCentralAdmin === 'false') {
            const options = [
                {
                    "label": "User-View",
                    "value": "User-View",
                },
                {
                    "label": "Agent-Department-View",
                    "value": "Agent-Department-View",
                },
                {
                    "label": "Agent-HelpTopic-View",
                    "value": "Agent-HelpTopic-View",
                },
            ]

            this.setState({ analyticsViewOptions: options });
        }
        else if (this.state.isCentralPoolAgent === 'true' && this.state.isAgent === 'false' && this.state.isTeamLead === 'false' && this.state.isCentralAdmin === 'false') {
            const options = [
                {
                    "label": "User-View",
                    "value": "User-View",
                },
                {
                    "label": "Agent-Department-View",
                    "value": "Agent-Department-View",
                },
                {
                    "label": "Agent-HelpTopic-View",
                    "value": "Agent-HelpTopic-View",
                },
                {
                    "label": "Central-Agent-Department-View",
                    "value": "Central-Agent-Department-View",
                },
                {
                    "label": "Central-Agent-Helptopic-View",
                    "value": "Central-Agent-Helptopic-View",
                },
                {
                    "label": "Central-Agent-Agents-View",
                    "value": "Central-Agent-Agents-View",
                },
                {
                    "label": "Central-Agent-SLA-View",
                    "value": "Central-Agent-SLA-View",
                },
                {
                    "label": "Central Agent Team Lead View",
                    "value": "Central Agent Team Lead View",
                }
            ]

            this.setState({ analyticsViewOptions: options });
        } else if (this.state.isCentralPoolAgent === 'true' && this.state.isTeamLead === 'true' && this.state.isCentralAdmin === 'false' && this.state.isAgent === 'false') {
            const options = [
                {
                    "label": "User-View",
                    "value": "User-View",
                },
                {
                    "label": "Agent-Department-View",
                    "value": "Agent-Department-View",
                },
                {
                    "label": "Agent-HelpTopic-View",
                    "value": "Agent-HelpTopic-View",
                },
                {
                    "label": "TeamLead-Department-View",
                    "value": "TeamLead-Department-View",
                },
                {
                    "label": "TeamLead-Helptopic-View",
                    "value": "TeamLead-Helptopic-View",
                },
                {
                    "label": "TeamLead-Agents-View",
                    "value": "TeamLead-Agents-View",
                },
                {
                    "label": "TeamLead-Agents-SLA-View",
                    "value": "TeamLead-Agents-SLA-View",
                },
                {
                    "label": "Team-Lead-View",
                    "value": "Team-Lead-View"
                },
                {
                    "label": "Central-Agent-Department-View",
                    "value": "Central-Agent-Department-View",
                },
                {
                    "label": "Central-Agent-Helptopic-View",
                    "value": "Central-Agent-Helptopic-View",
                },
                {
                    "label": "Central-Agent-Agents-View",
                    "value": "Central-Agent-Agents-View",
                },
                {
                    "label": "Central-Agent-SLA-View",
                    "value": "Central-Agent-SLA-View",
                },
                {
                    "label": "Central Agent Team Lead View",
                    "value": "Central Agent Team Lead View",
                }
            ]

            this.setState({ analyticsViewOptions: options });
        } else if (this.state.isCentralPoolAgent === 'true' && this.state.isTeamLead === 'true' && this.state.isCentralAdmin === 'true') {
            const options = [
                {
                    "label": "User-View",
                    "value": "User-View",
                },
                {
                    "label": "Agent-Department-View",
                    "value": "Agent-Department-View",
                },
                {
                    "label": "Agent-HelpTopic-View",
                    "value": "Agent-HelpTopic-View",
                },
                {
                    "label": "TeamLead-Department-View",
                    "value": "TeamLead-Department-View",
                },
                {
                    "label": "TeamLead-Helptopic-View",
                    "value": "TeamLead-Helptopic-View",
                },
                {
                    "label": "TeamLead-Agents-View",
                    "value": "TeamLead-Agents-View",
                },
                {
                    "label": "TeamLead-Agents-SLA-View",
                    "value": "TeamLead-Agents-SLA-View",
                },
                {
                    "label": "Team-Lead-View",
                    "value": "Team-Lead-View"
                },
                {
                    "label": "Central-Agent-Department-View",
                    "value": "Central-Agent-Department-View",
                },
                {
                    "label": "Central-Agent-Helptopic-View",
                    "value": "Central-Agent-Helptopic-View",
                },
                {
                    "label": "Central-Agent-Agents-View",
                    "value": "Central-Agent-Agents-View",
                },
                {
                    "label": "Central-Agent-SLA-View",
                    "value": "Central-Agent-SLA-View",
                },
                {
                    "label": "Central Agent Team Lead View",
                    "value": "Central Agent Team Lead View",
                }
            ]

            this.setState({ analyticsViewOptions: options });
        }

    }
    onChangeAnalyticView(e) {
        this.setState({displayTable:false});
        const obj = {
            "label": e.value,
            "value": e.value
        }
        if (e.value === "User-View") {
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable: true });
        } else if (e.value === "Agent-Department-View") {
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable1: true });
        } else if (e.value === "Agent-HelpTopic-View") {
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable2: true });
        } else if (e.value === "TeamLead-Department-View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable3: true });
        } else if (e.value === "TeamLead-Helptopic-View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable4: true });
        } else if (e.value === "TeamLead-Agents-View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable5: true });
        } else if (e.value === "TeamLead-Agents-SLA-View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable6: true });
        } else if (e.value === "Central-Agent-Department-View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable7: true });
        } else if (e.value === "Central-Agent-Helptopic-View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable8: true });
        } else if (e.value === "Central-Agent-Agents-View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable9: true });
        } else if (e.value === "Central-Agent-SLA-View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: false });
            this.setState({ showTable10: true });
        } else if (e.value === "Team-Lead-View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable12: false });
            this.setState({ showTable11: true });
        } else if (e.value === "Central Agent Team Lead View") {
            this.getMyTeams();
            this.setState({ selectedAnalyticView: obj });
            this.setState({ showTable: false });
            this.setState({ showTable1: false });
            this.setState({ showTable2: false });
            this.setState({ showTable3: false });
            this.setState({ showTable4: false });
            this.setState({ showTable5: false });
            this.setState({ showTable6: false });
            this.setState({ showTable7: false });
            this.setState({ showTable8: false });
            this.setState({ showTable9: false });
            this.setState({ showTable10: false });
            this.setState({ showTable11: false });
            this.setState({ showTable12: true });
        }


    }
    getTicketAgingAnalysis(rowData) {
        this.setState({ selectedAgingRowData: rowData });
        console.log(rowData);
        this.setState({ showTable1PopUp: true });
    }
    getTicketAgingAnalysisTable7(rowData) {
        this.setState({ selectedAgingRowData: rowData });
        console.log(rowData);
        this.setState({ showTable7PopUp: true });
    }
    getTicketAgingAnalysisTable5(rowData) {
        this.setState({ selectedAgingRowData: rowData });
        console.log(rowData);
        this.setState({ showTable5PopUp: true });
    }
    getTicketAgingAnalysisTable11(rowData) {
        this.setState({ selectedAgingRowData: rowData });
        console.log(rowData);
        this.setState({ showTable11PopUp: true });
    }
    getTicketAgingAnalysisTable12(rowData) {
        this.setState({ selectedAgingRowData: rowData });
        console.log(rowData);
        this.setState({ showTable12PopUp: true });
    }

    getTicketAgingAnalysisTable9(rowData) {
        this.setState({ selectedAgingRowData: rowData });
        console.log(rowData);
        this.setState({ showTable9PopUp: true });
    }
    onCloseTable1PopUp() {
        this.setState({ showTable1PopUp: false });
    }
    onCloseTable3PopUp() {
        this.setState({ showTable3PopUp: false });
    }
    onCloseTable5PopUp() {
        this.setState({ showTable5PopUp: false });
    }
    onCloseTable11PopUp() {
        this.setState({ showTable11PopUp: false });
    }
    onCloseTable12PopUp() {
        this.setState({ showTable12PopUp: false });
    }
    onCloseTable9PopUp() {
        this.setState({ showTable9PopUp: false });
    }
    onCloseTable7PopUp() {
        this.setState({ showTable7PopUp: false });
    }
    async getDepartmentOptions() {
        const res = await TicketDataService.getAllDepartments();
        const data = res.data;

        const options = data.map((d) => ({
            value: d.id,
            label: d.departmentName,
        }));
        this.setState({ departmentOptions: options });
    }
    async onChangeDepartment(e) {
        this.setState({ defaultDepartmentFilter: e });
        this.createUserSettingsArray(Constants.TICKET_DEPARTMENT_NAME, e);
        // this.setState({ topicId: undefined, topicName: undefined });
        //Get all helpTopic corresponding to departments
        let totalHelptopicArray = [];
        let departmentAssociatedTeams = [];
        if (e) {
            for (let i of e) {
                const dataObj = {
                    departmentId: i.value,
                };
                const res = await TicketDataService.getAllHelpTopicByDepartmentId(dataObj);
                const data = res.data;

                const options = data.map((d) => (
                    totalHelptopicArray.push({
                        value: d.id,
                        label: d.helpTopicName,
                    })
                ));

                if (this.state.showTable7 === true || this.state.showTable8 === true || this.state.showTable9 === true || this.state.showTable10 === true || this.state.showTable12 === true) {
                    const dataObj1 = {
                        departmentIds: i.value,
                    };
                    const res = await TicketDataService.getTeamsByDepartment(dataObj1);
                    const data = res.data;
                    const options1 = data.map((d) => (
                        departmentAssociatedTeams.push({
                            value: d.teamId,
                            label: d.teamName,
                        })
                    ));
                }
            }
        }


        this.setState({ helpTopicOptions: totalHelptopicArray });
        this.setState({ departmentAssociatedTeams: departmentAssociatedTeams });
        //End-Get all helpTopic corresponding to departments
        // this.setState({ depId: e.value, deptName: e.label });
    }
    async onChangeHelpTopic(e) {
        this.createUserSettingsArray(Constants.TICKET_HELPTOPIC_NAME, e);
        this.setState({ defaultHelptopicFilter: e });
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
    async getMyTeams() {
        const req = {
            teamLeadId: this.state.userId
        }
        const res = await TicketDataService.getAllTeamsOfLead(req);
        const data = res.data.data;

        const options = data.map((d) => ({
            value: d.id,
            label: d.teamName,
        }));
        this.setState({ myTeamOptions: options });

    }
    async onChangeTeams(e) {
        this.createUserSettingsArray(Constants.TEAM_NAME, e);
        this.setState({ selectedTeams: e });
        await this.getTeamLeadsByTeam(e);
    }
    onChangeTeamLead(e) {
        this.createUserSettingsArray(Constants.TEAM_LEAD_NAME, e);
        this.setState({ defaultTeamLeadFilter: e });
    }
    async getTeamLeadsByTeam(e){
        let teamIds=[];
        for(let i of e){
            teamIds.push(i.value);
        }
        const obj={
            teamIds: teamIds
        }
        const resp= await TicketDataService.findAllTeamLeadsByTeam(obj);
        console.log(resp.data);
        let leads=[];
        for(let i of resp.data){
            leads.push({label:i.fullName,value: i.id});
        }
        this.setState({teamLeads:leads});
    }
    async onChangeDepartmentAssociatedTeam(e) {
        this.createUserSettingsArray(Constants.DEPARTMENT_ASSOCIATED_TEAM_NAME, e);
        this.setState({ defaultDepartmentAssociatedTeam: e });
        await this.getTeamLeadsByTeam(e);

        let teamAssociatedAgents = [];
        if (this.state.showTable9 === true || this.state.showTable10 === true || this.state.showTable12 === true) {
            for (let i of e) {

                const dataObj1 = {
                    teamId: i.value,
                };
                const res = await TicketDataService.getAssigneeListByTeam(dataObj1);
                const data = res.data;
                const options1 = data.map((d) => (
                    teamAssociatedAgents.push({
                        value: d.id,
                        label: `${d.fullName}<${d.email}>`,
                    })
                ));
            }
        }
        this.setState({ teamAssociatedAgents: teamAssociatedAgents });
    }
    onChangeTeamAssociatedAgent(e) {
        this.createUserSettingsArray(Constants.TEAM_ASSOCIATED_AGENT_NAME, e);
        this.setState({ defaultTeamAssociatedAgent: e });
    }
    render() {
        if (!this.state.renderData) {
            return <div />; //Render component once api call's are completed.
        }
        return (
            <div id="test">
                <div style={{ marginTop: "20px" }}>
                    <h5 className="formHeading">Service Desk Analytics</h5>
                </div>
                <Row>
                    <Col xs={12} md={4} lg={4}>
                        <Form.Label className="formlabel" >Select Analytics View</Form.Label>
                        <Select
                            styles={{
                                menu: provided => ({ ...provided, zIndex: 9999 })
                            }}
                            options={this.state.analyticsViewOptions}
                            value={this.state.selectedAnalyticView}
                            onChange={this.onChangeAnalyticView.bind(this)}
                            placeholder="Select Analytic View"
                        />
                    </Col>
                </Row>
                {(this.state.showTable === true || this.state.showTable1 === true || this.state.showTable2 || this.state.showTable3 || this.state.showTable4 || this.state.showTable5 || this.state.showTable6 || this.state.showTable7 || this.state.showTable8 || this.state.showTable9 || this.state.showTable10 || this.state.showTable11 || this.state.showTable12) && <div>
                    <Row style={{ marginBottom: "10px" }}>
                        <Col xs={12} md={4} lg={4}>
                            <Form.Label className="formlabel" >Ticket Created Date Range</Form.Label><br></br>
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
                        {
                            (this.state.showTable2 === true || this.state.showTable3 === true || this.state.showTable4 === true || this.state.showTable5 || this.state.showTable6 || this.state.showTable7 || this.state.showTable8 || this.state.showTable9 || this.state.showTable10 || this.state.showTable11 || this.state.showTable12) &&
                            <Col xs={12} md={4} lg={4}>
                                <Form.Label className="formlabel required">Department</Form.Label>
                                <ReactMultiSelectCheckboxes
                                    onChange={this.onChangeDepartment.bind(this)}
                                    value={this.state.defaultDepartmentFilter}
                                    placeholderButtonLabel="Select Department"
                                    width="400px"
                                    options={this.state.departmentOptions}
                                />
                            </Col>
                        }
                        {
                            (this.state.showTable2 === true || this.state.showTable4 === true || this.state.showTable8 === true) &&
                            <Col xs={12} md={4} lg={4}>
                                <Form.Label className={this.state.showTable8?'formlabel required':"formlabel"} id="helptopic">Select HelpTopic</Form.Label>
                                <ReactMultiSelectCheckboxes
                                    options={this.state.helpTopicOptions}
                                    value={this.state.defaultHelptopicFilter}
                                    onChange={this.onChangeHelpTopic.bind(this)}
                                    placeholder="Select HelpTopic"
                                    width="400px"
                                />
                            </Col>
                        }
                        {/* {
                            (this.state.showTable2 === true || this.state.showTable3 === true || this.state.showTable4 === true || this.state.showTable5 || this.state.showTable6) &&
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
                        } */}
                        {/* {
                            (this.state.showTable2 === true || this.state.showTable4 === true || this.state.showTable5 || this.state.showTable6) &&
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
                        } */}
                        {
                            (this.state.showTable3 === true || this.state.showTable4 === true || this.state.showTable5 || this.state.showTable6 || this.state.showTable11) &&
                            <Col xs={12} md={4} lg={4}>
                                <Form.Label className="formlabel required">Select Team</Form.Label>
                                <ReactMultiSelectCheckboxes
                                    options={this.state.myTeamOptions}
                                    value={this.state.selectedTeams}
                                    onChange={this.onChangeTeams.bind(this)}
                                    placeholder="Select Team Name"
                                    width="400px"
                                />
                            </Col>
                        }
                        {
                            (this.state.showTable7 === true || this.state.showTable8 || this.state.showTable9 === true || this.state.showTable10 === true || this.state.showTable12 === true) &&
                            <Col xs={12} md={4} lg={4}>
                                <Form.Label className="formlabel required">Select Associated Team</Form.Label>
                                <ReactMultiSelectCheckboxes
                                    options={this.state.departmentAssociatedTeams}
                                    value={this.state.defaultDepartmentAssociatedTeam}
                                    onChange={this.onChangeDepartmentAssociatedTeam.bind(this)}
                                    placeholder="Select Associated Team"
                                    width="400px"
                                />
                            </Col>
                        }
                        {
                            (this.state.showTable9 === true || this.state.showTable10 === true) &&
                            <Col xs={12} md={4} lg={4}>
                                <Form.Label className="formlabel required">Select Team Agent</Form.Label>
                                <ReactMultiSelectCheckboxes
                                    options={this.state.teamAssociatedAgents}
                                    value={this.state.defaultTeamAssociatedAgent}
                                    onChange={this.onChangeTeamAssociatedAgent.bind(this)}
                                    placeholder="Select Team Agent"
                                    width="400px"
                                />
                            </Col>
                        }
                        {
                            (this.state.showTable11 === true || this.state.showTable12) &&
                            <Col xs={12} md={4} lg={4}>
                                <Form.Label className="formlabel">Select Team Lead</Form.Label>
                                <ReactMultiSelectCheckboxes
                                    options={this.state.teamLeads}
                                    value={this.state.defaultTeamLeadFilter}
                                    onChange={this.onChangeTeamLead.bind(this)}
                                    placeholder="Select Team Lead"
                                    width="400px"
                                />
                            </Col>
                        }
                        <Col xs={12} md={2} lg={2}>
                            <Form.Label style={{ visibility: "hidden" }}>Filter Tickets</Form.Label><br></br>
                            <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "left" }} variant="primary" type="submit" onClick={this.filterTickets}>
                                Filter Tickets
                            </Button>
                        </Col>
                        <Col xs={12} md={2} lg={2}>
                            <Form.Label style={{ visibility: "hidden" }}>Clear Filter</Form.Label>
                            <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "left" }} variant="primary" type="submit" onClick={this.clearFilterSetting}>
                                Clear Filter
                            </Button>
                        </Col>
                        {/* {
                            this.state.showTable === true &&
                            <Col xs={12} md={2} lg={2}>
                                <Form.Label style={{ visibility: "hidden" }}>Export</Form.Label><br></br>
                                <label style={{ float: "right", cursor: "pointer" }} onClick={this.exportData}><i style={{ fontSize: "30px" }} class="fa fa-file-excel-o" aria-hidden="true"></i></label>
                            </Col>
                        } */}
                        {/* {
                            this.state.showTable1 === true &&
                            <Col xs={12} md={2} lg={2}>
                                <Form.Label style={{ visibility: "hidden" }}>Export</Form.Label><br></br>
                                <label style={{ float: "right", cursor: "pointer" }} onClick={this.exportData1}><i style={{ fontSize: "30px" }} class="fa fa-file-excel-o" aria-hidden="true"></i></label>
                            </Col>
                        } */}
                        {/* {
                            this.state.showTable2 === true &&
                            <Col xs={12} md={2} lg={2}>
                                <Form.Label style={{ visibility: "hidden" }}>Export</Form.Label><br></br>
                                <label style={{ float:"right", cursor: "pointer" }} onClick={this.exportData2}><i style={{ fontSize: "30px" }} class="fa fa-file-excel-o" aria-hidden="true"></i></label>
                            </Col>
                        } */}

                    </Row>
                </div>}

                {this.state.showTable && this.state.displayTable && 
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                columns={this.userColumns}
                                data={this.remoteData.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Actions: (props) => {
                                        return (
                                            <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right", cursor: "pointer" }} variant="primary" type="submit" onClick={this.exportData}>
                                                Export as CSV
                                            </Button>
                                        );
                                    },
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                            />
                        </div>
                    </Fragment>
                }

                {this.state.showTable1PopUp &&
                    <Modal show={this.state.showTable1PopUp} onHide={this.onCloseTable1PopUp} keyboard={true} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header closeButton >
                            <Modal.Title style={{ color: "#26568e" }}>{this.state.selectedAgingRowData.DepartmentName} Ticket Aging Analysis</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h6>Overdue Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Overdue Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                        </Modal.Body>
                    </Modal>}
                {this.state.showTable1 && this.state.displayTable && 
                    <Fragment>
                        <div>
                            <MaterialTable
                                // title={<Row>
                                //     <div style={{ width: "1000px" }}>
                                //         <Col xs={12} md={12} lg={12}>
                                //             {/* <label style={{ fontSize: "25px" }}>Ticket Aging</label> */}
                                //             <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right", cursor: "pointer" }} variant="primary" type="submit" onClick={this.exportData1}>
                                //                 Export as CSV
                                //             </Button>
                                //         </Col>
                                //     </div>
                                // </Row>}
                                title={false}
                                columns={this.agentColumns}
                                data={this.remoteData1.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData1}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                                actions={[
                                    {
                                        icon: 'show_chart',
                                        tooltip: 'View Aging Analysis',
                                        position: 'auto',
                                        onClick: (event, rowData) => this.getTicketAgingAnalysis(rowData),
                                    },

                                ]}
                            />
                        </div>
                    </Fragment>}

                {this.state.showTable2 && this.state.displayTable &&
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                data={this.remoteData2.bind()}
                                columns={this.table2Columns}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData2}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenPercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                            />
                        </div>
                    </Fragment>}

                {this.state.showTable3PopUp &&
                    <Modal show={this.state.showTable3PopUp} onHide={this.onCloseTable3PopUp} keyboard={true} backdrop="static" size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header closeButton >
                            <Modal.Title style={{ color: "#26568e" }}>{this.state.selectedAgingRowData.DepartmentName} Ticket Aging Analysis</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h6>Overdue Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Overdue Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                        </Modal.Body>
                    </Modal>}
                {this.state.showTable3 && this.state.displayTable &&
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                columns={this.teamLeadDepartmentColumns}
                                data={this.remoteData3.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData3}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>-</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                                actions={[
                                    {
                                        icon: 'show_chart',
                                        tooltip: 'View Aging Analysis',
                                        position: 'auto',
                                        onClick: (event, rowData) => this.getTicketAgingAnalysis(rowData),
                                    }
                                ]}
                            />
                        </div>
                    </Fragment>}
                {this.state.showTable4 && this.state.displayTable &&
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                data={this.remoteData4.bind()}
                                columns={this.table4Columns}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false,
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData4}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>-</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenPercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}

                            />
                        </div>
                    </Fragment>}

                {this.state.showTable5PopUp &&
                    <Modal show={this.state.showTable5PopUp} onHide={this.onCloseTable5PopUp} keyboard={true} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header closeButton >
                            <Modal.Title style={{ color: "#26568e" }}>{this.state.selectedAgingRowData.DepartmentName} Ticket Aging Analysis</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h6>Overdue Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Overdue Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                        </Modal.Body>
                    </Modal>}
                {this.state.showTable5 && this.state.displayTable && 
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                columns={this.teamLeadAgentsColumns}
                                data={this.remoteData5.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData5}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                                actions={[
                                    {
                                        icon: 'show_chart',
                                        tooltip: 'View Aging Analysis',
                                        position: 'auto',
                                        onClick: (event, rowData) => this.getTicketAgingAnalysisTable5(rowData),
                                    }
                                ]}
                            />
                        </div>
                    </Fragment>}

                {this.state.showTable6 && this.state.displayTable &&
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                columns={this.teamLeadAgentSLAColumns}
                                data={this.remoteData6.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData6}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>

                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                            />
                        </div>
                    </Fragment>
                }

                {this.state.showTable7PopUp &&
                    <Modal show={this.state.showTable7PopUp} onHide={this.onCloseTable7PopUp} keyboard={true} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header closeButton >
                            <Modal.Title style={{ color: "#26568e" }}>{this.state.selectedAgingRowData.DepartmentName} Ticket Aging Analysis</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h6>Overdue Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Overdue Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                        </Modal.Body>
                    </Modal>}
                {this.state.showTable7 && this.state.displayTable && 
                    <Fragment>
                        <div>
                            <MaterialTable

                                title={false}
                                columns={this.centralAgentDepartmentColumns}
                                data={this.remoteData7.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData7}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                                actions={[
                                    {
                                        icon: 'show_chart',
                                        tooltip: 'View Aging Analysis',
                                        position: 'auto',
                                        onClick: (event, rowData) => this.getTicketAgingAnalysisTable7(rowData),
                                    }
                                ]}
                            />
                        </div>
                    </Fragment>}
                {this.state.showTable8 && this.state.displayTable &&
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                data={this.remoteData8.bind()}
                                columns={this.table8Columns}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false,
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData8}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenPercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}

                            />
                        </div>
                    </Fragment>}
                {this.state.showTable9PopUp &&
                    <Modal show={this.state.showTable9PopUp} onHide={this.onCloseTable9PopUp} keyboard={true} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header closeButton >
                            <Modal.Title style={{ color: "#26568e" }}>{this.state.selectedAgingRowData.DepartmentName} Ticket Aging Analysis</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h6>Overdue Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Overdue Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                        </Modal.Body>
                    </Modal>}
                {this.state.showTable9 && this.state.displayTable && 
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                columns={this.teamLeadAgentsColumns}
                                data={this.remoteData9.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData9}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                                actions={[
                                    {
                                        icon: 'show_chart',
                                        tooltip: 'View Aging Analysis',
                                        position: 'auto',
                                        onClick: (event, rowData) => this.getTicketAgingAnalysisTable9(rowData),
                                    }
                                ]}
                            />
                        </div>
                    </Fragment>}
                {this.state.showTable10 && this.state.displayTable &&
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                columns={this.teamLeadAgentSLAColumns}
                                data={this.remoteData10.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData10}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>

                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                            />
                        </div>
                    </Fragment>
                }
                {this.state.showTable11PopUp &&
                    <Modal show={this.state.showTable11PopUp} onHide={this.onCloseTable11PopUp} keyboard={true} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header closeButton >
                            <Modal.Title style={{ color: "#26568e" }}>Ticket Aging Analysis</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h6>Overdue Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Overdue Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                        </Modal.Body>
                    </Modal>}
                {this.state.showTable11 && this.state.displayTable &&
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                columns={this.table11Columns}
                                data={this.remoteData11.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData11}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                                actions={[
                                    {
                                        icon: 'show_chart',
                                        tooltip: 'View Aging Analysis',
                                        position: 'auto',
                                        onClick: (event, rowData) => this.getTicketAgingAnalysisTable11(rowData),
                                    }
                                ]}
                            />
                        </div>
                    </Fragment>}
                    {this.state.showTable12PopUp &&
                    <Modal show={this.state.showTable12PopUp} onHide={this.onCloseTable12PopUp} keyboard={true} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header closeButton >
                            <Modal.Title style={{ color: "#26568e" }}>Ticket Aging Analysis</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h6>Overdue Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Overdue Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.OverdueAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In Numbers</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                            <h6>Closed Tickets In %</h6>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>0 Day</th>
                                        <th>1 Day</th>
                                        <th>2 Days</th>
                                        <th>3 Days</th>
                                        <th>4 Days</th>
                                        <th>5 Days</th>
                                        <th>6 Days</th>
                                        <th>7 Days</th>
                                        <th>{'>7'} Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].zeroday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].oneday_percentage}

                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].twoday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].threeday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fourday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].fiveday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sixday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenday_percentage}
                                        </td>
                                        <td>
                                            {this.state.selectedAgingRowData.ClosedAging[0].sevenplusday_percentage}

                                        </td>

                                    </tr>
                                </tbody>
                            </Table><br></br>
                        </Modal.Body>
                    </Modal>}
                {this.state.showTable12 && this.state.displayTable &&
                    <Fragment>
                        <div>
                            <MaterialTable
                                title={false}
                                columns={this.table12Columns}
                                data={this.remoteData12.bind()}
                                tableRef={this.tableRef}
                                options={{
                                    actionsColumnIndex: 10,
                                    paging: false,
                                    exportButton: false,
                                    showSelectAllCheckbox: false,
                                    toolbar: true,
                                    showFirstLastPageButtons: false,
                                    showTitle: true,
                                    selection: false,
                                    maxBodyHeight: '450px',
                                    padding: "dense",
                                    pageSize: 20,
                                    search: false,
                                    headerStyle: {
                                        backgroundColor: '#1f3143',
                                        color: '#FFD800',
                                        fontWeight: "bold",
                                        zIndex: "1"
                                    },
                                    selectionProps: rowData => ({
                                        color: 'default'
                                    }),
                                    showTextRowsSelected: false
                                }}
                                components={{
                                    Toolbar: (props) => <div style={{ display: "flex", flexDirection: "row" }}>
                                        <MTableToolbar {...props} />
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143", cursor: "pointer", marginLeft: "85%", maxHeight: "40px", marginTop: "13px" }} variant="primary" type="submit" onClick={this.exportData12}>
                                            Export as CSV
                                        </Button>
                                    </div>,
                                    Body: (props) => (
                                        <>
                                            <MTableBody {...props} />
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>A</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOpenTotal}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverdueCount}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandClosedPercentage}</TableCell>
                                                    <TableCell style={{ fontSize: "16px", fontWeight: "bold", color: "black" }} colSpan={1}>{this.state.GrandOverDuePercentage}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </>
                                    )

                                }}
                                actions={[
                                    {
                                        icon: 'show_chart',
                                        tooltip: 'View Aging Analysis',
                                        position: 'auto',
                                        onClick: (event, rowData) => this.getTicketAgingAnalysisTable12(rowData),
                                    }
                                ]}
                            />
                        </div>
                    </Fragment>}
            </div>
        );
    }
}

export default TicketAging;
