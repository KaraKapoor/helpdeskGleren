import React, { Component } from "react";
import TicketDataService from "../../services/ticket.service";
import "../Ticket/addTicket.css";
import { toast } from 'react-toastify';
import Moment from 'moment';
import { Button, Col, Form, Row, Modal, Breadcrumb } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AsyncSelect from "react-select/async";
import * as url from "../../http-common";
import ReactHtmlParser from 'react-html-parser';
import Select from "react-select";
import { Fragment } from "react";
import * as Constants from "../Shared/constants";
import DatePicker from 'react-datepicker';

class ViewTransferTicket extends Component {
  constructor(props) {
    super(props);
    this.postReply = this.postReply.bind(this);
    this.removeSelectedFile = this.removeSelectedFile.bind(this);
    this.selectFiles = this.selectFiles.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
    this.onChangeHelpTopic = this.onChangeHelpTopic.bind(this);
    this.onChangeDynamicText = this.onChangeDynamicText.bind(this);
    this.onChangeDynamicDropdownValues = this.onChangeDynamicDropdownValues.bind(this);
    this.onChangeBooleanValue = this.onChangeBooleanValue.bind(this);
    this.onChangeDynamicMobileNo = this.onChangeDynamicMobileNo.bind(this);
    this.onChangeDynamicPhoneNo = this.onChangeDynamicPhoneNo.bind(this);
    this.onChangeDynamicDate = this.onChangeDynamicDate.bind(this);
    this.removeSelectedTicketFile = this.removeSelectedTicketFile.bind(this);
    this.selectTicketFiles = this.selectTicketFiles.bind(this);
    this.updateTicket = this.updateTicket.bind(this);
    this.onChangeCannedResponse = this.onChangeCannedResponse.bind(this);
    this.onChangepostInternalNote = this.onChangepostInternalNote.bind(this);
    this.onChangeTicketStatus = this.onChangeTicketStatus.bind(this);
    this.onChangeTransferAssignee=this.onChangeTransferAssignee.bind(this);
    this.toggleClass =this.toggleClass.bind(this);
    this.mandatoryDynamicFields = [];
    this.viewTicketDetailsJson = {};
    this.previousTicketSummary = "";
    this.previousTicketSummaryModified = false;
    this.previousDetails = "";
    this.previousTicketDetailsModified = false;
    this.state = {
      ticketId: 0,
      ticketSubject: "",
      ticketPriorityLevel: "",
      selectedOption: null,
      responseMessage: "",
      ticketData: {
        ticketsource: {},
        department: {},
        helptopic: {},
        dynamicFormJson: {},
        user: {}
      },
      isAgent: null,
      cannedOptions: [],
      userId: "",
      ticketReplies: [],
      dynamicFields: [],
      branch: "",
      arrayOfSelectedId: [],
      ticketStatus: "",
      selectedFiles: [],
      displayFileName: false,
      selectedTicketFiles: [],
      displayTicketFileName: false,
      showTransferPopup: false,
      showDepartmentSelectionPopup: false,
      departmentOptions: [],
      isTicketWronglyAssignedFlow: null,
      transferMessage: "",
      departmentOptions: [],
      helpTopicOptions: [],
      openDepartmentIdOfTicketUser: null,
      officeType: "",
      assigneeFullName: "",
      customFieldsFormNameArray: [],
      customFieldsFormFieldsArray: [],
      dynamicFormFieldsData: [],
      customFieldsTextFields: {},
      customFieldsSelectAllValues: {},
      customFieldsTextCount: 0,
      optionsArrayTicketCategoryForm: [],
      optionsArrayTicketDetailsForm: [],
      formName: "",
      fields: [],
      postInternalNotes: false,
      disablePostReplyButtonOnClick: false,
      active:false,
      dataPath:undefined
    }

    /* Fetch the ticket id from url*/
    var currentUrl = window.location.href;
    var idParam = currentUrl.split("/id:")
    this.state.ticketId = idParam[1];
    /*Ends-- Fetch the ticket id from url*/
    this.state.userId = sessionStorage.getItem("userId");
    this.selectedTransferAssignee = undefined;
  }

  /*Starts-- API calls */
  async getTicketDetailsByTicketId() {
    var data = {
      id: this.state.ticketId
    }
    TicketDataService.getTicketDetailsByTicketId(data)
      .then((response) => {
        this.setState({ ticketData: response.data });
        this.setState({ branch: response.data.branch });
        this.setState({ openDepartmentIdOfTicketUser: response.data.openDepartmentIdOfUser })
        this.setState({ officeType: response.data.schCol })
        this.getAssigneeOptions();
        console.log("Response" + JSON.stringify(response.data));
        if (response.data.dynamicFormField1 !== null) {
          let originalString = response.data.dynamicFormField1;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);
        }
        if (response.data.dynamicFormField2 !== null) {
          let originalString = response.data.dynamicFormField2;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);
        }
        if (response.data.dynamicFormField3 !== null) {
          let originalString = response.data.dynamicFormField3;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);
        }
        if (response.data.dynamicFormField4 !== null) {
          let originalString = response.data.dynamicFormField4;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField5 !== null) {
          let originalString = response.data.dynamicFormField5;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);
        }
        if (response.data.dynamicFormField6 !== null) {
          let originalString = response.data.dynamicFormField6;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField7 !== null) {
          let originalString = response.data.dynamicFormField7;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField8 !== null) {
          let originalString = response.data.dynamicFormField8;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField9 !== null) {
          let originalString = response.data.dynamicFormField9;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField10 !== null) {
          let originalString = response.data.dynamicFormField10;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField11 !== null) {
          let originalString = response.data.dynamicFormField11;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField12 !== null) {
          let originalString = response.data.dynamicFormField12;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField13 !== null) {
          let originalString = response.data.dynamicFormField13;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);
        }
        if (response.data.dynamicFormField14 !== null) {
          let originalString = response.data.dynamicFormField14;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField15 !== null) {
          let originalString = response.data.dynamicFormField15;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField16 !== null) {
          let originalString = response.data.dynamicFormField16;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField17 !== null) {
          let originalString = response.data.dynamicFormField17;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField18 !== null) {
          let originalString = response.data.dynamicFormField18;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField19 !== null) {
          let originalString = response.data.dynamicFormField19;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField20 !== null) {
          let originalString = response.data.dynamicFormField20;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField21 !== null) {
          let originalString = response.data.dynamicFormField21;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField22 !== null) {
          let originalString = response.data.dynamicFormField22;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField23 !== null) {
          let originalString = response.data.dynamicFormField23;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);
        }
        if (response.data.dynamicFormField24 !== null) {
          let originalString = response.data.dynamicFormField24;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField25 !== null) {
          let originalString = response.data.dynamicFormField25;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField26 !== null) {
          let originalString = response.data.dynamicFormField26;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField27 !== null) {
          let originalString = response.data.dynamicFormField27;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField28 !== null) {
          let originalString = response.data.dynamicFormField28;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);
        }
        if (response.data.dynamicFormField29 !== null) {
          let originalString = response.data.dynamicFormField29;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField30 !== null) {
          let originalString = response.data.dynamicFormField30;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField31 !== null) {
          let originalString = response.data.dynamicFormField31;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField32 !== null) {
          let originalString = response.data.dynamicFormField32;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField33 !== null) {
          let originalString = response.data.dynamicFormField33;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField34 !== null) {
          let originalString = response.data.dynamicFormField34;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);
        }
        if (response.data.dynamicFormField35 !== null) {
          let originalString = response.data.dynamicFormField35;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField36 !== null) {
          let originalString = response.data.dynamicFormField36;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField37 !== null) {
          let originalString = response.data.dynamicFormField37;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField38 !== null) {
          let originalString = response.data.dynamicFormField38;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField39 !== null) {
          let originalString = response.data.dynamicFormField39;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);

        }
        if (response.data.dynamicFormField40 !== null) {
          let originalString = response.data.dynamicFormField40;
          let key = originalString.substring(0, originalString.indexOf(","));
          let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
          this.viewTicketDetailsJson[key] = value;
          this.checkPreviousIssueSummaryDetails(key,value);
        }
        for (let i of Object.entries(this.state.ticketData.dynamicFormJson)) {
          // console.log(i[0]);
          // console.log(i[1])
          let search = "_";
          let replaceWith = "";
          let processString = i[0].toString().toLowerCase().split(search).join(replaceWith);
          // let processString = i[0].toString().toLowerCase().replaceAll(/_/g, "")
          if (processString.includes("issuesummary")) {
            this.setState({ ticketSubject: i[1] });
          }
          if (processString.includes("prioritylevel")) {
            this.setState({ ticketPriorityLevel: i[1] });
          }

        }
      })
  }

  checkPreviousIssueSummaryDetails(key,value){
    let search = /[_ 0-9]/g;
    let replaceWith = "";
    let processString = key.toString().split(search).join(replaceWith);
    
    if(processString.includes("IssueSummary")){
      this.previousTicketSummary=value;
    }else if(processString.includes("IssueDetails")){
      this.previousDetails=value;
    }
  }
  fetchData = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
    } else {
      setTimeout(() => {
        fetch(
          url.baseURL + `/api/user/findByParam/?email=${inputValue}`,
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
                label: `${element.email}`,
                name: `${element.fullName}`,
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
  async getTicketRepliesByTicketId() {
    var data = {
      ticketId: this.state.ticketId
    }
    TicketDataService.getTicketRepliesByTicketId(data)
      .then((response) => {
        this.setState({ ticketReplies: response.data });
        console.log("Response" + JSON.stringify((response.data)));
      })
  }

  async getAssigneeOptions() {
    const obj = {
      branchName: this.state.branch
    }
    const res = await TicketDataService.getUsersByBranch(obj);
    const data = res.data;

    const options = data.map((d) => ({
      value: d.id,
      label: d.fullName,
    }));

    this.setState({ assigneeOptions: options });
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
  downloadFile(e) {
    const downloadObj = {
      keyName: e
    }
    TicketDataService.downloadTicketFile(downloadObj)
      .then((res) => {
        console.log(res.data);
        window.location.href = res.data.downloadUrl;
        // window.open(res.data.downloadUrl);
      })
    console.log(e);
  }
  /*Ends-- API calls */


  /*Starts-- OnChange Methods*/
  onSearchChange = (selectedOption) => {
    this.setState({ selectedOption: selectedOption });
  };
  /*Ends-- OnChange Methods*/

  /*Starts-- Submit Method */
  async postReply() {

    if (this.state.responseMessage === "" || this.state.responseMessage === undefined) {
      return this.showWarningToast("Message is mandatory");
    } else {
      this.setState({ disablePostReplyButtonOnClick: true });
      if (this.state.ticketStatus !== '') {
        console.log(this.state.statusId);
        var data = {
          ticketStatus: this.state.ticketStatus,
          id: this.state.arrayOfSelectedId,
          assigneeFullName: "",
          assigneeId: "",
          userId: sessionStorage.getItem("userId"),
          userMobile: sessionStorage.getItem("mobile"),
          usedInCannedFilters: true

        };
        await TicketDataService.bulkUpdateTicketStatusAndAssignee(data)
          .then((response) => {
            console.log(response.data);
            // ReactDOM.findDOMNode(this.messageForm).reset();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
    const recepientsArray = [];
    let processedRecepientsArray
    if (this.state.selectedOption !== null && this.state.selectedOption !== "") {
      for (var i of this.state.selectedOption) {
        recepientsArray.push(i.label);
      }
      //convert the array of string to comma separated string for server processing
      processedRecepientsArray = recepientsArray.join();
    }

    var data = {
      to: this.state.ticketData.email,
      from: sessionStorage.getItem("userId"),
      recepients: processedRecepientsArray,
      message: this.state.responseMessage,
      ticketId: this.state.ticketId,
      s3FilesUrl: this.state.selectedFiles,
      isInternalNotes: this.state.postInternalNotes

    }
    TicketDataService.postTicketReply(data).then((response) => {
      //Start insert ticketId and file Key in files table
      let fileKeysArray = [];
      const fileObj = {
        ticketId: this.state.ticketId,
        fileKeysArray: fileKeysArray
      }

      for (let i of this.state.selectedFiles) {
        for (let j of Object.entries(i)) {
          if (j[1].includes("ticket/")) {
            fileKeysArray.push(j[1]);
          }

        }
      }
      TicketDataService.createFileKeyEntry(fileObj).
        then((fileRes) => {
          console.log(fileRes.data);
          this.showSuccessToast("Reply Posted");
          window.location.reload(true);
        })

      //End insert ticketId and file Key in files table
    })
      .catch((e) => {
        this.showErrorToast("Some Error Occurred");
        console.log(e);
      });
  }
  /*Ends-- Submit Method */
  async selectFiles(id, event) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    TicketDataService.uploadTempTicketFile(formData)
      .then((response) => {
        console.log(response.data);
        this.state.selectedFiles.push({ id: id, key: response.data.key, fileName: event.target.files[0].name });
        this.setState({
          displayFileName: true,
        });
      })
  }
  removeSelectedFile(id, fileKey, e) {
    console.log(id);
    console.log(fileKey);

    let tempArray = [];
    for (let i of this.state.selectedFiles) {
      if (i.id === id && i.key === fileKey) {
        let index = this.state.selectedFiles.indexOf(i);
        if (index > -1) {
          tempArray = this.state.selectedFiles;
          tempArray.splice(index, 1);
          this.setState(({ selectedFiles: tempArray }));
          console.log(tempArray);

          //Delete file from S3 as well
          const deleteObj = {
            keyName: fileKey
          }
          TicketDataService.deleteTicketFile(deleteObj)
            .then((resp) => {
              console.log("File Deleted From S3" + resp.data);
            })
        }
      }
    }
  }
  async selectTicketFiles(id, event) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    TicketDataService.uploadTempTicketFile(formData)
      .then((response) => {
        console.log(response.data);
        this.state.selectedTicketFiles.push({ id: id, key: response.data.key, fileName: event.target.files[0].name });
        this.setState({
          displayTicketFileName: true,
        });

        //Start Processing Files and add it into customFieldsTextFields
        let customFieldsTextFields = Object.assign({}, this.state.customFieldsTextFields);
        if (Object.keys(this.state.customFieldsTextFields).length <= 0) {
          customFieldsTextFields[id] = response.data.key;

          console.log(this.state.customFieldsTextFields);
          console.log(customFieldsTextFields);
          this.setState({ customFieldsTextFields: customFieldsTextFields }, () =>
            console.log(this.state.customFieldsTextFields));
        } else {
          for (let j of Object.entries(this.state.customFieldsTextFields)) {
            if (j[0] === id) {
              let updateKey;
              updateKey = j[1] + "," + response.data.key;
              customFieldsTextFields[id] = updateKey;
              this.setState({ customFieldsTextFields: customFieldsTextFields }, () =>
                console.log(this.state.customFieldsTextFields));
            } else {
              customFieldsTextFields[id] = response.data.key;
              this.setState({ customFieldsTextFields: customFieldsTextFields }, () =>
                console.log(this.state.customFieldsTextFields));
            }
          }
        }
        //End Processing Files and add it into customFieldsTextFields
      })
  }
  removeSelectedTicketFile(id, fileKey, e) {

    //Start-Remove the file from customFieldsTexFields Object
    for (let j of Object.entries(this.state.customFieldsTextFields)) {
      if (j[0] === id) {
        const res = j[1].split(",");
        if (res.length === 1) {
          delete this.state.customFieldsTextFields[id];
          break;
        }
        for (let key of res) {
          if (key === fileKey) {
            let newKey = j[1].replace(key + ",", '');
            if (newKey === j[1]) {
              newKey = j[1].replace("," + key, '');//Means it is the last file that has been removed.
              console.log(newKey);
              this.state.customFieldsTextFields[id] = newKey;
              break;
            } else {
              console.log(newKey);
              this.state.customFieldsTextFields[id] = newKey;
              break;
            }


          }
        }
      }
    }
    //End-Remove the file from customFieldsTexFields Object


    console.log(id);
    console.log(fileKey);

    let tempArray = [];
    for (let i of this.state.selectedTicketFiles) {
      if (i.id === id && i.key === fileKey) {
        let index = this.state.selectedTicketFiles.indexOf(i);
        if (index > -1) {
          tempArray = this.state.selectedTicketFiles;
          tempArray.splice(index, 1);
          this.setState(({ selectedTicketFiles: tempArray }));
          console.log(tempArray);

          //Delete file from S3 as well
          const deleteObj = {
            keyName: fileKey
          }
          TicketDataService.deleteTicketFile(deleteObj)
            .then((resp) => {
              console.log("File Deleted From S3" + resp.data);
            })
        }
      }
    }
  }



  /*Starts-- Toasts Method */
  showErrorToast = () => {
    toast.error("Some error occurred while saving!", {
      position: toast.POSITION.TOP_CENTER,
      className: "error-toast"
    });
  };
  showSuccessToast = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
      className: "success-toast"
    });
  };
  showWarningToast = (message) => {
    toast.warning(message, {
      position: toast.POSITION.TOP_CENTER,
      className: "warning-toast"
    });
  };
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

    this.setState({ helpTopicOptions: [] });
    this.setState({ topicId: undefined, topicName: undefined });
    this.setState({ depId: e.value, deptName: e.label });
    this.selectedTranferDepartment = { depId: e.value, deptName: e.label };
    this.getAllTrasnferAssignees();
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
    this.setState({ showHelptopicDropdown: true });
    //End-Get all helpTopic corresponding to departments
  }

  async onChangeHelpTopic(e) {
    this.setState({ topicId: e.value, topicName: e.label });
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
  onChangeDynamicDropdownValues(id, e) {
    console.log("Event:" + JSON.stringify(e));
    console.log("id" + JSON.stringify(id));
    this.state.customFieldsTextFields[id] = e.value;

    let customFieldsTextFields = Object.assign({}, this.state.customFieldsTextFields);
    customFieldsTextFields[id] = e.value;

    console.log(this.state.customFieldsTextFields);
    console.log(customFieldsTextFields);
    //this.setState({customFieldsTextFields});
  }
  onChangeDynamicText(e) {
    console.log("value" + e.target.value);
    console.log("name" + e.target.name);
    console.log("id" + e.target.id);
    this.state.customFieldsTextFields[e.target.id] = e.target.value;

    let customFieldsTextFields = Object.assign({}, this.state.customFieldsTextFields);
    customFieldsTextFields[e.target.id] = e.target.value;

    console.log(this.state.customFieldsTextFields);
    console.log(customFieldsTextFields);
    this.setState({ customFieldsTextFields });
  }
  onChangeBooleanValue(e) {
    this.state.customFieldsTextFields[e.target.id] = e.target.checked;

    let customFieldsTextFields = Object.assign({}, this.state.customFieldsTextFields);
    customFieldsTextFields[e.target.id] = e.target.checked;

    console.log(this.state.customFieldsTextFields);
    console.log(customFieldsTextFields);
    this.setState({ customFieldsTextFields });
  }
  onChangeDynamicMobileNo(e) {
    this.state.customFieldsTextFields[e.target.id] = e.target.value;

    let customFieldsTextFields = Object.assign({}, this.state.customFieldsTextFields);
    customFieldsTextFields[e.target.id] = e.target.value;

    console.log(this.state.customFieldsTextFields);
    console.log(customFieldsTextFields);
    this.setState({ customFieldsTextFields });
  }
  onChangeDynamicPhoneNo(e) {
    this.state.customFieldsTextFields[e.target.id] = e.target.value;

    let customFieldsTextFields = Object.assign({}, this.state.customFieldsTextFields);
    customFieldsTextFields[e.target.id] = e.target.value;

    console.log(this.state.customFieldsTextFields);
    console.log(customFieldsTextFields);
    this.setState({ customFieldsTextFields });
  }
  onChangeDynamicDate(id, date) {
    this.state.customFieldsTextFields[id] = date;

    let customFieldsTextFields = Object.assign({}, this.state.customFieldsTextFields);
    customFieldsTextFields[id] = date;
    this.setState({ customFieldsTextFields });
  }

  createDynamicFieldsComment(viewTicketDetailsJson, departmentName) {
    var main = document.createElement("div");
    var heading = document.createElement("h6");
    var underline = document.createElement("u");
    heading.innerHTML = "Previous Department(" + departmentName + ")" + " " + "Ticket  Details";
    underline.appendChild(heading);
    main.appendChild(underline);
    var jsonData = viewTicketDetailsJson;
    for (let i of Object.entries(jsonData)) {
      let search = /[_ 0-9]/g;
      let replaceWith = "";
      let processString = i[0].toString().split(search).join(replaceWith);
      let res = i[1];
      if (i[1] === true || i[1] === false) {
        res = i[1].toString();
      } else {
        res = i[1].split(",");
      }
      //Start-Added condition to check for date obj in dynamic fields and modify it.
      if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(i[1])) {
        // console.log("value"+i[1]+" "+" Not a date")
      } else {
        i[1] = Moment(i[1]).format('DD/MM/YYYY hh:mm A');
      }
      //End-Added condition to check for date obj in dynamic fields and modify it.
      let lineBreak = document.createElement('br');
      let strongTag = document.createElement('strong');
      let label = document.createElement("label");
      label.innerHTML = processString + "&nbsp";
      strongTag.appendChild(label);
      main.appendChild(strongTag);


      if (res.toString().includes("ticket/")) {
        for (let r of res) {
          let anchorTag = document.createElement("a");
          anchorTag.innerHTML = r.substring(r.lastIndexOf("/") + 1, r.length) + "&nbsp";
          anchorTag.target = "_self"
          anchorTag.href = url.baseURL + "/api/file/downloadTicketFile/?" + "keyName=" + r;
          main.appendChild(anchorTag);
        }

      } else {
        let anchorTag = document.createElement("a");
        anchorTag.innerHTML = res + "&nbsp";
        main.appendChild(anchorTag);
      }

      main.appendChild(lineBreak);
      // console.log(main.innerHTML);
    }
    // console.log(pTag);

    var replyObj = {
      to: null,
      from: sessionStorage.getItem("userId"),
      recepients: null,
      message: main.innerHTML,
      ticketId: this.state.ticketId,
      s3FilesUrl: null,
      isInternalNotes: false,
      isTicketActivityThread: true
    }
    TicketDataService.postTicketReply(replyObj)
      .then((replyResp) => {
        console.log(replyResp);
      })
  }
  async updateTicket() {

    //Validation starts
    if (this.state.depId === undefined || this.state.deptName === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.topicId === undefined || this.state.topicId === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.selectedTransferAssignee === undefined || this.selectedTransferAssignee === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    //Validation Ends
    const transferTicketObj = {
      isTicketWronglyAssigned: 1,
      transferReason: this.state.transferMessage,
      departmentName: this.state.deptName || '',
      loggedInUserEmail: window.sessionStorage.getItem("email"),
      ticketId: this.state.ticketId,
      selectedDepartment: this.selectedTranferDepartment,
      selectedAssignee: this.selectedTransferAssignee,
      transferreId: window.sessionStorage.getItem("userId"),
      helpTopicId: this.state.topicId

    }
    TicketDataService.transferTicket(transferTicketObj)
      .then((response) => {
        if (response.data.success == "false") {
          return this.showErrorToast(response.data.message);
        }
        this.showSuccessToast("Ticket Transferred Successfully");
        this.props.history.push("/allTickets");
      })

  }
  onChangeCannedResponse(e) {
    this.setState({ cannedId: e.value, cannedFilterName: e.label });
    const filterObj = {
      ticketId: this.state.ticketId,
      cannedFilterName: e.label,
      isAgent: this.state.isAgent
    }
    TicketDataService.filterCannedResponses(filterObj).then((res) => {
      if (res.data.message) {
        this.setState({ responseMessage: this.state.responseMessage + res.data.message });
      }

      if (res.data.length >= 1) {
        for (let i of res.data) {
          this.setState({ responseMessage: this.state.responseMessage + i.message });
        }
      }
      if (res.data.recepients) {
        this.setState({ selectedOption: res.data.recepients });
      }

    })
  }
  getCannedOptions() {
    const options = [
      {
        value: 1,
        label: Constants.lbl_ORIGINAL_MESSAGE,
      },
      {
        value: 2,
        label: Constants.lbl_LAST_MESSAGE,
      },
      {
        value: 3,
        label: Constants.lbl_FULL_MESSAGE,
      },
      {
        value: 4,
        label: Constants.lbl_CLOSING_EMAIL_MESSAGE,
      }
    ];
    this.setState({ cannedOptions: options });
  }
  onChangepostInternalNote(e) {
    if (this.state.postInternalNotes === false) {
      this.setState({
        postInternalNotes: true,
      });
    } else {
      this.setState({
        postInternalNotes: false,
      });
    }
  }
  async onChangeTicketStatus(e) {
    await this.setState({ statusId: e.value, ticketStatus: e.label }, () => {
      console.log(this.state.statusId);
      console.log(this.state.ticketStatus);

    });
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
  toggleClass(path,e) {
    const currentState = this.state.active;
    this.setState({active:!currentState});
    this.setState({dataPath:path});
    console.log(this.state.active);
};
  /*Ends--Toast Methods */
  componentDidMount() {
    this.getTicketDetailsByTicketId();
    this.getTicketRepliesByTicketId();
    let arrayOfId = [];
    arrayOfId.push(this.state.ticketId)
    this.setState({ arrayOfSelectedId: arrayOfId });
    this.getUserDetails();
    this.getDepartmentOptions();
    // this.getHelpTopicOptions();
    this.getCannedOptions();
    this.getTicketStatus();
  }
  async getAllTrasnferAssignees() {
    if (this.selectedTranferDepartment.deptName === 'All') {
        const res = await TicketDataService.getAllDepartmentsAgents();
        const data = res.data.agentDeptMap;
        let options = [];
        for (let d of data) {
            options.push({ value: d.value, label: d.label+`<${d.user.email}>`, departmentId: d.departmentId,assigneeName:d.label })
        }
        this.setState({ transferAssignee: options });
    } else if (this.selectedTranferDepartment.deptName === 'Central Pool Agent') {
        this.setState({ transferAssignee: [] });
        this.setState({ showTransferAssignee: false });
    } else {
        const res = await TicketDataService.getDepartmentAssociatedAgents(500, 0, undefined, 'desc', 'createdAt', this.selectedTranferDepartment.depId);
        const data = res.data.users;
        let options = [];
        for (let d of data) {
            options.push({ value: d.userId, label: d.user.fullName+`<${d.user.email}>`, departmentId: d.departmentId,assigneeName:d.user.fullName })
        }
        this.setState({ transferAssignee: options });
    }

}

onChangeTransferAssignee(e) {
  this.selectedTransferAssignee = {
      value: e.value,
      label: e.label,
      departmentId: e.departmentId,
      assigneeName:e.assigneeName
  }
  console.log(this.selectedTransferAssignee);
}

  render() {
    if (!this.state.ticketData) {
      return <div />; //Render component once api call's are completed.
    }
    return (
      <div>
        <div className="shadow p-3 mb-5 bg-white rounded" style={{ marginTop: "20px" }}>
          <Breadcrumb>
            {sessionStorage.getItem("previousPageLocation") === "/transferRequest" &&
              <Breadcrumb.Item href="/transferRequest">Transfer Request</Breadcrumb.Item>
            }
            <Breadcrumb.Item active>
              Ticket #{this.state.ticketId}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col>
              <h5 className="formHeading" style={{ backgroundColor: "#ffffff" }}>Ticket #{this.state.ticketId}</h5>
            </Col>
            {/* <Col>
                            <Link style={{ color: "#1f3143", float: "right" }} to={`/addTicket/id:${this.state.ticketId}`}>Edit Ticket</Link>
                        </Col> */}
          </Row>
          <h4 className="subject">{this.state.ticketSubject}</h4>
          <Row>
            <Col>
              <label className="lblFields">Status:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.ticketStatus}</label>
            </Col>
            <Col>
              <label className="lblFields">User:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.fullName}</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <label className="lblFields">Priority:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketPriorityLevel}</label>
            </Col>
            <Col>
              <label className="lblFields">Email:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.email}</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <label className="lblFields">Designation:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.user.designation}</label>
            </Col>
            <Col>
              <label className="lblFields">Department:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.department.departmentName}</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <label className="lblFields">Source:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.ticketsource.sourceName}</label>
            </Col>
            <Col>
              <label className="lblFields">Created Date:&nbsp;</label>
              <label className="lblFieldValue">{Moment(this.state.ticketData.initialCreatedDate).format('DD/MM/YYYY hh:mm A')}</label>
            </Col>

          </Row>
          <Row>
            <Col>
              <label className="lblFields">Mobile:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.user.mobile}</label>
            </Col>
            <Col>
              <label className="lblFields">Assigned To:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.assigneeFullName}</label>
            </Col>

          </Row>
          <Row>
            <Col>
              <label className="lblFields">Help Topic:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.helptopic.helpTopicName}</label>
            </Col>
            <Col>
              <label className="lblFields">SLA Plan:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.slaPlan}</label>
            </Col>

          </Row>
          <Row>
            {
              this.state.ticketData.level1SlaDue !== null &&
              <Col>
                <label className="lblFields">Due Date:&nbsp;</label>
                <label className="lblFieldValue">{Moment(this.state.ticketData.level1SlaDue).format('DD/MM/YYYY hh:mm A')}&nbsp;&nbsp;<span className="lblFields">(Level-1)</span></label>

              </Col>
            }
            <Col>
              <label className="lblFields">Ticket Category:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.ticketCategory}</label>
            </Col>

          </Row>
          <Row>
            <Col>
              <label className="lblFields">Ticket SubCategory:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.ticketSubCategory}</label>
            </Col>
            <Col>
              <label className="lblFields">Employee Id:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.employeeNo}</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <label className="lblFields">Ticket Closed Date:&nbsp;</label>
              <label className="lblFieldValue">{
                this.state.ticketData.closedDate !== null && Moment(this.state.ticketData.closedDate).format('DD/MM/YYYY hh:mm A')
              }</label>
            </Col>
            <Col>
              <label className="lblFields">Ticket Closed By:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.closedBy}</label>
            </Col>
          </Row>
          <Row>
          <Col>
              <label className="lblFields">Branch:&nbsp;</label>
              <label className="lblFieldValue">{this.state.ticketData.branch}</label>
            </Col>
            <Col>
            <label className="lblFields">Modified SLA:&nbsp;</label>
            <label className="lblFieldValue">{this.state.ticketData.modifiedSlaPlan}</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <label className="lblFields">Modified Created Date:&nbsp;</label>
              <label className="lblFieldValue">{Moment(this.state.ticketData.createdAt).format('DD/MM/YYYY hh:mm A')}</label>
            </Col>
            <Col>
              <Modal show={this.state.active} keyboard={true} onHide={this.toggleClass} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton >
                </Modal.Header>
                <Modal.Body>
                  <object data={this.state.dataPath}
                    onClick={this.toggleClass.bind(this, this.state.dataPath)} className={this.state.active ? "viewFile" : null}>
                  </object>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        </div>
        <div className="shadow p-3 mb-5 bg-white rounded" style={{ marginTop: "20px" }}>
          <h5 className="formHeading">Ticket Details</h5>
          {
            Object.entries(this.viewTicketDetailsJson).map(([key, value]) => {
              let search = /[_ 0-9]/g;
              let replaceWith = " ";
              let processString = key.toString().split(search).join(replaceWith);
              let res = value;
              if (value === true || value === false) {
                res = value.toString();
              } else {
                res = value.split(",");
              }

              //Start-Added condition to check for date obj in dynamic fields and modify it.
              if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
                console.log("value" + value + " " + " Not a date")
              } else {
                value = Moment(value).format('DD/MM/YYYY hh:mm A');
              }
              //End-Added condition to check for date obj in dynamic fields and modify it.

              return (<div>
                {/* <label><span style={{ fontWeight: "bold", color: "black" }}>{key.toString().replaceAll(/[_ 0-9]/g, " ")}</span>:&nbsp;{ReactHtmlParser(value)}</label> */}
                {
                  !value.toString().includes("ticket/") &&
                  <label><span style={{ fontWeight: "bold", color: "black" }}>{processString}</span>:&nbsp;{ReactHtmlParser(value)}</label>
                }
                {
                  value.toString().includes("ticket/") &&
                  <label><span style={{ fontWeight: "bold", color: "black" }}>{processString}</span>:&nbsp; <span>
                    {
                      res.map((r) => {
                        return <span>&nbsp;{r.substring(r.lastIndexOf("/") + 1, r.length)}&nbsp;<i class="fa fa-cloud-download" style={{ cursor: "pointer" }} onClick={this.downloadFile.bind(this, r)} aria-hidden="true"></i> &nbsp;&nbsp;<i class="fa fa-eye" onClick={this.toggleClass.bind(this,url.baseURL+"/api/file/downloadTicketFile/?isView=true&keyName="+r)} aria-hidden="true"></i></span>
                      })
                    }
                  </span></label>
                }

              </div>)
            })
          }

        </div>
        <div className="shadow p-3 mb-5 rounded" style={{ marginTop: "20px" }}>
          <h5 className="formHeading">Ticket Thread</h5>
          {/* This flow is to show both internal and other replies to agent. */}
          {
            this.state.isAgent === "true" && this.state.ticketReplies.map((reply) => {
              if (reply.message !== null && (reply.isTicketActivityThread === null || reply.isTicketActivityThread === false) && reply.textMessage === null) {
                return (
                  <div>
                    <Row>
                      <Col xs={1} md={1}>
                        <img className="userIcon" src="../userIcon.PNG"></img>
                      </Col>
                      <Col xs={11} md={11}>
                        <div className="triangleMain">
                          <div className="triangle">
                            {reply.isInternalNotes === true &&
                              <p><span style={{ fontWeight: "bold" }}>{reply.repliedby}</span> posted <span style={{ fontWeight: "bold" }}>Internal Note</span> on {Moment(reply.createdAt).format('DD/MM/YYYY hh:mm A')}
                                <hr />
                              </p>

                            }
                            {(reply.isInternalNotes === null || reply.isInternalNotes === false) &&
                              <p><span style={{ fontWeight: "bold" }}>{reply.repliedby}</span> posted on {Moment(reply.createdAt).format('DD/MM/YYYY hh:mm A')}<hr /></p>
                            }
                          </div>
                          <div className="triangleInnerContent">
                            <p>{ReactHtmlParser(reply.message)}</p>
                            {JSON.stringify(reply.s3FilesUrl) !== '{}' && reply.s3FilesUrl !== null && reply.s3FilesUrl.map((s3File => {
                              return <label>{s3File.fileName} <span type="button" class="fa fa-cloud-download" onClick={this.downloadFile.bind(this, s3File.key)}></span> &nbsp;&nbsp;<i class="fa fa-eye" onClick={this.toggleClass.bind(this,url.baseURL+"/api/file/downloadTicketFile/?isView=true&keyName="+s3File.key)} aria-hidden="true"></i></label>
                            }))}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )
              }
              if (reply.message !== null && reply.isTicketActivityThread === true && reply.messageDateTime === null) {
                return <div>
                  <Row>
                    <Col xs={1} md={1}>

                    </Col>
                    <Col xs={11} md={11}>
                      <span><i class="fa fa-hand-o-right" aria-hidden="true" ></i>&nbsp;<span style={{ display: "inline-block" }}>{ReactHtmlParser(reply.message)}</span>&nbsp;{Moment(reply.createdAt).format('DD/MM/YYYY hh:mm A')}</span>
                    </Col>
                  </Row>

                </div>
              }
              //Means it is the escalated ticket thread and we need to show the escalated datetime.
              if (reply.message !== null && reply.isTicketActivityThread === true && reply.messageDateTime !== null) {
                return <div>
                  <Row>
                    <Col xs={1} md={1}>
                    </Col>
                    <Col xs={11} md={11}>
                      <span><i class="fa fa-hand-o-right" aria-hidden="true" ></i>&nbsp;<span style={{ display: "inline-block" }}>{ReactHtmlParser(reply.message)}</span>&nbsp;{Moment(reply.messageDateTime).format('DD/MM/YYYY hh:mm A')}</span>
                    </Col>
                  </Row>

                </div>
              }
              //Means it is the ticket initate transfer thread.
              if (reply.message !== null && reply.textMessage !== null && (reply.isTicketActivityThread === null || reply.isTicketActivityThread === false)) {
                return (
                  <div>
                    <Row>
                      <Col xs={1} md={1}>
                        <img className="userIcon" src="../userIcon.PNG"></img>
                      </Col>
                      <Col xs={11} md={11}>
                        <div className="triangleMain">
                          <div className="triangle">
                            <p><span style={{ display: "inline-block" }} >{ReactHtmlParser(reply.message)}</span> on {Moment(reply.createdAt).format('DD/MM/YYYY hh:mm A')}
                              <hr /></p>
                          </div>
                          <div className="triangleInnerContent">
                            <p>{ReactHtmlParser(reply.textMessage)}</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )
              }

            })
          }
          {/* This flow is to show only normal notes to user*/}
          {
            this.state.isAgent !== "true" && this.state.ticketReplies.map((reply) => {
              if (reply.message !== null && (reply.isTicketActivityThread === null || reply.isTicketActivityThread === false) && reply.textMessage === null && (reply.isInternalNotes === false || reply.isInternalNotes === null)) {
                return (
                  <div>
                    <Row>
                      <Col xs={1} md={1}>
                        <img className="userIcon" src="../userIcon.PNG"></img>
                      </Col>
                      <Col xs={11} md={11}>
                        <div className="triangleMain">
                          <div className="triangle">
                            <p><span style={{ fontWeight: "bold" }}>{reply.repliedby}</span> posted on {Moment(reply.createdAt).format('DD/MM/YYYY hh:mm A')}<hr /></p>
                            <p>{ReactHtmlParser(reply.message)}</p>
                            {JSON.stringify(reply.s3FilesUrl) !== '{}' && reply.s3FilesUrl !== null && reply.s3FilesUrl.map((s3File => {
                              return <label>{s3File.fileName} <span type="button" class="fa fa-cloud-download" onClick={this.downloadFile.bind(this, s3File.key)}></span> &nbsp;&nbsp;<i class="fa fa-eye" onClick={this.toggleClass.bind(this,url.baseURL+"/api/file/downloadTicketFile/?isView=true&keyName="+s3File.key)} aria-hidden="true"></i></label>
                            }))}
                          </div>
                        </div>
                      </Col>
                    </Row>

                  </div>
                )
              }
              if (reply.message !== null && reply.isTicketActivityThread === true && reply.messageDateTime === null) {
                return <div>
                  <Row>
                    <Col xs={1} md={1}>

                    </Col>
                    <Col xs={11} md={11}>
                      <span><i class="fa fa-hand-o-right" aria-hidden="true" ></i>&nbsp;<span style={{ display: "inline-block" }}>{ReactHtmlParser(reply.message)}</span>&nbsp;{Moment(reply.createdAt).format('DD/MM/YYYY hh:mm A')}</span>
                    </Col>
                  </Row>

                </div>
              }
              //Means it is the escalated ticket thread and we need to show the escalated datetime.
              if (reply.message !== null && reply.isTicketActivityThread === true && reply.messageDateTime !== null) {
                return <div>
                  <Row>
                    <Col xs={1} md={1}>
                    </Col>
                    <Col xs={11} md={11}>
                      <span><i class="fa fa-hand-o-right" aria-hidden="true" ></i>&nbsp;<span style={{ display: "inline-block" }}>{ReactHtmlParser(reply.message)}</span>&nbsp;{Moment(reply.messageDateTime).format('DD/MM/YYYY hh:mm A')}</span>
                    </Col>
                  </Row>

                </div>
              }
              //Means it is the ticket initate transfer thread.
              if (reply.message !== null && reply.textMessage !== null && (reply.isTicketActivityThread === null || reply.isTicketActivityThread === false)) {
                return (
                  <div>
                    <Row>
                      <Col xs={1} md={1}>
                        <img className="userIcon" src="../userIcon.PNG"></img>
                      </Col>
                      <Col xs={11} md={11}>
                        <div className="triangleMain">
                          <div className="triangle">
                            <p><span style={{ display: "inline-block" }} >{ReactHtmlParser(reply.message)}</span> on {Moment(reply.createdAt).format('DD/MM/YYYY hh:mm A')}
                              <hr /></p>
                          </div>
                          <div className="triangleInnerContent">
                            <p>{ReactHtmlParser(reply.textMessage)}</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )
              }
            })
          }
        </div>
        <div className="shadow p-3 mb-5 bg-white rounded" style={{ marginTop: "20px" }}>
          <h5 className="formHeading">Transfer Ticket To Department</h5>
          <Form>
            <Form.Group controlId="formBasicDepartment">
              <Form.Label className="formlabel required">Department</Form.Label>
              <Select
                options={this.state.departmentOptions}
                onChange={this.onChangeDepartment.bind(this)}
                placeholder="Select a Department"
              />
            </Form.Group>
            <Form.Group controlId="formBasicHelpTopic">
              <Form.Label className="formlabel required">Help Topic</Form.Label>
              <Select
                value={{ value: this.state.topicId, label: this.state.topicName }}
                options={this.state.helpTopicOptions}
                onChange={this.onChangeHelpTopic.bind(this)}
                placeholder="Select a help topic"
              />
            </Form.Group>
            <Form.Group controlId="departmentName">
              <Form.Label className="formlabel required">Change Assignee</Form.Label>
              <Select
                styles={{
                  // Fixes the overlapping problem of the component
                  menu: provided => ({ ...provided, zIndex: 9999 })
                }}
                options={this.state.transferAssignee}
                placeholder="Select a Assignee"
                onChange={this.onChangeTransferAssignee.bind(this)}
              />
            </Form.Group>
            <Form.Label className="formlabel">Transfer Reason</Form.Label>
            <CKEditor
              onReady={(editor) => { }}
              data={this.state.transferMessage || ''}
              editor={ClassicEditor}
              onChange={(event, editor) => {
                const data = editor.getData();
                this.state.transferMessage = data;
                console.log({ event, editor, data });
              }}
            />
            {/* {this.state.dynamicFormFieldsData.map((form, formindex) => {
              console.log("BB Form Index : " + formindex);
              // Dynamic form Starts
              return (
                <div key={formindex}>
                  <h5 className="formHeading">{form.formName}</h5>
                  {form.fields.map((formFields, fieldindex) => {
                    console.log("BB Index of form field : " + fieldindex);
                    let search = " ";
                    let replaceWith = "_";
                    let formFieldId = formFields.label.split(search).join(replaceWith);
                    // let formFieldId = formFields.label.replaceAll(" ", "_");
                    //emptyObj[formFieldId] = this.state.dynamicText;
                    // console.log(emptyObj);

                    let formFieldIdWithIndex = formindex + "_" + fieldindex + "_" +
                      formFieldId;
                    console.log("ID" + formFieldIdWithIndex);
                    if (formFields.required === true) {
                      this.mandatoryDynamicFields.push(formFieldIdWithIndex);
                    }
                    console.log(this.mandatoryDynamicFields);

                    //Start-Auto Populate the Issue Summary and Issue Details
                    if (formFieldId === "Issue_Summary" && this.previousTicketSummaryModified === false && Object.keys(this.state.customFieldsTextFields).length <= 0) {
                      this.state.customFieldsTextFields[formFieldIdWithIndex] = this.previousTicketSummary
                      this.previousTicketSummaryModified = true;
                    }
                    if (formFieldId === "Issue_Summary" && Object.keys(this.state.customFieldsTextFields).length > 0 && this.previousTicketSummaryModified === false) {
                      for (let obj of Object.entries(this.state.customFieldsTextFields)) {
                        let search = "_";
                        let replaceWith = "";
                        let label = obj[0].split(search).join(replaceWith);
                        let labelNew=label.replace(/[0-9]/g, '')
                        if (labelNew===("IssueSummary")) {
                          //Do nothing persist newly value.
                        } else {
                          this.state.customFieldsTextFields[formFieldIdWithIndex] = this.previousTicketSummary;
                          this.previousTicketSummaryModified = true;
                        }
                      }
                    }


                    if (formFieldId === "Issue_Details" && this.previousTicketDetailsModified === false && Object.keys(this.state.customFieldsTextFields).length <= 0) {
                      this.state.data = this.previousDetails
                      this.state.customFieldsTextFields[formFieldIdWithIndex] = this.previousDetails;
                      this.previousTicketDetailsModified = true;
                    }
                    if (formFieldId === "Issue_Details" && Object.keys(this.state.customFieldsTextFields).length > 0 && this.previousTicketDetailsModified === false) {
                      for (let obj of Object.entries(this.state.customFieldsTextFields)) {
                        console.log(obj[0]);
                        let search = "_";
                        let replaceWith = "";
                        let label = obj[0].split(search).join(replaceWith);
                        let labelNew=label.replace(/[0-9]/g, '')
                        if (labelNew===("IssueDetails")) {
                          //Do nothing persist newly value.
                        } else {
                          this.state.data = this.previousDetails;
                          this.state.customFieldsTextFields[formFieldIdWithIndex] = this.previousDetails;
                          this.previousTicketDetailsModified = true;
                        }
                      }
                    }

                    //End-Auto Populate the Issue Summary and Issue Details
                    if (formFields.type === Constants.TEXT) {
                      return (
                        <Fragment>
                          <Form.Group controlId={formFieldIdWithIndex}>
                            <Form.Label className={`formlabel ${formFields.required ? 'required' : ''}`}>
                              {formFields.label}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              key={formFieldIdWithIndex}
                              value={
                                this.state.customFieldsTextFields[
                                formFieldIdWithIndex
                                ]
                              }
                              onChange={this.onChangeDynamicText}
                            />
                          </Form.Group>
                        </Fragment>
                      );
                    }
                    if (formFields.type === Constants.TEXT_AREA) {
                      return (
                        <Fragment>
                          <Form.Group>
                            <Form.Label className={`formlabel ${formFields.required ? 'required' : ''}`}>
                              {formFields.label}
                            </Form.Label>
                            <CKEditor
                              id={formFieldIdWithIndex}
                              key={formFieldIdWithIndex}
                              onReady={(editor) => { }}
                              data={this.state.data}
                              editor={ClassicEditor}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                this.state.customFieldsTextFields[
                                  formFieldIdWithIndex
                                ] = data;
                                console.log({ event, editor, data });
                              }}
                            />
                            {formFields.attachments === true &&
                              <Fragment>
                                <Form.File
                                  className="customFile"
                                  multiple={false}
                                  onChange={this.selectTicketFiles.bind(this, "Attachments")}
                                  key={"Attachments"}
                                  id={"Attachments"}
                                  style={{ visibility: "hidden", display: "none" }}
                                />
                                <label className="labelFileUpload" for={"Attachments"}>Choose file</label>
                                {
                                  this.state.displayTicketFileName === true && this.state.selectedTicketFiles.map((file) => {

                                    return <Fragment>
                                      <p>{file.fileName} &nbsp;&nbsp;<i className="fa fa-trash-o" onClick={this.removeSelectedTicketFile.bind(this, "Attachments", file.key)}></i></p>
                                    </Fragment>

                                  })

                                }
                              </Fragment>
                            }
                          </Form.Group>
                        </Fragment>
                      );
                    }
                    if (formFields.type === Constants.DROPDOWN) {
                      this.state.customFieldsSelectAllValues[formFieldIdWithIndex] = [];
                      return (
                        <Fragment>
                          <Form.Group>
                            <Form.Label className={`formlabel ${formFields.required ? 'required' : ''}`}>
                              {formFields.label}
                            </Form.Label>
                            {formFields.values.map((op) => {

                              this.state.customFieldsSelectAllValues[formFieldIdWithIndex].push({
                                label: op,
                                value: op,
                              });
                            })}
                            <Select
                              key={formFieldIdWithIndex}
                              id={formFieldIdWithIndex}
                              // value={
                              //   this.state.customFieldsTextFields[
                              //     formFieldIdWithIndex
                              //   ]
                              // }
                              options={this.state.customFieldsSelectAllValues[formFieldIdWithIndex]}
                              onChange={this.onChangeDynamicDropdownValues.bind(this, formFieldIdWithIndex)}
                            />
                          </Form.Group>
                        </Fragment>
                      );
                    }
                    if (formFields.type === Constants.FILE) {
                      return <Fragment>
                        <Form.Group>
                          <Form.Label className={`formlabel ${formFields.required ? 'required' : ''}`}>
                            {formFields.label}
                          </Form.Label><br></br>
                          <Form.File
                            className="customFile"
                            multiple={false}
                            onChange={this.selectTicketFiles.bind(this, formFieldIdWithIndex)}
                            key={formFieldIdWithIndex}
                            id={formFieldIdWithIndex}
                            style={{ visibility: "hidden", display: "none" }}
                          />
                          <label className="labelFileUpload" for={formFieldIdWithIndex}>Choose file</label>
                          {
                            this.state.displayTicketFileName === true && this.state.selectedTicketFiles.map((file) => {
                              if (formFieldIdWithIndex.match(file.id)) {
                                return <Fragment>
                                  <p>{file.fileName} &nbsp;&nbsp;<i className="fa fa-trash-o" onClick={this.removeSelectedTicketFile.bind(this, formFieldIdWithIndex, file.key)}></i></p>
                                </Fragment>
                              }

                            })

                          }
                        </Form.Group>
                      </Fragment>
                    }
                    if (formFields.type === Constants.BOOLEAN) {
                      return (
                        <Fragment>
                          <Form.Group controlId={formFieldIdWithIndex}>
                            <Form.Check
                              type="checkbox"
                              key={formFieldIdWithIndex}
                              value={
                                this.state.customFieldsTextFields[
                                formFieldIdWithIndex
                                ]
                              }
                              onChange={this.onChangeBooleanValue}
                              label={formFields.label}
                            />
                          </Form.Group>
                        </Fragment>
                      );
                    }
                    if (formFields.type === Constants.MOBILE) {
                      return (
                        <Fragment>
                          <Form.Group controlId={formFieldIdWithIndex}>
                            <Form.Label className={`formlabel ${formFields.required ? 'required' : ''}`}>
                              {formFields.label}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              key={formFieldIdWithIndex}
                              maxLength="10"
                              value={
                                this.state.customFieldsTextFields[
                                formFieldIdWithIndex
                                ]
                              }
                              onChange={this.onChangeDynamicMobileNo}
                            />
                          </Form.Group>
                        </Fragment>
                      );
                    }
                    if (formFields.type === Constants.PHONE) {
                      return (
                        <Fragment>
                          <Form.Group controlId={formFieldIdWithIndex}>
                            <Form.Label className={`formlabel ${formFields.required ? 'required' : ''}`}>
                              {formFields.label}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              key={formFieldIdWithIndex}
                              maxLength="12"
                              value={
                                this.state.customFieldsTextFields[
                                formFieldIdWithIndex
                                ]
                              }
                              onChange={this.onChangeDynamicPhoneNo}
                            />
                          </Form.Group>
                        </Fragment>
                      );
                    }
                    if (formFields.type === Constants.INFO) {
                      return (
                        <Fragment>
                          <div className="infoDiv" id={formFieldIdWithIndex}>
                            <label className="infoTypeLbl">{formFields.label}</label>
                            <p className="infoTypeContent">{formFields.content}</p>
                          </div>

                        </Fragment>
                      );
                    } 
                    if (formFields.type === Constants.DATE_PICKER) {
                      return (
                        <Fragment>
                          <Form.Group controlId={formFieldIdWithIndex}>
                            <Form.Label className={`formlabel ${formFields.required ? 'required' : ''}`}>
                              {formFields.label}&nbsp;
                            </Form.Label>
                            <div class="input-group-prepend">
                              <DatePicker
                                key={formFieldIdWithIndex}
                                selected={this.state.customFieldsTextFields[
                                  formFieldIdWithIndex
                                ]}
                                onChange={this.onChangeDynamicDate.bind(this, formFieldIdWithIndex)}
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                placeholderText="Select Date"
                                className="form-control"
                              />
                              <span class="input-group-text" id="basic-addon1"><i class="fa fa-calendar" aria-hidden="true"></i></span>
                            </div>
                          </Form.Group>
                        </Fragment>
                      );
                    }
                    // this.state.customFieldsFormFieldsArray.push(emptyObj);

                    // console.log(this.state.customFieldsFormFieldsArray);
                  }, this.state.customFieldsTextCount++,
                  )}
                </div>
              );

              //Dynamic form Ends
            })} */}
            <button
              style={{marginTop:"10px"}}
              type="button"
              onClick={this.updateTicket}
              className="btn btn-success"
            >
              Submit
            </button>
          </Form>
        </div>
        {/* <div className="shadow p-3 mb-5 bg-white rounded" style={{ marginTop: "20px" }}>
                    <h5 className="formHeading">Post Reply</h5>
                    {this.state.isAgent === "true" &&
                        <Form>
                            <Form.Group as={Row} controlId="to">
                                <Form.Label column sm="2" className="formlabel">
                                    To:
                            </Form.Label>
                                <Col sm="10">
                                    <Form.Control
                                        type="text"
                                        value={this.state.ticketData.email}
                                    />
                                </Col>

                            </Form.Group>
                            <Form.Group as={Row} controlId="rece">
                                <Form.Label column sm="2" className="formlabel">
                                    Add Recipients:
                            </Form.Label>
                                <Col sm="10">
                                    <AsyncSelect
                                        value={this.state.selectedOption}
                                        loadOptions={this.fetchData}
                                        placeholder="Search email"
                                        onChange={(e) => {
                                            this.onSearchChange(e);
                                        }}
                                        defaultOptions={false}
                                        isMulti= {true}
                                        isClearable={true}
                                        styles={{
                                          // Fixes the overlapping problem of the component
                                          menu: provided => ({ ...provided, zIndex: 9999 })
                                      }}
                                    />
                                </Col>

                            </Form.Group>
                            <Form.Group as={Row}>
                            <Form.Label column sm="2" className="formlabel">Internal Note</Form.Label>
                            <Col sm="10">
                            <Form.Check
                            type="checkbox"
                            value={this.state.postInternalNotes}
                            onChange={this.onChangepostInternalNote}
                            label="Tick checkbox to post Internal Notes within agents"
                            />
                            </Col>
                            
                            </Form.Group>
                            <Form.Group  as={Row}>
                                <Form.Label column sm="2" className="formlabel">
                                    Response:
                            </Form.Label>
                            <Col sm="10">
                                    <Select
                                        styles={{
                                            // Fixes the overlapping problem of the component
                                            menu: provided => ({ ...provided, zIndex: 9999 })
                                        }}
                                        placeholder="Select a canned response"
                                        options={this.state.cannedOptions}
                                        onChange={this.onChangeCannedResponse.bind(this)}
                                    />
                                </Col>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <CKEditor
                                        onReady={(editor) => { }}
                                        data={this.state.responseMessage || ''}
                                        editor={ClassicEditor}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            this.state.responseMessage = data;
                                            console.log({ event, editor, data });
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.File
                                        className="customFile"
                                        multiple={false}
                                        onChange={this.selectFiles.bind(this, "files")}
                                        key={"files"}
                                        id={"files"}
                                        style={{ visibility: "hidden", display: "none" }}
                                    />
                                    <label className="labelFileUpload" for={"files"}>Choose file</label>
                                    {
                                        this.state.displayFileName === true && this.state.selectedFiles.map((file) => {
                                            return <Fragment>
                                                <p>{file.fileName} &nbsp;&nbsp;<i className="fa fa-trash-o" onClick={this.removeSelectedFile.bind(this, "files", file.key)}></i></p>
                                            </Fragment>

                                        })

                                    }
                                </Col>
                                <Col style={{ minWidth: "240px" },{paddingTop:"10px"}}>
                                <Form.Label className="formlabel">Change Status</Form.Label>
                                <Select
                                    styles={{
                                        // Fixes the overlapping problem of the component
                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                    }}
                                    options={this.state.statusOptions}
                                    onChange={this.onChangeTicketStatus.bind(this)}
                                    placeholder="Select status"
                                />
                            </Col>
                            </Row>
                            <button type="button" disabled={this.state.disablePostReplyButtonOnClick===true} onClick={this.postReply} className="btn btn-success">Post Reply</button>
                        </Form>
                    }
                    {
                        this.state.isAgent !== "true" &&
                        <Form>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2" className="formlabel">
                                    Response:
                            </Form.Label>
                            <Col sm="10">
                                    <Select
                                        styles={{
                                            // Fixes the overlapping problem of the component
                                            menu: provided => ({ ...provided, zIndex: 9999 })
                                        }}
                                        placeholder="Select a canned response"
                                        options={this.state.cannedOptions}
                                        onChange={this.onChangeCannedResponse.bind(this)}
                                    />
                                </Col>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <CKEditor
                                        onReady={(editor) => { }}
                                        data={this.state.responseMessage || ''}
                                        editor={ClassicEditor}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            this.state.responseMessage = data;
                                            console.log({ event, editor, data });
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.File
                                        className="customFile"
                                        multiple={false}
                                        onChange={this.selectFiles.bind(this, "files")}
                                        key={"files"}
                                        id={"files"}
                                        style={{ visibility: "hidden", display: "none" }}
                                    />
                                    <label className="labelFileUpload" for={"files"}>Choose file</label>
                                    {
                                        this.state.displayFileName === true && this.state.selectedFiles.map((file) => {
                                            return <Fragment>
                                                <p>{file.fileName} &nbsp;&nbsp;<i className="fa fa-trash-o" onClick={this.removeSelectedFile.bind(this, "files", file.key)}></i></p>
                                            </Fragment>

                                        })

                                    }
                                </Col>
                            </Row>
                            <button type="button" disabled={this.state.disablePostReplyButtonOnClick===true} onClick={this.postReply} className="btn btn-success">Post Reply</button>
                        </Form>
                    }
                </div> */}
      </div >

    )
  }
}

export default ViewTransferTicket;