import React, { Component } from "react";
import { Form } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import TicketDataService from "../../services/ticket.service";
import CommonUtils from "../Shared/commonUtils";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Fragment } from "react";
import * as Constants from "../Shared/constants";
import * as url from "../../http-common";
import "../Ticket/addTicket.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
class Ticket extends Component {
  constructor(props) {
    super(props);
    this.onChangeFullName = this.onChangeFullName.bind(this);
    this.onChangeSendNotice = this.onChangeSendNotice.bind(this);
    this.onChangeTicketSource = this.onChangeTicketSource.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
    this.onChangeHelpTopic = this.onChangeHelpTopic.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onChangeIssueSummary = this.onChangeIssueSummary.bind(this);
    this.onChangeDynamicText = this.onChangeDynamicText.bind(this);
    this.onChangeDynamicDropdownValues = this.onChangeDynamicDropdownValues.bind(this);
    this.onChangeTicketStatus = this.onChangeTicketStatus.bind(this);
    this.onChangeBooleanValue = this.onChangeBooleanValue.bind(this);
    this.onChangeDynamicMobileNo = this.onChangeDynamicMobileNo.bind(this);
    this.onChangeDynamicPhoneNo = this.onChangeDynamicPhoneNo.bind(this);
    this.onChangeDynamicDate = this.onChangeDynamicDate.bind(this);
    this.onChangeTicketCategory = this.onChangeTicketCategory.bind(this);
    this.onChangeUserEmail=this.onChangeUserEmail.bind(this);
    this.saveTicket = this.saveTicket.bind(this);
    this.removeSelectedFile = this.removeSelectedFile.bind(this);
    this.selectFiles = this.selectFiles.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this);
    this.onChangeEmployeeNo = this.onChangeEmployeeNo.bind(this);
    this.mandatoryDynamicFields=[];
    this.state = {
      selectedOption: {},
      fullName: "",
      sendNotice: true,
      ticketSourceOptions: [],
      departmentOptions: [],
      helpTopicOptions: [],
      userOptions: [],
      issueSummaryContent: "",
      issueSummaryHeader: "",
      userId: "",
      dynamicText: "",
      assigneeId: 0,
      assigneeFullName: "",
      statusOptions: [],
      files: [],
      s3FilesToUpload: [],
      ticketId: 0,
      isAgent: "NA",
      officeType: "",
      branch: "",
      isTicketCreatedOnBehalfOFAnotherPerson:false,
      originalTicketCreator:undefined,

      //Dyanamic Fields variables
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
      selectedFiles: [],
      displayFileName: false,
      menuIsOpen: false,
      employeeNo: null,
      slaPlan:undefined,
      nspiraCode:null,
      state:null,
      district:null,
      payrollCode:null
    };
    /* Fetch the ticket id from url*/
    var currentUrl = window.location.href;
    var idParam = currentUrl.split("/id:")
    this.state.ticketId = idParam[1];
    /*Ends-- Fetch the ticket id from url*/
  }

  componentDidMount() {
    this.state.userId = sessionStorage.getItem("userId");
    this.state.selectedOption.label = sessionStorage.getItem("email");
    this.state.employeeNo = sessionStorage.getItem("employeeId");
    this.getUserDetails();
    this.getTicketSourceOptions();
    this.getDepartmentOptions();
    // this.getHelpTopicOptions();
    this.getUserOptions();
    this.getTicketStatus();
    this.getTicketCategoryOptions();

    //Edit flow
    if (this.state.ticketId > 0) {
      this.getTicketDetailsByTicketId();
    }
  }
  //Toast Methods Starts
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
  showWarningToast = (msg) => {
    toast.warning(msg, {
      position: toast.POSITION.TOP_CENTER,
      className: "warning-toast"
    });
  };

  //Toast Methods Starts


  //Get and Save API Calls starts
  async saveTicket() {
    const assigneeName= CommonUtils.splitStringFromCharacter(this.state.assigneeFullName,"<",false);
    var data = {
      email: this.state.selectedOption.label,
      fullName: this.state.fullName,
      ticketNotice: this.state.sendNotice,
      ticketSourceId: this.state.id,
      ticketStatus: this.state.ticketStatus,
      departmentId: this.state.depId,
      helpTopicId: this.state.topicId,
      slaPlan: this.state.slaPlan,
      assigneeId: this.state.assigneeId || null,
      assigneeFullName: assigneeName || null,
      userId: this.state.userId,
      branch: this.state.branch,
      schCol: this.state.officeType,
      dynamicFormJson: this.state.customFieldsTextFields,
      filesUpload: this.state.s3FilesToUpload,
      ticketCategory: this.state.categoryName,
      employeeNo: this.state.employeeNo,
      openDepartmentIdOfUser:sessionStorage.getItem("userDepartment"),
      isTicketCreatedOnBehalfOFAnotherPerson:this.state.isTicketCreatedOnBehalfOFAnotherPerson,
      originalTicketCreator:this.state.originalTicketCreator,
      createdBy:parseInt(sessionStorage.getItem("userId")),
      nspiraCode: this.state.nspiraCode,
      state: this.state.state,
      district: this.state.district,
      payrollCode: this.state.payrollCode
    };

    //Start-Validation for dynamic fields.
    for(let mandatoryFields of this.mandatoryDynamicFields){

      if(this.state.customFieldsTextFields==={}){
        return this.showWarningToast("Please fill mandatory information");
      }
      
      if(this.state.customFieldsTextFields.hasOwnProperty(mandatoryFields)===false){
        return this.showWarningToast("Please fill mandatory information");
      }
      for(let obj of Object.entries(this.state.customFieldsTextFields)){
        if(obj[0]===mandatoryFields && (obj[1]==="" || obj[1]===null)){
          console.log(obj);
          return this.showWarningToast("Please fill mandatory information");
        }
      }
    }
   //End-Validation for dynamic fields.
   
    //Validation starts
    if (data.email === undefined || data.email === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.fullName === undefined || data.fullName === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.ticketNotice === undefined || data.ticketNotice === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if ((data.ticketSourceId === undefined || data.ticketSourceId === "") && this.state.isAgent === "true") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if ((data.ticketStatus === undefined || data.ticketStatus === "") && this.state.isAgent === "true") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.departmentId === undefined || data.departmentId === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.helpTopicId === undefined || data.helpTopicId === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.slaPlan === undefined || data.slaPlan === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.isAgent === "true" && (data.assigneeFullName === undefined || data.assigneeFullName === "")) {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.userId === undefined || data.userId === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.ticketCategory === undefined || data.ticketCategory === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if ((data.employeeNo === null || data.employeeNo === "") && this.state.isAgent!=="true") {
      return this.showWarningToast("Please fill mandatory information");
    }
    //Validation Ends
    console.log("Email" + data.email);
    console.log("FullName" + data.fullName);
    console.log("ticketNotice" + data.ticketNotice);
    console.log("ticketSourceId" + data.ticketSourceId);
    console.log("ticketStatus" + data.ticketStatus);
    console.log("departmentId" + data.departmentId);
    console.log("helpTopicId" + data.helpTopicId);
    console.log("slaPlan" + data.slaPlan);
    console.log("assigneeId" + data.assigneeId);
    console.log("assigneeFullName" + data.assigneeFullName);
    console.log("userId" + data.userId);
    console.log("branch" + data.branch);
    console.log("schCol" + data.schCol);
    console.log("DynamicFormJson: " + data.dynamicFormJson);
    console.log("File" + data.filesUpload);
    await TicketDataService.createTicket(data)
      .then(async (response) => {
        console.log(response.data);
        //Start insert ticketId and file Key in files table
        let fileKeysArray = [];
        const fileObj = {
          ticketId: response.data.id,
          fileKeysArray: fileKeysArray
        }
        for (let j of Object.entries(this.state.customFieldsTextFields)) {
          if (j[1] === true || j[1] === false) {
            continue;
          }
          if (j[1].toString().includes("ticket/")) {
            fileKeysArray.push(j[1]);
          }

        }
        await TicketDataService.createFileKeyEntry(fileObj).
          then(async(fileRes) => {
            console.log(fileRes.data);
          })

        //End insert ticketId and file Key in files table
        this.showSuccessToast()
        this.props.history.push("/ticket");
        window.location.reload();
      })
      .catch((e) => {
        this.showErrorToast();
        console.log(e);
      });
  }

  async getTicketDetailsByTicketId() {
    var data = {
      id: this.state.ticketId
    }
    await TicketDataService.getTicketDetailsByTicketId(data)
      .then((response) => {
        this.setState({ id: response.data.ticketSource.id, sourceName: response.data.ticketSource.sourceName });
        console.log("TicketId response" + response.data);
      })
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
            let menuIsOpen = true;
            this.setState({
              menuIsOpen
            });
            const tempArray = [];
            data.forEach((element) => {
              tempArray.push({
                label: `${element.email}`,
                name: `${element.fullName}`,
                value: element.id,
                employeeId:element.employeeId
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

  getTicketStatus() {
    const options = [
      {
        value: 1,
        label: "Open",
      },
      // {
      //   value: 2,
      //   label: "Awaiting for user response",
      // },
      // {
      //   value: 3,
      //   label: "Assigned to an engineer",
      // },
      // {
      //   value: 4,
      //   label: "Indent at Branch approval",
      // },
      // {
      //   value: 5,
      //   label: "Indent at DM approval",
      // },
      // {
      //   value: 6,
      //   label: "Indent at CO approval",
      // },
      // {
      //   value: 7,
      //   label: "Branch dependent",
      // },
      // {
      //   value: 8,
      //   label: "Warehouse dependent",
      // },
      // {
      //   value: 9,
      //   label: "Vendor dependent",
      // },
      // {
      //   value: 10,
      //   label: "Work in progress",
      // },
      // {
      //   value: 11,
      //   label: "Escalated to Next level",
      // },
      // {
      //   value: 12,
      //   label: "Resolved",
      // },
      // {
      //   value: 13,
      //   label: "Closed",
      // }
    ];
    this.setState({ statusOptions: options });
  }
  async getTicketSourceOptions() {
    const res = await TicketDataService.getAllTicketSource();
    const data = res.data;

    const options = data.map((d) => ({
      value: d.id,
      label: d.sourceName,
    }));

    this.setState({ ticketSourceOptions: options });
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

  async getDepartmentOptions() {
    const res = await TicketDataService.getAllDepartments();
    const data = res.data;

    const options = data.map((d) => ({
      value: d.id,
      label: d.departmentName,
    }));
    this.setState({ departmentOptions: options });
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


  getTicketCategoryOptions() {
    const options = [
      {
        value: 1,
        label: "Issue",
      },
      {
        value: 2,
        label: "Change Request",
      },
      {
        value: 3,
        label: "New Feature Request / Enhancement"
      },
      {
        value: 4,
        label: "New Project"
      }
    ];
    this.setState({ ticketCategoryOptions: options });
  }

  getUserDetails() {
    const obj = {
      id: this.state.userId,
    }
    TicketDataService.getUserDetails(obj)
      .then((response) => {
        this.setState({ isAgent: response.data.isAgent });
        this.setState({ officeType: response.data.officeType });
        this.setState({ fullName: response.data.fullName });
        this.setState({originalTicketCreator:response.data.fullName});

        //Start-check to default set the ticket status open for user.
        if (response.data.isAgent !== "true") {
          this.setState({ statusId: 1, ticketStatus: "Open" })
          //Manual update the ticket source of user to NA is logged-in user is normal user
          this.setState({ id: 4, sourceName: "NA" });

          //Update the send alert flag to true is loggedIn user is not agent.
          this.setState({ sendNotice: true });
        }
        //End-check to default set the ticket status open for user.
      })

  }

  //Get and Save API Calls ends


  //Change methods starts
  async onChangeTicketStatus(e) {
    console.log(e);
    await this.setState({ statusId: e.value, ticketStatus: e.label }, () => {
    });
  }

  onChangeUserEmail(e){
    console.log(e);
    let obj={
      value:e.target.value,
      label:e.target.value,
    }
    this.setState({selectedOption:obj});
  }
  onSearchChange = (selectedOption) => {
    let menuIsOpen = false;
    if (selectedOption) {
      menuIsOpen = false;
      this.setState({
        menuIsOpen
      });
      this.setState({
        selectedOption,
      });
      console.log(selectedOption);
      this.state.fullName = selectedOption.name; //Auto populate the fullname based on user email.
      this.state.employeeNo=selectedOption.employeeId;//Auto populate the Employee No based on user email.
    }
    this.setState({userId:selectedOption.value});

    //Update the isTicketCreatedOnBehalfOFAnotherPerson flag if ticket is created by another agent.
    if(sessionStorage.getItem("userId")!==selectedOption.value){
      this.setState({isTicketCreatedOnBehalfOFAnotherPerson:true});
    }
  };

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
  onChangeFullName(e) {
    this.setState({
      fullName: e.target.value,
    });
  }
  onChangeEmployeeNo(e) {
    this.setState({
      employeeNo: e.target.value
    })
  }
  onChangeIssueSummary(e) {
    this.setState({
      issueSummaryHeader: e.target.value,
    });
  }
  onChangeSendNotice(e) {
    if (this.state.sendNotice === false) {
      this.setState({
        sendNotice: true,
      });
    } else {
      this.setState({
        sendNotice: false,
      });
    }
  }

  onChangeTicketSource(e) {
    this.setState({ id: e.value, sourceName: e.label });
  }

  async onChangeDepartment(e) {
    this.setState({ topicId: undefined, topicName: undefined });
    this.setState({ assigneeFullName: "", assigneeId: "" });
    this.state.dynamicFormFieldsData=[];
    this.state.customFieldsTextFields={};
    this.setState({slaPlan:""});
    this.setState({ nspiraCode: null });
    this.setState({ district: null });
    this.setState({ state: null });
    this.setState({ payrollCode: null });
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
  async onChangeHelpTopic(e) {
    this.setState({dynamicFormFieldsData:[]});
    this.setState({customFieldsTextFields:{}});
    this.setState({slaPlan:null});
    this.setState({ nspiraCode: null });
    this.setState({ district: null });
    this.setState({ state: null });
    this.setState({ payrollCode: null });
    this.setState({ assigneeFullName: "", assigneeId: "" });
  
    //Get helpTopic By Id
    const dataObj = {
      id: e.value,
    };

    const res = await TicketDataService.getAllHelpTopicById(dataObj);
    const data = res.data;
    this.state.dynamicFormFieldsData = data.dynamicFormDetails;
    //End

    //Start-Auto populate the SLA plan based on helptopic selected
    
    if(data.sla==="1"){
      this.setState({ slaId: 1, slaPlan: Constants.SLA_PLAN_1DAY });
    }else if(data.sla==="2"){
      this.setState({ slaId: 2, slaPlan: Constants.SLA_PLAN_2DAY });
    }else if(data.sla==="3"){
      this.setState({ slaId: 3, slaPlan: Constants.SLA_PLAN_3DAY });
    }else if(data.sla==="4"){
      this.setState({ slaId: 4, slaPlan: Constants.SLA_PLAN_4DAY });
    }else if(data.sla==="5"){
      this.setState({ slaId: 5, slaPlan: Constants.SLA_PLAN_5DAY });
    }else if(data.sla==="6"){
      this.setState({ slaId: 6, slaPlan: Constants.SLA_PLAN_6DAY });
    }else if(data.sla==="7"){
      this.setState({ slaId: 7, slaPlan: Constants.SLA_PLAN_7DAY });
    }else if(data.sla==="8"){
      this.setState({ slaId: 8, slaPlan: Constants.SLA_PLAN_8DAY });
    }else if(data.sla==="9"){
      this.setState({ slaId: 9, slaPlan: Constants.SLA_PLAN_9DAY });
    }else if(data.sla==="10"){
      this.setState({ slaId: 10, slaPlan: Constants.SLA_PLAN_10DAY });
    }else if(data.sla==="11"){
      this.setState({ slaId: 11, slaPlan: Constants.SLA_PLAN_11DAY });
    }else if(data.sla==="12"){
      this.setState({ slaId: 12, slaPlan: Constants.SLA_PLAN_12DAY });
    }else if(data.sla==="13"){
      this.setState({ slaId: 13, slaPlan: Constants.SLA_PLAN_13DAY });
    }else if(data.sla==="14"){
      this.setState({ slaId: 14, slaPlan: Constants.SLA_PLAN_14DAY });
    }else if(data.sla==="15"){
      this.setState({ slaId: 15, slaPlan: Constants.SLA_PLAN_15DAY });
    }else if(data.sla==="16"){
      this.setState({ slaId: 16, slaPlan: Constants.SLA_PLAN_16DAY });
    }else if(data.sla==="17"){
      this.setState({ slaId: 17, slaPlan: Constants.SLA_PLAN_17DAY });
    }else if(data.sla==="18"){
      this.setState({ slaId: 18, slaPlan: Constants.SLA_PLAN_18DAY });
    }else if(data.sla==="19"){
      this.setState({ slaId: 19, slaPlan: Constants.SLA_PLAN_19DAY });
    }else if(data.sla==="20"){
      this.setState({ slaId: 20, slaPlan: Constants.SLA_PLAN_20DAY });
    }else if(data.sla==="21"){
      this.setState({ slaId: 21, slaPlan: Constants.SLA_PLAN_21DAY });
    }else if(data.sla==="22"){
      this.setState({ slaId: 22, slaPlan: Constants.SLA_PLAN_22DAY });
    }else if(data.sla==="23"){
      this.setState({ slaId: 23, slaPlan: Constants.SLA_PLAN_23DAY });
    }else if(data.sla==="24"){
      this.setState({ slaId: 24, slaPlan: Constants.SLA_PLAN_24DAY });
    }else if(data.sla==="25"){
      this.setState({ slaId: 25, slaPlan: Constants.SLA_PLAN_25DAY });
    }else if(data.sla==="26"){
      this.setState({ slaId: 26, slaPlan: Constants.SLA_PLAN_26DAY });
    }else if(data.sla==="27"){
      this.setState({ slaId: 27, slaPlan: Constants.SLA_PLAN_27DAY });
    }else if(data.sla==="28"){
      this.setState({ slaId: 28, slaPlan: Constants.SLA_PLAN_28DAY });
    }else if(data.sla==="29"){
      this.setState({ slaId: 29, slaPlan: Constants.SLA_PLAN_29DAY });
    }else if(data.sla==="30"){
      this.setState({ slaId: 30, slaPlan: Constants.SLA_PLAN_30DAY });
    }
    //END-Auto populate the SLA plan based on helptopic selected

    //fetch the L1 assignee Details
    if (data.module) {
      const obj = {
        department: this.state.deptName,
        module: data.module,
        openDepartmentId: sessionStorage.getItem("userDepartment")
      }

      //If office type is school
      if (Constants.SCHOOL_OFFICE_TYPES.includes(this.state.officeType.toLowerCase())) {
        const response = await TicketDataService.getSchoolEscalationAssignee(obj);

        if (response.data.message) {
          return this.showWarningToast(response.data.message);
        }

        //If response is array of objects.
        if (response.data.length >= 1) {
          //search for user in DB
          for (var i of response.data) {
            this.setState({ branch: i.branch });
            this.setState({ nspiraCode: i.nspiraCode });
            this.setState({ district: i.district });
            this.setState({ state: i.state });
            this.setState({ payrollCode: i.payrollCode });
            const isDataPresentResponse = await TicketDataService.findUserByEmail(i.l1email);

            if (isDataPresentResponse.data === "No Data Found") {
              this.showWarningToast(`Assignee details have not found. Please report the error at ${Constants.LBL_HELPDESK_EMAIL}.`);
            }
            if (isDataPresentResponse.data !== "No Data Found") {
              this.setState({ assigneeFullName: i.l1name + `<${i.l1email}>`, assigneeId: isDataPresentResponse.data.id });
              console.log("assignee" + this.state.assigneeFullName, "assigneeId" + this.state.assigneeId);
            }

          }
        }
        else {
          //If response is single object
          this.setState({ branch: response.data.branch })
          this.setState({ nspiraCode: response.data.nspiraCode });
          this.setState({ district: response.data.district });
          this.setState({ state: response.data.state });
          this.setState({ payrollCode: response.data.payrollCode });
          const isDataPresentResponse = await TicketDataService.findUserByEmail(response.data.l1email);

          if (isDataPresentResponse.data === "No Data Found") {
            // this.showWarningToast("Assignee details not present in database.");
            this.showWarningToast(`Assignee details have not found. Please report the error at ${Constants.LBL_HELPDESK_EMAIL}.`);
          }
          if (isDataPresentResponse.data !== "No Data Found") {
            this.setState({ assigneeFullName: response.data.l1name + `<${response.data.l1email}>`, assigneeId: isDataPresentResponse.data.id });
            console.log("assignee" + this.state.assigneeFullName, "assigneeId" + this.state.assigneeId);
          }
        }

      }

      //If office type is college
      if (Constants.COLLEGE_OFFICE_TYPES.includes(this.state.officeType.toLowerCase())) {
        console.log(this.state.officeType.toLowerCase());
        const response = await TicketDataService.getCollegeEscalationAssignee(obj);
        if (response.data.message) {
          return this.showWarningToast(response.data.message);
        }

        //search for user in DB

        //If response is array of objects.
        if (response.data.length >= 1) {
          for (var i of response.data) {
            this.setState({ branch: i.branch });
            this.setState({ nspiraCode: i.nspiraCode });
            this.setState({ district: i.district });
            this.setState({ state: i.state });
            this.setState({ payrollCode: i.payrollCode });
            const isDataPresentResponse = await TicketDataService.findUserByEmail(i.l1email);

            if (isDataPresentResponse.data === "No Data Found") {
              // this.showWarningToast("Assignee details not present in database.");
              this.showWarningToast(`Assignee details have not found. Please report the error at ${Constants.LBL_HELPDESK_EMAIL}.`);
            }

            if (isDataPresentResponse.data !== "No Data Found") {
              this.setState({ assigneeFullName: i.l1name + `<${i.l1email}>`, assigneeId: isDataPresentResponse.data.id });
              console.log("assignee" + this.state.assigneeFullName, "assigneeId" + this.state.assigneeId);
            }

          }
        }
        else {
          //If response is single object
          this.setState({ branch: response.data.branch });
          this.setState({ nspiraCode: response.data.nspiraCode });
          this.setState({ district: response.data.district });
          this.setState({ state: response.data.state });
          this.setState({ payrollCode: response.data.payrollCode });
          const isDataPresentResponse = await TicketDataService.findUserByEmail(response.data.l1email);
          if (isDataPresentResponse.data === "No Data Found") {
            // this.showWarningToast("Assignee details not present in database.");
            this.showWarningToast(`Assignee details have not found. Please report the error at ${Constants.LBL_HELPDESK_EMAIL}.`);
          }
          if (isDataPresentResponse.data !== "No Data Found") {
            this.setState({ assigneeFullName: response.data.l1name + `<${response.data.l1email}>`, assigneeId: isDataPresentResponse.data.id });
            console.log("assignee" + this.state.assigneeFullName, "assigneeId" + this.state.assigneeId);
          }
        }

      }
      //If office type is administrative branches
      if (Constants.ADMIN_OFFICE_TYPES.includes(this.state.officeType.toLowerCase())) {
        const response = await TicketDataService.getAdministrativeEscalationAssignee(obj);
        if (response.data.message) {
          return this.showWarningToast(response.data.message);
        }

        //search for user in DB

        //If response is array of objects.
        if (response.data.length >= 1) {
          for (var i of response.data) {
            this.setState({ branch: i.branch });
            this.setState({ nspiraCode: i.nspiraCode });
            this.setState({ district: i.district });
            this.setState({ state: i.state });
            this.setState({ payrollCode: i.payrollCode });
            const isDataPresentResponse = await TicketDataService.findUserByEmail(i.l1email);

            if (isDataPresentResponse.data === "No Data Found") {
              // this.showWarningToast("Assignee details not present in database.");
              this.showWarningToast(`Assignee details have not found. Please report the error at ${Constants.LBL_HELPDESK_EMAIL}.`);
            }

            if (isDataPresentResponse.data !== "No Data Found") {
              this.setState({ assigneeFullName: i.l1name + `<${i.l1email}>`, assigneeId: isDataPresentResponse.data.id });
              console.log("assignee" + this.state.assigneeFullName, "assigneeId" + this.state.assigneeId);
            }

          }
        }
        else {
          //If response is single object
          this.setState({ branch: response.data.branch });
          this.setState({ nspiraCode: response.data.nspiraCode });
          this.setState({ district: response.data.district });
          this.setState({ state: response.data.state });
          this.setState({ payrollCode: response.data.payrollCode });
          const isDataPresentResponse = await TicketDataService.findUserByEmail(response.data.l1email);
          if (isDataPresentResponse.data === "No Data Found") {
            // this.showWarningToast("Assignee details not present in database.");
            this.showWarningToast(`Assignee details have not found. Please report the error at ${Constants.LBL_HELPDESK_EMAIL}.`);
          }
          if (isDataPresentResponse.data !== "No Data Found") {
            this.setState({ assigneeFullName: response.data.l1name + `<${response.data.l1email}>`, assigneeId: isDataPresentResponse.data.id });
            console.log("assignee" + this.state.assigneeFullName, "assigneeId" + this.state.assigneeId);
          }
        }

      }
    }

    this.setState({
      topicId: e.value,
      topicName: e.label,
    });
  }

  onChangeUser(e) {
    this.state.userId = sessionStorage.getItem("userId");
    const assigneeName= CommonUtils.splitStringFromCharacter(e.label,"<",false);
    this.setState({ assigneeId: e.value, assigneeFullName: assigneeName });
  }

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
  removeSelectedFile(id, fileKey, e) {

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
  onChangeTicketCategory(e) {
    this.setState({ categoryId: e.value, categoryName: e.label });
  }
  //Change methods ends

  handleOnFocus() {
    this.setState({ menuIsOpen: false });
    this.setState(({ selectedOption: {} }));
    this.setState({fullName:""});
    this.setState({employeeNo:""});
  }
  handleFocusOut() {
    this.setState({ menuIsOpen: false })
  }
  render() {
    this.mandatoryDynamicFields=[];
    if (this.state.isAgent === "NA") {
      return null;
    }
    return (
      <div>
        <div>
          <Form>
            {
              this.state.isAgent === "true" &&
              <Fragment>
            <h5 className="formHeading" style={{ marginTop: "20px" }}>Open a New Ticket</h5>
            <Form.Group controlId="formEmployeeNo">
              <Form.Label className="formlabel">Employee Id</Form.Label>
              <Form.Control
                type="text"
                value={this.state.employeeNo}
                onChange={this.onChangeEmployeeNo}
                placeholder="Enter Employee Id"
              />
            </Form.Group>
              </Fragment>
            }
            {
              this.state.isAgent!=="true" &&
              <Fragment>
              <Form.Group controlId="formEmployeeNo">
              <Form.Label className="formlabel required">Employee Id</Form.Label>
              <Form.Control
                type="text"
                value={this.state.employeeNo}
                onChange={this.onChangeEmployeeNo}
                placeholder="Enter Employee Id"
              />
            </Form.Group>
              </Fragment>
            }
            
            {this.state.isAgent === "true"&&
              <Form.Group controlId="formBasicEmail">
                <Form.Label className="formlabel required">
                  Email address
              </Form.Label>
                <AsyncSelect
                  value={this.state.selectedOption}
                  loadOptions={this.fetchData}
                  placeholder="Search email"
                  onChange={(e) => {
                    this.onSearchChange(e);
                  }}
                  defaultOptions={false}
                  menuIsOpen={this.state.menuIsOpen}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleFocusOut}
                />
              </Form.Group>
            }
            {
              (this.state.isAgent === "false" || this.state.isAgent === null || this.state.isAgent === "null") &&
              <Form.Group controlId="formBasicEmail1">
                <Form.Label className="formlabel required">
                  Email address
              </Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.selectedOption.label}
                  placeholder="Enter email"
                  onChange={this.onChangeUserEmail}

                />
              </Form.Group>
            }

            <Form.Group controlId="formBasicFullName">
              <Form.Label className="formlabel required">Full Name</Form.Label>
              <Form.Control
                type="text"
                value={this.state.fullName}
                onChange={this.onChangeFullName}
                placeholder="Enter name"
              />
            </Form.Group>
            <Form.Group controlId="formBasicTicketSource">
              <Form.Label className="formlabel required">
                Ticket Category
              </Form.Label>
              <Select
                options={this.state.ticketCategoryOptions}
                onChange={this.onChangeTicketCategory.bind(this)}
              />
            </Form.Group>
            {/* {
              this.state.isAgent === "true" &&
              <Form.Group controlId="formBasicCheckbox">
                <Form.Label className="formlabel">Ticket Notice</Form.Label>
                <Form.Check
                  type="checkbox"
                  value={this.state.sendNotice}
                  onChange={this.onChangeSendNotice}
                  label="Send alert to user"
                />
              </Form.Group>
            } */}

            <h5 className="formHeading required">
              Ticket Information and Options
            </h5>
            {
              this.state.isAgent === "true" &&
              <Form.Group controlId="formBasicTicketSource">
                <Form.Label className="formlabel required">
                  Ticket Source
              </Form.Label>
                <Select
                  options={this.state.ticketSourceOptions}
                  onChange={this.onChangeTicketSource.bind(this)}
                />
              </Form.Group>
            }

            {
              this.state.isAgent === "true" &&
              <Form.Group controlId="formBasicTicketStatus">
                <Form.Label className="formlabel required">Ticket Status</Form.Label>
                <Select
                  options={this.state.statusOptions}
                  onChange={this.onChangeTicketStatus.bind(this)}
                  placeholder="Select status"
                />
              </Form.Group>
            }

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
            <Form.Group controlId="formBasicSLAPlan">
              <Form.Label className="formlabel required">SLA Plan</Form.Label>
              <Form.Control
                readOnly
                type="text"
                value={this.state.slaPlan}
                placeholder="Select a SLA Plan"
              />
            </Form.Group>
            {/* {this.state.isAgent === "true" &&
              <Form.Group controlId="formBasicSLAPlan">
                <Form.Label className="formlabel required">Assign To</Form.Label>
                <Select
                  options={this.state.userOptions}
                  onChange={this.onChangeUser.bind(this)}
                  placeholder="Select a assignee"
                />
              </Form.Group>
            } */}
            <Form.Group controlId="assignee">
              <Form.Label className="formlabel required">Assignee Name</Form.Label>
              <Form.Control
                readOnly
                type="text"
                value={this.state.assigneeFullName}
                placeholder="Enter name"
              />
            </Form.Group>

            {this.state.dynamicFormFieldsData.map((form, formindex) => {
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
                    if(formFields.required===true){
                      this.mandatoryDynamicFields.push(formFieldIdWithIndex);
                    }
                    console.log(this.mandatoryDynamicFields);
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
                                  onChange={this.selectFiles.bind(this, "Attachments")}
                                  key={"Attachments"}
                                  id={"Attachments"}
                                  style={{ visibility: "hidden", display: "none" }}
                                />
                                <label className="labelFileUpload" for={"Attachments"}>Choose file</label>
                                {
                                  this.state.displayFileName === true && this.state.selectedFiles.map((file) => {

                                    return <Fragment>
                                      <p>{file.fileName} &nbsp;&nbsp;<i className="fa fa-trash-o" onClick={this.removeSelectedFile.bind(this, "Attachments", file.key)}></i></p>
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
                            onChange={this.selectFiles.bind(this, formFieldIdWithIndex)}
                            key={formFieldIdWithIndex}
                            id={formFieldIdWithIndex}
                            style={{ visibility: "hidden", display: "none" }}
                          />
                          <label className="labelFileUpload" for={formFieldIdWithIndex}>Choose file</label>
                          {
                            this.state.displayFileName === true && this.state.selectedFiles.map((file) => {
                              if (formFieldIdWithIndex.match(file.id)) {
                                return <Fragment>
                                  <p>{file.fileName} &nbsp;&nbsp;<i className="fa fa-trash-o" onClick={this.removeSelectedFile.bind(this, formFieldIdWithIndex, file.key)}></i></p>
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
            })}
            <button
              type="button"
              onClick={this.saveTicket}
              className="btn btn-success"
            >
              Submit
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Ticket;
