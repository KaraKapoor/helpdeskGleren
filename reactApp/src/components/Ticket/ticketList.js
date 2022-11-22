import React, { Component } from "react";
import MaterialTable from "material-table";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row } from "react-bootstrap";
import Select from "react-select";
import "../Ticket/addTicket.css";
import { toast } from 'react-toastify';
import * as Constants from "../Shared/constants";
import Moment, { locale } from 'moment';
import { Link } from "react-router-dom";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as url from "../../http-common";
import { Fragment } from "react";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
class TicketList extends Component {
  tableRef = React.createRef();
  constructor(props) {
    super(props);
    this.onTicketSelectionChange = this.onTicketSelectionChange.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onChangeTicketStatus = this.onChangeTicketStatus.bind(this);
    this.bulkUpdate = this.bulkUpdate.bind(this);
    this.onChangeFilteringTicketStatus = this.onChangeFilteringTicketStatus.bind(this);
    this.remoteData = this.remoteData.bind(this);
    this.filterTickets = this.filterTickets.bind(this);
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.onApplyDateRange = this.onApplyDateRange.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
    this.exportData = this.exportData.bind(this);
    this.onChangeOverDue = this.onChangeOverDue.bind(this);
    this.handleClosedDateRangeChange = this.handleClosedDateRangeChange.bind(this);
    this.saveFilterSetting=this.saveFilterSetting.bind(this);
    this.clearFilterSetting=this.clearFilterSetting.bind(this);
    this.savePageLocation=this.savePageLocation.bind(this);
    this.showClosedDataRange=false;
    this.state = {
      userOptions: [],
      statusOptions: [],
      statusOptionsForUser:[],
      filteringTicketStatusOptions: [],
      overDueOptions: [],
      statusId: 0,
      isAgent: null,
      userId: "",
      ticketStatus: "",
      arrayOfSelectedId: [],
      tableTitle: "All",
      start: Moment().subtract(29, 'days'),
      end: Moment(),
      closedStart: Moment().subtract(29, 'days'),
      closedEnd: Moment(),
      locale: { 'format': 'DD/MM/YYYY' },
      departmentOptions: [],
      depId:undefined,
      currentPageTickets:[],
      userFilterSettings:[],
      defaultTicketStatus:[],
      defaultDepartmentFilter:{},
      renderData:false,
      defaultOverdueFilter:{},
      hideButtons:false
    };
    this.columns = [
      {
        title: "Ticket Number", field: "id",
        render: rowData => <Link to={`/viewTicket/id:${rowData.id}`} onClick={this.savePageLocation}>{rowData.id}</Link>
      },
      { title: "Created Date", field: "initialCreatedDate" },
      { title: "Branch", field: "branch" },
      { title: "Subject", field: "subject" },
      { title: "Department", field: "departmentName" },
      { title: "Assignee", field: "assigneeFullName" },
      { title: "Ticket Status", field: "ticketStatus" },
      { title: "Initial Due Date", field: "level1DueDate" },
      { title: "Sch/Col", field: "schCol" },
      { title: "From", field: "fullName" },
      { title: "Mobile",field:"userMobile"},
      { title: "Closed Date", field: "closedDate" },
      { title: "Closed By", field: "closedBy" }
    ];
    this.state.userId = sessionStorage.getItem("userId");
    this.filterTicketStatus=[];
  }

  componentDidMount() {
    // var currentUrl = window.location.href;
    // let url = new URL(currentUrl);
    // let params = new URLSearchParams(url.search.slice(1));
    // for (let pair of params.entries()) {
    //   sessionStorage.setItem(pair[0], pair[1]);
    // }

    this.getUserOptions();
    this.getTicketStatus();
    this.getUserDetails();
    this.getFilteringTicketStatus();
    this.getTicketStatusForUser();
    this.getDepartmentOptions();
    this.getOverDueOptions();

    this.getUserFilterSettings();
  }

  showErrorToast = () => {
    toast.error("Some error occurred while saving!", {
      position: toast.POSITION.TOP_CENTER,
      className: "error-toast"
    });
  };
  showSuccessToast = () => {
    toast.success("Ticket saved successfully", {
      position: toast.POSITION.TOP_CENTER,
      className: "success-toast"
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

  savePageLocation(){
    sessionStorage.setItem("previousPageLocation", "/ticket");
  }

  getTicketStatus() {
    const options = [
      {
        value: 1,
        label: "Open",
      },
      {
        value: 2,
        label: "Awaiting for user response",
      },
      {
        value: 3,
        label: "Assigned to an engineer",
      },
      {
        value: 4,
        label: "Indent at Branch approval",
      },
      {
        value: 5,
        label: "Indent at DM approval",
      },
      {
        value: 6,
        label: "Indent at CO approval",
      },
      {
        value: 7,
        label: "Branch dependent",
      },
      {
        value: 8,
        label: "Warehouse dependent",
      },
      {
        value: 9,
        label: "Vendor dependent",
      },
      {
        value: 10,
        label: "Work in progress",
      },
      {
        value: 11,
        label: "Escalated to Next level",
      },
      {
        value: 12,
        label: "Resolved",
      },
      {
        value: 13,
        label: "Closed",
      }
    ];
    this.setState({ statusOptions: options });
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

  getTicketStatusForUser() {
    const options = [
      {
        value: 1,
        label: "Closed",
      },
      {
        value: 2,
        label: "Re-Open",
      }
    ];
    this.setState({ statusOptionsForUser: options });
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
  async getDepartmentOptions() {
    const res = await TicketDataService.getAllDepartments();
    const data = res.data;

    const options = data.map((d) => ({
      value: d.id,
      label: d.departmentName,
    }));
    options.push({value:"All",label:"All"});
    this.setState({ departmentOptions: options });
  }

  async onChangeTicketStatus(e) {
    console.log(e);
    await this.setState({ statusId: e.value, ticketStatus: e.label }, () => {
      console.log(this.state.statusId);
      console.log(this.state.ticketStatus);

    });
    // if(e.label==="Re-open"){
    //   await this.setState({ statusId: e.value, ticketStatus: "Open" }, () => {
    //     console.log(this.state.statusId);
    //     console.log(this.state.ticketStatus);
  
    //   });
    // }else{
    //   await this.setState({ statusId: e.value, ticketStatus: e.label }, () => {
    //     console.log(this.state.statusId);
    //     console.log(this.state.ticketStatus);
  
    //   });
    // }
    
    // this.setState({ statusId: e.value, ticketStatus: e.label });
    // console.log(this.state.statusId);
    // console.log(this.state.ticketStatus);
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
      else if (this.filterTicketStatus.includes("Open") && !this.filterTicketStatus.includes("Resolved","Closed") && !currentlySelectedStatus.includes("Open")) {
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

  handleClosedDateRangeChange(event, picker) {
    this.createUserSettingsArray(Constants.TICKET_CLOSED_DATE_RANGE,picker);
    this.setState({ closedStart: picker.startDate });
    this.setState({ closedEnd: picker.endDate });
  }
   onChangeOverDue(e) {
    this.createUserSettingsArray(Constants.TICKET_OVERDUE,e);
    console.log(e);
    this.setState({ overdue: e.label })

  }

  async getUserOptions() {
    const res = await TicketDataService.getAllUser();
    const data = res.data;

    const options = data.map((d) => ({
      value: d.id,
      label: d.fullName,
    }));

    this.setState({ userOptions: options });
  }

  getUserDetails() {
    const obj = {
      id: this.state.userId,
    }
    TicketDataService.getUserDetails(obj)
      .then((response) => {
        this.setState({ isAgent: response.data.isAgent });
      })

  }

  onChangeUser(e) {
    this.state.userId = e.value;
    this.setState({ assigneeId: e.value, assigneeFullName: e.label });
  }
  async onChangeDepartment(e) {
    this.createUserSettingsArray(Constants.TICKET_DEPARTMENT_NAME,e);
    this.setState({ depId: e.value, deptName: e.label });
  }
  onTicketSelectionChange(e) {
    const arrayOfId = []
    for (var i of e) {
      arrayOfId.push(i.id);
    }
    this.setState({ arrayOfSelectedId: arrayOfId });
    // console.log("ArrayOfId" + arrayOfId);
    // this.setState({ userId: e.value, userName: e.label });
  }
  async bulkUpdate() {

    //Validations Starts
    if (this.state.arrayOfSelectedId <= 0) {
      return this.showWarningToast("Please select atleast one ticket.");
    }
    if (!this.state.ticketStatus && !this.state.assigneeFullName) {
      return this.showWarningToast("Please select Ticket Status and/or Assignee");
    }

    for(let i of this.state.currentPageTickets){
      for(let j of this.state.arrayOfSelectedId){
        if(i.id===j && i.ticketStatus===this.state.ticketStatus){
          return this.showWarningToast("Ticket" +" "+i.id +" " + "already present in same status");
        }
      }
    }
    //Validations Ends
    var data = {
      ticketStatus: this.state.ticketStatus,
      id: this.state.arrayOfSelectedId,
      assigneeFullName: this.state.assigneeFullName,
      assigneeId: this.state.assigneeId,
      userId: sessionStorage.getItem("userId"),
      userMobile: sessionStorage.getItem("mobile")

    };
    await TicketDataService.bulkUpdateTicketStatusAndAssignee(data)
      .then((response) => {
        console.log(response.data);
        this.showSuccessToast();
        // ReactDOM.findDOMNode(this.messageForm).reset();
      })
      .catch((e) => {
        this.showErrorToast();
        console.log(e);
      });
    window.location.reload(false);
    console.log("status" + data.ticketStatus);
    console.log("arrayOFId" + data.id);
  }
  async exportData() {
    let departmentId=this.state.depId;
    let ticketStatus=this.filterTicketStatus;
    let helpTopicId=undefined;//Currently this filter is not added.
    let assigneeId=undefined;//Currently this filter is not added.
    //Starts-Process Date
    let startDate = new Date(this.state.start);
    startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
    startDate = startDate.toISOString();

    let endDate = new Date(this.state.end);
    endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
    endDate = endDate.toISOString();
    //End-Process Date

    //Starts-Process Closed Date Range
    let ClosedStartDate=undefined;
    let ClosedEndDate=undefined;
    if(this.showClosedDataRange){
      ClosedStartDate = new Date(this.state.closedStart);
      ClosedStartDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
      ClosedStartDate = ClosedStartDate.toISOString();
  
      ClosedEndDate = new Date(this.state.closedEnd);
      ClosedEndDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
      ClosedEndDate = ClosedEndDate.toISOString();
    }else{
      ClosedStartDate=undefined;
      ClosedEndDate=undefined; 
    }
    
    //End-Process Closed Date Range

    this.state.exportDataDownloadLink=url.baseURL + `/api/dataExport/downloadMyTickets/?departmentId=${departmentId}&ticketStatus=${ticketStatus}&startDate=${startDate}&endDate=${endDate}&loggedInUserId=${this.state.userId}&isTicketOverdue=${this.state.overdue}&closedStartDate=${ClosedStartDate}&closedEndDate=${ClosedEndDate}`;
    // window.open(this.state.exportDataDownloadLink);
    window.location.href = this.state.exportDataDownloadLink;
  }
  async filterTickets() {
    this.setState({ tableTitle: 'Tickets' });
    console.log(this.tableRef.current.state.query);
    this.tableRef.current.state.query.page = 0;
    this.tableRef.current.state.query.pageSize = 20;
    this.tableRef.current && this.tableRef.current.onQueryChange();
  }
  async remoteData(query, status) {
    let data;
    let pageNumber;
    let pageCount;
    let ticketStatus = this.filterTicketStatus;
    let departmentId=this.state.depId;
    let isTicketOverdue= this.state.overdue;
    let orderDirection=query.orderDirection;
    let orderBy=undefined;
    if(query.orderBy){
      orderBy=query.orderBy.field;
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
    let ClosedStartDate=undefined;
    let ClosedEndDate=undefined;
    if(this.showClosedDataRange){
      ClosedStartDate = new Date(this.state.closedStart);
      ClosedStartDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
      ClosedStartDate = ClosedStartDate.toISOString();
  
      ClosedEndDate = new Date(this.state.closedEnd);
      ClosedEndDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
      ClosedEndDate = ClosedEndDate.toISOString();
    }else{
      ClosedStartDate=undefined;
      ClosedEndDate=undefined; 
    }
    
    //End-Process Closed Date Range

    await TicketDataService.getTicketsWithPagination(query.pageSize, query.page, query.search, sessionStorage.getItem("userId"), ticketStatus, startDate, endDate,departmentId,isTicketOverdue,ClosedStartDate,ClosedEndDate,orderDirection,orderBy)
      .then(async (response) => {
        let result = response.data;
        //Change the date format before showing in the table 
        for (var i of result.tickets) {
          // i.createdAt = "TEST";
          i.createdAt = Moment(i.createdAt).format('DD/MM/YYYY hh:mm A');
          i.initialCreatedDate = Moment(i.initialCreatedDate).format('DD/MM/YYYY hh:mm A');
          i.userMobile=i.user.mobile;
          i.departmentName = i.department.departmentName;
          i.closedBy=i.closedBy;
          if (i.level1DueDate !== null) {
            i.level1DueDate = Moment(i.level1SlaDue).format('DD/MM/YYYY hh:mm A');
          }


          if (i.closedDate !== null) {
            i.closedDate = Moment(i.closedDate).format('DD/MM/YYYY hh:mm A');
          }
        }
        // Date processing end.
        /*Read the subject field from dynamicFormJson and insert new key subject in response used in showing subject in tickets list.*/
        for (var i of result.tickets) {
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
        data = result.tickets;
        pageNumber = result.currentPage;
        pageCount = result.totalItems;
        this.setState({currentPageTickets:result.tickets});
      })
    return Promise.resolve(
      {
        data: data,
        page: pageNumber,
        totalCount: pageCount
      }
    );
  }
  handleDateRangeChange(event, picker) {
    console.log(picker.startDate);
    this.createUserSettingsArray(Constants.TICKET_CREATED_DATE_RANGE,picker);
    this.setState({ start: picker.startDate });
    this.setState({ end: picker.endDate });
  }

  onApplyDateRange(event, picker) {
    const diffTime = Math.abs(picker.endDate - picker.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 180) {
      this.setState({ hideButtons: true });
      this.showWarningToast(Constants.LBL_6_MONTHS_DATE_RANGE_MESSAGE);
    } else {
      this.setState({ hideButtons: false });
    }
  }
  async saveFilterSetting(){
    await TicketDataService.saveFilterSettings(this.state.userFilterSettings)
    .then((resp)=>{
      console.log(resp);
    })
  }

  clearFilterSetting(){
    const obj={
      settingType:Constants.MY_TICKETS_FILTERS,
      userId:this.state.userId
    }
    TicketDataService.clearUserSettings(obj).
    then((resp)=>{
      this.showSuccessToast(Constants.LBL_CLEAR_FILTER_MESSAGE);
      window.location.reload();
    })
  }

  createUserSettingsArray(settingName, settingValue) {

    switch (settingName) {
      case Constants.TICKET_STATUS:{
        if (settingValue === null) {
          const obj = {
            userId: this.state.userId,
            settingType: Constants.MY_TICKETS_FILTERS,
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
            settingType: Constants.MY_TICKETS_FILTERS,
            settingValue: settingValueArray,
            settingName: settingName,
          }
          this.state.userFilterSettings.push(obj);
          this.saveFilterSetting();//Auto Save in backend.
        }
        break;
      }
      case Constants.TICKET_DEPARTMENT_NAME:{
        const obj = {
          userId: this.state.userId,
          settingType: Constants.MY_TICKETS_FILTERS,
          settingValue: settingValue,
          settingName: settingName,
        }
        this.state.userFilterSettings.push(obj);
        this.saveFilterSetting();//Auto Save in backend.
        break;

      }
      case Constants.TICKET_OVERDUE:{
        const obj={
          userId: this.state.userId,
          settingType: Constants.MY_TICKETS_FILTERS,
          settingValue: settingValue,
          settingName: settingName,
        }
        this.state.userFilterSettings.push(obj);
        this.saveFilterSetting();//Auto Save in backend.
        break;
      }
      case Constants.TICKET_CREATED_DATE_RANGE:{
        const obj={
          userId: this.state.userId,
          settingType: Constants.MY_TICKETS_FILTERS,
          settingValue: {
            startDate:settingValue.startDate,
            endDate:settingValue.endDate
          },
          settingName: settingName,
        }
        this.state.userFilterSettings.push(obj);
        this.saveFilterSetting();//Auto Save in backend.
        break;
      }
      case Constants.TICKET_CLOSED_DATE_RANGE:{
        const obj={
          userId: this.state.userId,
          settingType: Constants.MY_TICKETS_FILTERS,
          settingValue: {
            closedStart:settingValue.startDate,
            closedEnd:settingValue.endDate
          },
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
      settingType: Constants.MY_TICKETS_FILTERS,
      userId: this.state.userId
    }

    TicketDataService.getUserSettingsByType(obj).
      then((resp) => {
        if (resp.data.data) {
          this.setState({ userFilterSettings: resp.data.data });
          for (let i of resp.data.data) {
            switch (i.settingName) {
              case Constants.TICKET_STATUS:{
                this.setState({ defaultTicketStatus: i.settingValue });
                for (let j of i.settingValue) {
                  this.filterTicketStatus.push(j.label);
                  if (j.label === 'Closed') {
                    this.showClosedDataRange = true;
                  }else{
                    this.showClosedDataRange=false;
                  }
                }
                break;
              }
              case Constants.TICKET_DEPARTMENT_NAME:{
                this.setState({ defaultDepartmentFilter: i.settingValue });
                this.setState({ depId: i.settingValue.value, deptName: i.settingValue.label });
                break;
              }
              case Constants.TICKET_OVERDUE:{
                this.setState({defaultOverdueFilter:i.settingValue});
                this.setState({overdue:i.settingValue.label});
                break;
              }
              case Constants.TICKET_CREATED_DATE_RANGE:{
                this.setState({start:Moment(i.settingValue.startDate)});
                this.setState({end:Moment(i.settingValue.endDate)});
                break;
              }
              case Constants.TICKET_CLOSED_DATE_RANGE:{
                this.setState({closedStart:Moment(i.settingValue.closedStart)});
                this.setState({closedEnd:Moment(i.settingValue.closedEnd)});
                break;
              }

            }
          }
        }
        this.setState({renderData:true});
        this.filterTickets();
      })
  }
  render() {
    if (!this.state.renderData) {
      return <div />; //Render component once api call's are completed.
    }
    return (
      <div id="test">
        <div style={{ marginTop: "20px" }}>
          <h5 className="formHeading">Tickets List</h5>
        </div>
        {
          <div >
            {
              <Fragment>
                <Row>
                <Col xs={12} md={3} lg={3}>
                  <Form.Label className="formlabel">Select Status</Form.Label>
                  {/* <Select
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 })
                    }}
                    options={this.state.filteringTicketStatusOptions}
                    isMulti='true'
                    onChange={(e) => {
                      this.onChangeFilteringTicketStatus(e);
                  }}
                    placeholder="Select status"
                  /> */}
                    <ReactMultiSelectCheckboxes
                      onChange={(e) => {
                        this.onChangeFilteringTicketStatus(e);
                      }}
                      placeholderButtonLabel="Select Status"
                      width="400px"
                      options={this.state.filteringTicketStatusOptions}
                      value= {this.state.defaultTicketStatus}
                      // defaultValue={this.state.defaultTicketStatus}
                    />
                </Col>
                <Col xs={12} md={3} lg={3}>
                  <Form.Label className="formlabel" >Created Date Range</Form.Label><br></br>
                  <DateRangePicker
                    onEvent={this.handleDateRangeChange.bind()}
                    onApply={this.onApplyDateRange.bind()}
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
                        // 'Last 1 Year': [
                        //   Moment().subtract(12, 'month').startOf('month').toDate(),
                        //   Moment().toDate(),
                        // ],
                      },
                    }}>
                    <input type="text" className="form-control" />
                  </DateRangePicker>
                </Col>
                <Col xs={12} md={3} lg={3}>
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
                <Col xs={12} md={3} lg={3}>
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
                {
                  this.showClosedDataRange===true && 
                  <Col xs={12} md={3} lg={3}>
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
                <Col xs={12} md={1} lg={2}>
                  <Form.Label style={{ visibility: "hidden" }} >Change</Form.Label>
                  <Button disabled={this.state.hideButtons} style={{ color: "#fff", backgroundColor: "#1f3143",float:"left" }} variant="primary" type="submit" onClick={this.filterTickets}>
                    Filter Tickets
              </Button>
                </Col>
                <Col xs={12} md={1} lg={1}>
                <Form.Label style={{ visibility: "hidden" }}>Export</Form.Label>
                <Button disabled={this.state.hideButtons} style={{ color: "#fff", backgroundColor: "#1f3143",float: "left"}} variant="primary" type="submit" onClick={this.exportData}>
                  Export
              </Button>
              </Col>
                  <Col xs={12} md={2} lg={2}>
                    <Form.Label style={{ visibility: "hidden" }}>Clear Filter</Form.Label>
                    <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.clearFilterSetting}>
                      Clear Filter
                    </Button>
                  </Col>
              </Row>
              </Fragment>
              
            }
            <Row style={{ marginTop: "10px" }}>
              <Col xs={12} md={6} lg={6}>
                <Form.Label className="formlabel">Change Status</Form.Label>
                {
                  this.state.isAgent==="true" &&
                <Select
                  styles={{
                    // Fixes the overlapping problem of the component
                    menu: provided => ({ ...provided, zIndex: 9999 })
                  }}
                  options={this.state.statusOptions}
                  onChange={this.onChangeTicketStatus.bind(this)}
                  placeholder="Select status"
                />
                }
                {
                  this.state.isAgent!=="true" &&
                <Select
                  styles={{
                    // Fixes the overlapping problem of the component
                    menu: provided => ({ ...provided, zIndex: 9999 })
                  }}
                  options={this.state.statusOptionsForUser}
                  onChange={this.onChangeTicketStatus.bind(this)}
                  placeholder="Select status"
                />
                }
              </Col>
              {/* <Col>
              <Form.Label className="formlabel">Assign To</Form.Label>
              <Select
                styles={{
                  // Fixes the overlapping problem of the component
                  menu: provided => ({ ...provided, zIndex: 9999 })
                }}
                options={this.state.userOptions}
                onChange={this.onChangeUser.bind(this)}
                placeholder="Select a assignee"
              />
            </Col> */}
              <Col xs={12} md={6} lg={6}>
                <Form.Label style={{ visibility: "hidden" }}>Change Status</Form.Label><br></br>
                <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.bulkUpdate}>
                  Update
              </Button>
              </Col>
            </Row>

          </div>
        }
        <MaterialTable
          title={"Tickets"}
          columns={this.columns}
          data={this.remoteData.bind()}
          tableRef={this.tableRef}
          options={{
            exportButton: false,
            showSelectAllCheckbox: true,
            toolbar: true,
            showFirstLastPageButtons: false,
            showTitle: true,
            selection: true,
            maxBodyHeight: '450px',
            // toolbarButtonAlignment: "right",
            // searchFieldAlignment: "right",
            // filtering: true,
            padding: "dense",
            pageSize: 20,
            headerStyle: {
              backgroundColor: '#1f3143',
              color: '#FFD800',
              fontWeight: "bold",
              zIndex:"1"
            },
            selectionProps: rowData => ({
              color: 'default'
            }),
            showTextRowsSelected: false
          }}
          onSelectionChange={(e) => {
            this.onTicketSelectionChange(e);
          }}
        />

      </div>
    );
  }
}

export default TicketList;
