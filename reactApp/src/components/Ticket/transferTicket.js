import React, { Component } from "react";
import MaterialTable from "material-table";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row } from "react-bootstrap";
import Select from "react-select";
import "../Ticket/addTicket.css";
import { toast } from 'react-toastify';
import Moment, { locale } from 'moment';
import { Link } from "react-router-dom";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as url from "../../http-common";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import * as Constants from "../Shared/constants";
class TransferTicket extends Component {
  tableRef = React.createRef();
  constructor(props) {
    super(props);
    this.onChangeFilteringTicketStatus = this.onChangeFilteringTicketStatus.bind(this);
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.onApplyDateRange = this.onApplyDateRange.bind(this);
    this.remoteData = this.remoteData.bind(this);
    this.filterTickets = this.filterTickets.bind(this);
    this.exportData = this.exportData.bind(this);
    this.saveFilterSetting = this.saveFilterSetting.bind(this);
    this.clearFilterSetting = this.clearFilterSetting.bind(this);
    this.savePageLocation=this.savePageLocation.bind(this);
    this.state = {
      filteringTicketStatusOptions: [],
      tableTitle: "All",
      start: Moment().subtract(29, 'days'),
      end: Moment(),
      locale: { 'format': 'DD/MM/YYYY' },
      userFilterSettings: [],
      defaultTicketStatus: [],
      renderData: false,
      userId: "",
      hideButtons:false
    };
    this.columns = [
      {
        title: "Ticket Number", field: "id",
        render: rowData => <Link to={`/viewTransferTicket/id:${rowData.id}`} onClick={this.savePageLocation}>{rowData.id}</Link>
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
      { title: "Mobile", field: "mobile" },
      { title: "Closed Date", field: "closedDate" },
      { title: "Closed By", field: "closedBy" },
    ];
    this.filterTicketStatus = [];
    this.state.userId = sessionStorage.getItem("userId");
  }

  componentDidMount() {
    this.getFilteringTicketStatus();
    this.getUserFilterSettings();
  }

  showErrorToast = () => {
    toast.error("Some error occurred while saving!", {
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
  savePageLocation(){
    sessionStorage.setItem("previousPageLocation", "/transferRequest");
  }
  async remoteData(query, status) {
    let data;
    let pageNumber;
    let pageCount;
    let ticketStatus = this.filterTicketStatus;
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
    await TicketDataService.getTransferTickets(query.pageSize, query.page, query.search, ticketStatus, startDate, endDate, orderDirection, orderBy)
      .then(async (response) => {
        let result = response.data;
        //Change the date format before showing in the table 
        for (var i of result.tickets) {
          // i.createdAt = "TEST";
          i.createdAt = Moment(i.createdAt).format('DD/MM/YYYY hh:mm A');
          i.initialCreatedDate = Moment(i.initialCreatedDate).format('DD/MM/YYYY hh:mm A');
          i.departmentName = i.department.departmentName;
          i["mobile"] = i.user.mobile;
          i["closedBy"] = i.closedBy;
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
    let ticketStatus = this.filterTicketStatus;
    let userEmail = sessionStorage.getItem("email");
    //Starts-Process Date
    let startDate = new Date(this.state.start);
    startDate.setHours(0, 0, 0, 0);   // Set hours, minutes and seconds
    startDate = startDate.toISOString();

    let endDate = new Date(this.state.end);
    endDate.setHours(23, 59, 59, 999);   // Set hours, minutes and seconds
    endDate = endDate.toISOString();
    //End-Process Date
    this.state.exportDataDownloadLink = url.baseURL + `/api/dataExport/downloadTransferTickets/?ticketStatus=${ticketStatus}&startDate=${startDate}&endDate=${endDate}&loggedInUserEmail=${userEmail}`;
    window.location.href = this.state.exportDataDownloadLink;
    // window.open(this.state.exportDataDownloadLink);
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

  }
  handleDateRangeChange(event, picker) {
    this.createUserSettingsArray(Constants.TICKET_CREATED_DATE_RANGE, picker);
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

  async filterTickets() {
    this.setState({ tableTitle: 'Tickets' });
    console.log(this.tableRef.current.state.query);
    this.tableRef.current.state.query.page = 0;
    this.tableRef.current.state.query.pageSize = 20;
    this.tableRef.current && this.tableRef.current.onQueryChange();
  }
  async saveFilterSetting() {
    await TicketDataService.saveFilterSettings(this.state.userFilterSettings)
      .then((resp) => {
        console.log(resp);
      })
  }

  clearFilterSetting() {
    const obj = {
      settingType: Constants.TRANSFER_TICKETS_FILTERS,
      userId: this.state.userId
    }
    TicketDataService.clearUserSettings(obj).
      then((resp) => {
        this.showSuccessToast(Constants.LBL_CLEAR_FILTER_MESSAGE);
        window.location.reload();
      })
  }

  createUserSettingsArray(settingName, settingValue) {

    switch (settingName) {
      case Constants.TICKET_STATUS: {
        if (settingValue === null) {
          const obj = {
            userId: this.state.userId,
            settingType: Constants.TRANSFER_TICKETS_FILTERS,
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
            settingType: Constants.TRANSFER_TICKETS_FILTERS,
            settingValue: settingValueArray,
            settingName: settingName,
          }
          this.state.userFilterSettings.push(obj);
          this.saveFilterSetting();//Auto Save in backend.
        }
        break;
      }
      case Constants.TICKET_CREATED_DATE_RANGE: {
        const obj = {
          userId: this.state.userId,
          settingType: Constants.TRANSFER_TICKETS_FILTERS,
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

    }
  }

  getUserFilterSettings() {
    const obj = {
      settingType: Constants.TRANSFER_TICKETS_FILTERS,
      userId: this.state.userId
    }

    TicketDataService.getUserSettingsByType(obj).
      then((resp) => {
        if (resp.data.data) {
          this.setState({ userFilterSettings: resp.data.data });
          for (let i of resp.data.data) {
            switch (i.settingName) {
              case Constants.TICKET_STATUS: {
                this.setState({ defaultTicketStatus: i.settingValue });
                for (let j of i.settingValue) {
                  this.filterTicketStatus.push(j.label);
                }
                break;
              }
              case Constants.TICKET_CREATED_DATE_RANGE: {
                this.setState({ start: Moment(i.settingValue.startDate) });
                this.setState({ end: Moment(i.settingValue.endDate) });
                break;
              }
            }
          }
        }
        this.setState({ renderData: true });
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
          <h5 className="formHeading">Transfer Request</h5>
        </div>
        {
          <div >
            {
              <Row>
                <Col xs={12} md={3} lg={3}>
                  <Form.Label className="formlabel">Select Status</Form.Label>
                  {/* <Select
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 })
                    }}
                    isMulti='true'
                    onChange={(e) => {
                      this.onChangeFilteringTicketStatus(e);
                    }}
                    options={this.state.filteringTicketStatusOptions}
                    placeholder="Select status"
                  /> */}
                  <ReactMultiSelectCheckboxes
                    onChange={(e) => {
                      this.onChangeFilteringTicketStatus(e);
                    }}
                    value= {this.state.defaultTicketStatus}
                    placeholderButtonLabel="Select Status"
                    width="400px"
                    options={this.state.filteringTicketStatusOptions}
                  />
                </Col>
                <Col xs={12} md={4} lg={4}>
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
                <Col xs={12} md={2} lg={2}>
                  <Form.Label style={{ visibility: "hidden" }}>Change Status</Form.Label><br></br>
                  <Button disabled={this.state.hideButtons} style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.filterTickets}>
                    Filter Tickets
                  </Button>
                </Col>
                <Col xs={12} md={1} lg={1}>
                  <Form.Label style={{ visibility: "hidden" }}>Export</Form.Label><br></br>
                  <Button disabled={this.state.hideButtons} style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.exportData}>
                    Export</Button>
                </Col>
                <Col xs={12} md={2} lg={2}>
                  <Form.Label style={{ visibility: "hidden" }}>Clear Filter</Form.Label>
                  <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.clearFilterSetting}>
                    Clear Filter
                  </Button>
                </Col>
              </Row>
            }
            <MaterialTable
              title={this.state.tableTitle}
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
                  zIndex: "1"
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
        }
      </div>

    );
  }
}

export default TransferTicket;
