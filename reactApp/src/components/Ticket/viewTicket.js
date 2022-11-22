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
import { Link } from "react-router-dom";
import Select from "react-select";
import { Fragment } from "react";
import * as Constants from "../Shared/constants";
import DatePicker from 'react-datepicker';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

class TicketView extends Component {
    constructor(props) {
        super(props);
        this.postReply = this.postReply.bind(this);
        this.onChangeTicketStatus = this.onChangeTicketStatus.bind(this);
        this.removeSelectedFile = this.removeSelectedFile.bind(this);
        this.selectFiles = this.selectFiles.bind(this);
        this.onChangeAssignee = this.onChangeAssignee.bind(this);
        this.bulkUpdate = this.bulkUpdate.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.onclickShowDepartmentPopup = this.onclickShowDepartmentPopup.bind(this);
        this.onCloseDepartmentPopup = this.onCloseDepartmentPopup.bind(this);
        this.onChangeDepartment = this.onChangeDepartment.bind(this);
        this.transferTicket = this.transferTicket.bind(this);
        this.onChangeCannedResponse = this.onChangeCannedResponse.bind(this);
        this.onChangepostInternalNote = this.onChangepostInternalNote.bind(this);
        this.onChangeSubCategory = this.onChangeSubCategory.bind(this);
        this.onAssigneeNameChange = this.onAssigneeNameChange.bind(this);
        this.transferBack = this.transferBack.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleFocusOut = this.handleFocusOut.bind(this);
        this.onChangeSLAPLAN = this.onChangeSLAPLAN.bind(this);
        this.toggleClass = this.toggleClass.bind(this);
        this.updateSLA = this.updateSLA.bind(this);
        this.onChangeTransferAssignee = this.onChangeTransferAssignee.bind(this);
        this.onChangeHelpTopic = this.onChangeHelpTopic.bind(this);
        this.viewTicketDetailsJson = {}
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
            userId: "",
            ticketReplies: [],
            dynamicFields: [],
            assigneeOptions: [],
            subCategoryOptions: [],
            cannedOptions: [],
            branch: "",
            subCategory: undefined,
            arrayOfSelectedId: [],
            ticketStatus: "",
            selectedFiles: [],
            displayFileName: false,
            showDepartmentSelectionPopup: false,
            departmentOptions: [],
            isTicketWronglyAssignedFlow: 1,
            transferMessage: "",
            postInternalNotes: false,
            disablePostReplyButtonOnClick: false,
            isCentralPoolAgent: false,
            selectedAssigneeOption: {},
            assigneeId: undefined,
            menuIsOpen: false,
            assigneeBranchName: undefined,
            currentTicketStatus: "",
            active: false,
            dataPath: undefined,
            transferAssignee: [],
            showTransferAssignee: false,
            assigneeLabel:"Change Assignee",
            currentTicketStatus:"",
            active:false,
            showImage : false,
            dataPath:undefined,
            loggedInUserEmail:undefined,
            lbl_Post_Reply:"Post Reply",
            showHelptopicDropdown: false,
            nspiraCode:null,
            state:null,
            district:null,
            payrollCode:null
        }
        this.slaPlan = undefined;
        /* Fetch the ticket id from url*/
        var currentUrl = window.location.href;
        var idParam = currentUrl.split("/id:")
        this.state.ticketId = idParam[1];
        /*Ends-- Fetch the ticket id from url*/
        this.state.userId = sessionStorage.getItem("userId");

        this.selectedTranferDepartment = undefined;
        this.selectedTransferAssignee = undefined;
        this.showOnlyLeadTeamMembers=false;
        this.state.loggedInUserEmail=sessionStorage.getItem("email");
    }

    /*Starts-- API calls */
    async getTicketDetailsByTicketId() {
        var data = {
            id: this.state.ticketId
        }
        TicketDataService.getTicketDetailsByTicketId(data)
            .then((response) => {
                let dynamicForm = response.data.helptopic.dynamicFormDetails;
                for (let l of dynamicForm) {
                    console.log(l.fields);
                    for (let formLabel of l.fields) {
                        console.log(formLabel);
                        if (formLabel.label === 'Sub Category') {
                            let dropDownValues = [];
                            for (let k of formLabel.values) {
                                dropDownValues.push({
                                    value: k.index,
                                    label: k
                                })
                            }
                            this.setState({ subCategoryOptions: dropDownValues });
                        }
                    }
                }
                this.setState({ ticketData: response.data });
                this.setState({ branch: response.data.branch });
                this.setState({ assigneeBranchName: response.data.assigneeBranchCode });
                this.setState({ currentTicketStatus: response.data.ticketStatus });
                this.setState({ nspiraCode: response.data.nspiraCode });
                this.setState({ state: response.data.state });
                this.setState({ district: response.data.district });
                this.setState({ payrollCode: response.data.payrollCode });
                

                let centralPool = sessionStorage.getItem("isCentralPoolAgent");
                if (centralPool === "true" && this.showOnlyLeadTeamMembers===false) {
                    this.getAssigneeOptionsForCentralPool();
                } else{
                    this.getAssigneeOptions();
                }
                console.log("Response" + JSON.stringify(response.data));
                if (response.data.dynamicFormField1 !== null) {
                    let originalString = response.data.dynamicFormField1;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField2 !== null) {
                    let originalString = response.data.dynamicFormField2;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField3 !== null) {
                    let originalString = response.data.dynamicFormField3;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;
                }
                if (response.data.dynamicFormField4 !== null) {
                    let originalString = response.data.dynamicFormField4;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField5 !== null) {
                    let originalString = response.data.dynamicFormField5;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;
                }
                if (response.data.dynamicFormField6 !== null) {
                    let originalString = response.data.dynamicFormField6;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField7 !== null) {
                    let originalString = response.data.dynamicFormField7;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField8 !== null) {
                    let originalString = response.data.dynamicFormField8;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField9 !== null) {
                    let originalString = response.data.dynamicFormField9;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField10 !== null) {
                    let originalString = response.data.dynamicFormField10;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField11 !== null) {
                    let originalString = response.data.dynamicFormField11;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField12 !== null) {
                    let originalString = response.data.dynamicFormField12;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField13 !== null) {
                    let originalString = response.data.dynamicFormField13;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;
                }
                if (response.data.dynamicFormField14 !== null) {
                    let originalString = response.data.dynamicFormField14;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField15 !== null) {
                    let originalString = response.data.dynamicFormField15;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField16 !== null) {
                    let originalString = response.data.dynamicFormField16;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField17 !== null) {
                    let originalString = response.data.dynamicFormField17;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField18 !== null) {
                    let originalString = response.data.dynamicFormField18;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField19 !== null) {
                    let originalString = response.data.dynamicFormField19;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField20 !== null) {
                    let originalString = response.data.dynamicFormField20;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField21 !== null) {
                    let originalString = response.data.dynamicFormField21;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField22 !== null) {
                    let originalString = response.data.dynamicFormField22;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField23 !== null) {
                    let originalString = response.data.dynamicFormField23;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField24 !== null) {
                    let originalString = response.data.dynamicFormField24;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField25 !== null) {
                    let originalString = response.data.dynamicFormField25;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField26 !== null) {
                    let originalString = response.data.dynamicFormField26;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField27 !== null) {
                    let originalString = response.data.dynamicFormField27;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField28 !== null) {
                    let originalString = response.data.dynamicFormField28;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField29 !== null) {
                    let originalString = response.data.dynamicFormField29;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField30 !== null) {
                    let originalString = response.data.dynamicFormField30;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField31 !== null) {
                    let originalString = response.data.dynamicFormField31;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField32 !== null) {
                    let originalString = response.data.dynamicFormField32;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField33 !== null) {
                    let originalString = response.data.dynamicFormField33;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField34 !== null) {
                    let originalString = response.data.dynamicFormField34;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField35 !== null) {
                    let originalString = response.data.dynamicFormField35;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField36 !== null) {
                    let originalString = response.data.dynamicFormField36;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField37 !== null) {
                    let originalString = response.data.dynamicFormField37;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField38 !== null) {
                    let originalString = response.data.dynamicFormField38;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField39 !== null) {
                    let originalString = response.data.dynamicFormField39;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

                }
                if (response.data.dynamicFormField40 !== null) {
                    let originalString = response.data.dynamicFormField40;
                    let key = originalString.substring(0, originalString.indexOf(","));
                    let value = originalString.substring(originalString.indexOf(",") + 1, originalString.length);
                    this.viewTicketDetailsJson[key] = value;

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

    onChangeSLAPLAN(date) {
        this.setState({ newSLAPlan: date });
        //Start: Fetch the number of days for SLA.

        let createdDateOfTicket = new Date(this.state.ticketData.initialCreatedDate);
        let userSelectedDate = new Date(date);
        const diffTime = Math.abs(userSelectedDate - createdDateOfTicket);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log("Days" + diffDays.toString());
        if (diffDays.toString() === "1") {
            this.slaPlan = Constants.SLA_PLAN_1DAY;
        } else if (diffDays.toString() === "2") {
            this.slaPlan = Constants.SLA_PLAN_2DAY;
        } else if (diffDays.toString() === "3") {
            this.slaPlan = Constants.SLA_PLAN_3DAY;
        } else if (diffDays.toString() === "4") {
            this.slaPlan = Constants.SLA_PLAN_4DAY;
        } else if (diffDays.toString() === "5") {
            this.slaPlan = Constants.SLA_PLAN_5DAY;
        } else if (diffDays.toString() === "6") {
            this.slaPlan = Constants.SLA_PLAN_6DAY;
        } else if (diffDays.toString() === "7") {
            this.slaPlan = Constants.SLA_PLAN_7DAY;
        } else if (diffDays.toString() === "8") {
            this.slaPlan = Constants.SLA_PLAN_8DAY;
        } else if (diffDays.toString() === "9") {
            this.slaPlan = Constants.SLA_PLAN_9DAY;
        } else if (diffDays.toString() === "10") {
            this.slaPlan = Constants.SLA_PLAN_10DAY;
        } else if (diffDays.toString() === "11") {
            this.slaPlan = Constants.SLA_PLAN_11DAY;
        } else if (diffDays.toString() === "12") {
            this.slaPlan = Constants.SLA_PLAN_12DAY;
        } else if (diffDays.toString() === "13") {
            this.slaPlan = Constants.SLA_PLAN_13DAY;
        } else if (diffDays.toString() === "14") {
            this.slaPlan = Constants.SLA_PLAN_14DAY;
        } else if (diffDays.toString() === "15") {
            this.slaPlan = Constants.SLA_PLAN_15DAY;
        } else if (diffDays.toString() === "16") {
            this.slaPlan = Constants.SLA_PLAN_16DAY;
        } else if (diffDays.toString() === "17") {
            this.slaPlan = Constants.SLA_PLAN_17DAY;
        } else if (diffDays.toString() === "18") {
            this.slaPlan = Constants.SLA_PLAN_18DAY;
        } else if (diffDays.toString() === "19") {
            this.slaPlan = Constants.SLA_PLAN_19DAY;
        } else if (diffDays.toString() === "20") {
            this.slaPlan = Constants.SLA_PLAN_20DAY;
        } else if (diffDays.toString() === "21") {
            this.slaPlan = Constants.SLA_PLAN_21DAY;
        } else if (diffDays.toString() === "22") {
            this.slaPlan = Constants.SLA_PLAN_22DAY;
        } else if (diffDays.toString() === "23") {
            this.slaPlan = Constants.SLA_PLAN_23DAY;
        } else if (diffDays.toString() === "24") {
            this.slaPlan = Constants.SLA_PLAN_24DAY;
        } else if (diffDays.toString() === "25") {
            this.slaPlan = Constants.SLA_PLAN_25DAY;
        } else if (diffDays.toString() === "26") {
            this.slaPlan = Constants.SLA_PLAN_26DAY;
        } else if (diffDays.toString() === "27") {
            this.slaPlan = Constants.SLA_PLAN_27DAY;
        } else if (diffDays.toString() === "28") {
            this.slaPlan = Constants.SLA_PLAN_28DAY;
        } else if (diffDays.toString() === "29") {
            this.slaPlan = Constants.SLA_PLAN_29DAY;
        } else if (diffDays.toString() === "30") {
            this.slaPlan = Constants.SLA_PLAN_30DAY;
        } else {
            this.slaPlan = diffDays.toString() + ' ' + 'Day';
        }
        console.log(this.slaPlan);
        //End: Fetch the number of days for SLA.
    }
    async getAssigneeOptions() {
        //Show team Lead assignee list if user is coming from my teams page.
        if (this.showOnlyLeadTeamMembers === true) {
            const obj = {
                teamId: sessionStorage.getItem("previousSelectedTeamId")
            }
            const res = await TicketDataService.getAssigneeListByTeam(obj);
            const data = res.data;

            const options = data.map((d) => ({
                value: d.id,
                label: `${d.fullName}<${d.email}> `,
            }));

            this.setState({ assigneeOptions: options });
            this.setState({assigneeLabel:'Select your Team Agent'});
        } else {

            const obj = {
                assigneeBranchName: this.state.assigneeBranchName
            }
            const res = await TicketDataService.getUsersByBranch(obj);
            const data = res.data;

            const options = data.map((d) => ({
                value: d.id,
                label: `${d.fullName}<${d.email}> `,
            }));

            this.setState({ assigneeOptions: options });
        }
    }
    async getAssigneeOptionsForCentralPool() {
        const res = await TicketDataService.getAllUser();
        const data = res.data;

        const options = data.map((d) => ({
            value: d.id,
            label: `${d.fullName}<${d.email}> `,
        }));

        this.setState({ assigneeOptions: options });
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
    async bulkUpdate() {

        //Validations Starts
        if (!this.state.ticketStatus && !this.state.assigneeFullName && !this.state.subCategory) {
            // return this.showWarningToast("Please select Ticket Status and/or Assignee");
            return null;
        }

        //Validations Ends
        var data = {
            ticketStatus: this.state.ticketStatus,
            id: this.state.arrayOfSelectedId,
            assigneeFullName: this.state.assigneeFullName,
            assigneeId: this.state.assigneeId,
            userId: sessionStorage.getItem("userId"),
            userMobile: sessionStorage.getItem("mobile"),
            ticketSubCategory: this.state.subCategory

        };
        await TicketDataService.bulkUpdateTicketStatusAndAssignee(data)
            .then((response) => {
                console.log(response.data);
                if(response.data.success===false && response.data.message){
                    this.showErrorToast(response.data.message);
                }
                // this.showSuccessToast("Details updated successfully");
                // this.props.history.push("/ticket");
                // ReactDOM.findDOMNode(this.messageForm).reset();
            })
            .catch((e) => {
                this.showErrorToast();
                console.log(e);
            });
        // window.location.reload(false);
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
    onChangeAssignee(e) {
        this.state.userId = e.value;
        this.setState({ assigneeId: e.value, assigneeFullName: e.label });

        //Change button labels.
        if(e.label && this.state.responseMessage===''){
            this.setState({lbl_Post_Reply:'Update Assignee'});
        }
    }
    onChangeSubCategory(e) {
        this.setState({ subCategory: e.label });
    }
    async onChangeTicketStatus(e) {
        await this.setState({ statusId: e.value, ticketStatus: e.label }, () => {
            console.log(this.state.statusId);
            console.log(this.state.ticketStatus);

        });
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
    /*Ends-- OnChange Methods*/

    /*Starts-- Submit Method */
    async postReply() {

        if (!this.state.assigneeFullName && (this.state.responseMessage === "" || this.state.responseMessage === undefined)) {
            return this.showWarningToast("Message is mandatory");
        } else if (this.state.currentTicketStatus === this.state.ticketStatus) {
            return this.showWarningToast("Ticket already present in same status");
        } else {
            this.setState({ disablePostReplyButtonOnClick: true });
            await this.bulkUpdate();
            // if (this.state.ticketStatus !== '') {
            //     console.log(this.state.statusId);
            //     var data = {
            //         ticketStatus: this.state.ticketStatus,
            //         id: this.state.arrayOfSelectedId,
            //         assigneeFullName: "",
            //         assigneeId: "",
            //         userEmail: sessionStorage.getItem("email"),
            //         userMobile: sessionStorage.getItem("mobile")

            //     };
            //     await TicketDataService.bulkUpdateTicketStatusAndAssignee(data)
            //         .then((response) => {
            //             console.log(response.data);
            //         })
            //         .catch((e) => {
            //             console.log(e);
            //         });
            // }
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
            isInternalNotes: this.state.postInternalNotes,
            usedInCannedFilters: true

        }
        if (this.state.responseMessage !== '') {
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
                if (fileKeysArray.length > 1) {
                    TicketDataService.createFileKeyEntry(fileObj).
                        then((fileRes) => {
                            console.log(fileRes.data);
                            this.showSuccessToast("Reply Posted");
                            this.props.history.push("/ticket");
                        })

                    //End insert ticketId and file Key in files table
                }

            })
                .catch((e) => {
                    this.showErrorToast("Some Error Occurred");
                    console.log(e);
                });
        }
        this.showSuccessToast("Reply Posted");
        this.props.history.push("/ticket");
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

    updateSLA() {
        if (this.slaPlan === "" || this.slaPlan === undefined) {
            return this.showWarningToast("Please select new SLA plan");
        }

        if (this.slaPlan === this.state.ticketData.slaPlan) {
            return this.showWarningToast("SLA plan already present");
        }

        var obj = {
            ticketId: this.state.ticketId,
            slaPlan: this.slaPlan,
            userId: this.state.userId
        }
        TicketDataService.updateSLATimings(obj)
            .then((resp) => {
                if (resp.success = true) {
                    this.showSuccessToast("SLA Updated");
                    this.componentDidMount();
                    this.slaPlan = undefined;
                    this.setState({ newSLAPlan: undefined });
                } else {
                    this.showErrorToast("Some Error Occurred");
                }
            })
    }

    /*Starts-- Toasts Method */
    showErrorToast = () => {
        toast.error("Some error occurred while saving!", {
            position: toast.POSITION.TOP_CENTER,
            className: "error-toast"
        });
    };
    showErrorToast = (message) => {
        toast.error(message, {
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

    onclickShowDepartmentPopup() {
        this.setState({ showDepartmentSelectionPopup: true });
        //Call department api.

        //flow 1 wrongly assigned Ticket
        this.setState({ isTicketWronglyAssignedFlow: 1 });
        this.getDepartmentOptions();
    }
    onCloseDepartmentPopup() {
        this.setState({ showDepartmentSelectionPopup: false });
    }

    async getDepartmentOptions() {
        const res = await TicketDataService.getAllDepartments();
        const data = res.data;
        let options = [];
        options.push({ value: "All", label: "All" });
        options.push({ value: "CentralPoolAgent", label: "Central Pool Agent" });
        for (let d of data) {
            options.push({ value: d.id, label: d.departmentName, })
        }
        this.setState({ departmentOptions: options });
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
                options.push({ value: d.userId, label: `${d.user.fullName!==null?d.user.fullName:""} <${d.user.email}>`, departmentId: d.departmentId,assigneeName:d.user.fullName })
            }
            this.setState({ transferAssignee: options });
        }

    }
    async onChangeDepartment(e) {
        this.setState({ helpTopicOptions: [] });
        this.setState({ topicId: undefined, topicName: undefined });
        this.setState({ showTransferAssignee: true });
        this.setState({ depId: e.value, deptName: e.label });
        this.selectedTranferDepartment = { depId: e.value, deptName: e.label };
        this.getAllTrasnferAssignees();
        if (e.value === 'CentralPoolAgent') {
            this.selectedTransferAssignee = {
                value: 'CentralPoolAgent',
                label: 'Central Pool Agent'
            }
            this.setState({ showHelptopicDropdown: false});
        }else{
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
            this.setState({ showHelptopicDropdown: true});
      //End-Get all helpTopic corresponding to departments
        }
    }
    /*Ends--Toast Methods */
    transferTicket() {
        if (this.selectedTranferDepartment === undefined || this.selectedTransferAssignee === undefined) {
            return this.showWarningToast('Please fill mandatory information');
        }
        const transferTicketObj = {
            isTicketWronglyAssigned: this.state.isTicketWronglyAssignedFlow,
            transferReason: this.state.transferMessage,
            departmentName: this.state.deptName || '',
            ticketId: this.state.ticketId,
            selectedDepartment: this.selectedTranferDepartment,
            selectedAssignee: this.selectedTransferAssignee,
            transferreId: window.sessionStorage.getItem("userId"),
            helpTopicId: this.state.topicId

        }
        TicketDataService.transferTicket(transferTicketObj)
            .then((response) => {
                if(response.data.success=="false"){
                    return  this.showErrorToast(response.data.message);
                }
                this.showSuccessToast("Ticket Transferred Successfully");
                this.setState({ showDepartmentSelectionPopup: false });
                this.getTicketDetailsByTicketId()
                this.getTicketRepliesByTicketId();
                this.getTicketStatus();
                this.getUserDetails();

                //Navigate according to breadcrumbs
                if(sessionStorage.getItem("previousSelectedTeamId")!==undefined && sessionStorage.getItem("previousPageLocation")!==undefined && sessionStorage.getItem("previousPageLocation")=="/myTeams"){
                    this.props.history.push("/myTeams");
                }else{
                    this.props.history.push("/ticket");
                    window.location.reload();
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

    onAssigneeNameChange = (selectedOption) => {
        let menuIsOpen = false;
        if (selectedOption) {
            menuIsOpen = false;
            this.setState({
                menuIsOpen
            });
            this.setState({
                selectedAssigneeOption: selectedOption,
            });
            this.setState({ assigneeId: selectedOption.value, assigneeFullName: selectedOption.label });
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
                        let menuIsOpen = true;
                        this.setState({
                            menuIsOpen
                        });
                        data.forEach((element) => {
                            tempArray.push({
                                label: `${element.fullName}`,
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
    handleOnFocus() {
        this.setState({ menuIsOpen: false });
        this.setState(({ selectedAssigneeOption: {} }));
        this.setState({ assigneeFullName: "" });
    }
    handleFocusOut() {
        this.setState({ menuIsOpen: false })
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
                    anchorTag.target = "_blank"
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
    async transferBack() {
        //start-Maintain ticket thread.
        await this.createDynamicFieldsComment(this.viewTicketDetailsJson, this.state.ticketData.department.departmentName);
        //end-Maintain ticket thread.
        const transferBackObj = {
            ticketId: this.state.ticketData.id,
            ticketSourceHistoryId: this.state.ticketData.ticketSourceHistoryId,
            loggedInUserId: sessionStorage.getItem("userId"),
        }
        TicketDataService.transferBackTicket(transferBackObj)
            .then((res) => {
                this.showSuccessToast("Transferred Successfully");
                window.location.reload(false);
            })
            .catch((err => {
                this.showErrorToast(err);
            }))
    }
    componentDidMount() {
        let centralPool = sessionStorage.getItem("isCentralPoolAgent");
        if(sessionStorage.getItem("previousPageLocation") === "/myTeams"){
            this.showOnlyLeadTeamMembers=true;
        }
        this.setState({ isCentralPoolAgent: centralPool });
        this.getTicketDetailsByTicketId();
        this.getTicketRepliesByTicketId();
        this.getTicketStatus();
        let arrayOfId = [];
        arrayOfId.push(this.state.ticketId)
        this.setState({ arrayOfSelectedId: arrayOfId });
        this.getUserDetails();
        this.getCannedOptions();


    }
    toggleClass(path, e) {
        // Start : flow when hide popup is clicked 
        if(this.state.active == true){
            return this.setState({ active: false }); 
        }
        if(this.state.showImage == true){
            return this.setState({ showImage: false });
        }
        // End : flow when hide popup is clicked 
        const str = path;
        const pieces = str.split(/[\s.]+/)
        const last = pieces[pieces.length - 1]
        if(last.toLowerCase() == 'jpg' || last.toLowerCase() == 'jpeg' || last.toLowerCase() == 'png' ){
            const currentState = this.state.showImage;
            this.setState({ showImage: !currentState });  
        }else{
        const currentState = this.state.active;
        this.setState({ active: !currentState });
        }
        this.setState({ dataPath: path });
        console.log(this.state.active);
    };
    async onChangeHelpTopic(e) {
        this.setState({ topicId: e.value, topicName: e.label });
    }

    render() {
        if (!this.state.ticketData) {
            return <div />; //Render component once api call's are completed.
        }
        return (
            <div>
                <div className="shadow p-3 mb-5 bg-white rounded" style={{ marginTop: "20px" }}>
                    <Breadcrumb>
                        {sessionStorage.getItem("previousPageLocation") === "/ticket" &&
                            <Breadcrumb.Item href="/ticket">My Tickets</Breadcrumb.Item>
                        }
                        {sessionStorage.getItem("previousPageLocation") === "/escalatedTicket" &&
                            <Breadcrumb.Item href="/escalatedTicket">Escalated Tickets</Breadcrumb.Item>
                        }
                        {sessionStorage.getItem("previousPageLocation") === "/allTickets" &&
                            <Breadcrumb.Item href="/allTickets">All Tickets</Breadcrumb.Item>
                        }
                        {sessionStorage.getItem("previousPageLocation") === "/myTeams" &&
                            <Breadcrumb.Item href="/myTeams">My Teams</Breadcrumb.Item>
                        }

                        <Breadcrumb.Item active>
                            Ticket #{this.state.ticketId}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Row>
                        <Col xs={12} md={2} lg={2}>
                            <h5 className="formHeading" style={{ backgroundColor: "#ffffff" }}>Ticket #{this.state.ticketId}</h5>
                        </Col>
                        {(this.state.ticketData.userId === parseInt(this.state.userId) || this.state.ticketData.createdBy === parseInt(this.state.userId)) &&
                            <Col xs={12} md={3} lg={3}>
                                <Form.Label className="formlabel">Change SLA Plan</Form.Label>
                                <div style={{ display: "flex" }}>
                                    <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        showYearDropdown={false}
                                        placeholderText="Select new SLA"
                                        className="form-control"
                                        minDate={new Date(this.state.ticketData.initialCreatedDate)}
                                        onChange={this.onChangeSLAPLAN.bind(this)}
                                        selected={this.state.newSLAPlan}
                                    />
                                    <Button style={{ color: "#fff", backgroundColor: "#1f3143" }} variant="primary" type="submit" onClick={this.updateSLA}>
                                        Update
                                    </Button>
                                </div>
                            </Col>
                        }

                        {/* {this.state.isAgent === "true" && this.state.isCentralPoolAgent === "true" &&
                            <Col>
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
                                        placeholder="Search Assignee"
                                        onChange={(e) => {
                                            this.onAssigneeNameChange(e);
                                        }}
                                        defaultOptions={false}
                                        menuIsOpen={this.state.menuIsOpen}
                                        onFocus={this.handleOnFocus}
                                        onBlur={this.handleFocusOut}
                                    />
                                </Form.Group>
                            </Col>
                        } */}
                        {/* {
                            this.state.isAgent === "true" &&
                            <Col style={{ minWidth: "240px" }}>
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
                        } */}

                        {/* {
                            this.state.isAgent === "true" &&
                            <Col xs={4} md={2} lg={2}>
                                <Form.Label style={{ visibility: "hidden" }} className="formlabel">Change Assignee</Form.Label>
                                <Button style={{ color: "#fff", backgroundColor: "#1f3143" }} variant="primary" type="submit" onClick={this.bulkUpdate}>
                                    Update
                                 </Button>
                            </Col>
                        } */}
                       
                        {this.state.isAgent === "true" &&
                            <Col xs={4} md={6} lg={6}>
                                <Form.Label style={{ visibility: "hidden" }} className="formlabel">Change Assignee</Form.Label>
                                <Button style={{float:"right"}} variant="secondary" onClick={this.onclickShowDepartmentPopup.bind()}>Transfer</Button>
                            </Col>
                        }
                        {this.state.isAgent === "true" && this.state.ticketData.isTicketSource === true && (sessionStorage.getItem("userId").match(this.state.ticketData.assigneeId)) &&
                            <Col xs={2} md={2} lg={2}>
                                <Form.Label style={{ visibility: "hidden" }} className="formlabel">Change Assignee</Form.Label>
                                <Button variant="secondary" type="submit" onClick={this.transferBack}>
                                    Transfer Back
                                </Button>
                            </Col>
                        }
                        
                        {/* <Col>
                            <Link style={{ color: "#1f3143", float: "right" }} to={`/addTicket/id:${this.state.ticketId}`}>Edit Ticket</Link>
                        </Col> */}
                    </Row>
                    {/* 
                            Scenario-1 popup flow where ticket is wrongly assigned.
                            
                        */}
                    {
                        this.state.showDepartmentSelectionPopup === true && this.state.isTicketWronglyAssignedFlow === 1 &&
                        <Modal show={this.state.showDepartmentSelectionPopup} onHide={this.onCloseDepartmentPopup} keyboard={true} backdrop="static" size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                            <Modal.Header closeButton >
                                <Modal.Title style={{ color: "#26568e" }}>Transfer Ticket</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="departmentName">
                                        <Form.Label className="formlabel">Department</Form.Label>
                                        <Select
                                            styles={{
                                                // Fixes the overlapping problem of the component
                                                menu: provided => ({ ...provided, zIndex: 9999 })
                                            }}
                                            options={this.state.departmentOptions}
                                            placeholder="Select a Department"
                                            onChange={this.onChangeDepartment.bind(this)}
                                        />
                                    </Form.Group>
                                    {
                                        this.state.showHelptopicDropdown &&
                                        <Form.Group controlId="helptopicName">
                                        <Form.Label className="formlabel">Helptopic Name</Form.Label>
                                        <Select
                                            styles={{
                                                // Fixes the overlapping problem of the component
                                                menu: provided => ({ ...provided, zIndex: 9999 })
                                            }}
                                            options={this.state.helpTopicOptions}
                                            placeholder="Select a Helptopic"
                                            onChange={this.onChangeHelpTopic.bind(this)}
                                        />
                                    </Form.Group>
                                    }
                                    {
                                        this.state.showTransferAssignee &&
                                        <Form.Group controlId="departmentName">
                                            <Form.Label className="formlabel">Change Assignee</Form.Label>
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
                                    }
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
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="success" onClick={this.transferTicket.bind()}>
                                    TRANSFER
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    }
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
                            <label className="lblFields">SLA:&nbsp;</label>
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
                            <label className="lblFields">Nspira Code:&nbsp;</label>
                            <label className="lblFieldValue">{this.state.ticketData.nspiraCode}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label className="lblFields">State:&nbsp;</label>
                            <label className="lblFieldValue">{this.state.ticketData.state}</label>
                        </Col>
                        <Col>
                            <label className="lblFields">District:&nbsp;</label>
                            <label className="lblFieldValue">{this.state.ticketData.district}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <label className="lblFields">Payroll Code:&nbsp;</label>
                            <label className="lblFieldValue">{this.state.ticketData.payrollCode}</label>
                        </Col>
                    </Row>
                    <Row>
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
                            <Modal show={this.state.showImage} keyboard={true} onHide={this.toggleClass} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                                <Modal.Header closeButton >
                                </Modal.Header>
                                <Modal.Body>
                                <TransformWrapper>
                        <TransformComponent>
                            <img style={{width:'100%', height: 'auto'}} src={this.state.dataPath} />
                        </TransformComponent>
                    </TransformWrapper>
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
                                                return <span>&nbsp;{r.substring(r.lastIndexOf("/") + 1, r.length)}&nbsp;<i class="fa fa-cloud-download" style={{ cursor: "pointer" }} onClick={this.downloadFile.bind(this, r)} aria-hidden="true"></i> &nbsp;&nbsp;<i class="fa fa-eye" onClick={this.toggleClass.bind(this, url.baseURL + "/api/file/downloadTicketFile/?isView=true&keyName=" + r)} aria-hidden="true"></i></span>
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
                                                            return <label>{s3File.fileName} <span type="button" class="fa fa-cloud-download" onClick={this.downloadFile.bind(this, s3File.key)}></span>&nbsp;&nbsp;<i class="fa fa-eye" onClick={this.toggleClass.bind(this, url.baseURL + "/api/file/downloadTicketFile/?isView=true&keyName=" + s3File.key)} aria-hidden="true"></i></label>
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
                                                            return <label>{s3File.fileName} <span type="button" class="fa fa-cloud-download" onClick={this.downloadFile.bind(this, s3File.key)}></span>&nbsp;&nbsp;<i class="fa fa-eye" onClick={this.toggleClass.bind(this, url.baseURL + "/api/file/downloadTicketFile/?isView=true&keyName=" + s3File.key)} aria-hidden="true"></i></label>
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
                                        styles={{
                                            // Fixes the overlapping problem of the component
                                            menu: provided => ({ ...provided, zIndex: 9999 })
                                        }}
                                        placeholder="Search email"
                                        onChange={(e) => {
                                            this.onSearchChange(e);
                                        }}
                                        defaultOptions={false}
                                        isMulti={true}
                                        isClearable={true}
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
                                            //Change button labels.
                                            if (this.state.assigneeFullName && data) {
                                                this.setState({ lbl_Post_Reply: 'Post Reply' });
                                            }
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
                                <Col xs={12} md={3} lg={3} style={{ paddingTop: "10px" }}>
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
                                {
                                    (this.state.isAgent === "true" || this.state.isCentralPoolAgent === "true") &&
                                    <Fragment>
                                        <Col xs={12} md={3} lg={3} style={{ paddingTop: "10px" }}>
                                            <Form.Label className="formlabel">{this.state.assigneeLabel}</Form.Label>
                                            <Select
                                                styles={{
                                                    // Fixes the overlapping problem of the component
                                                    menu: provided => ({ ...provided, zIndex: 9999 })
                                                }}
                                                options={this.state.assigneeOptions}
                                                onChange={this.onChangeAssignee.bind(this)}
                                                placeholder="Select a assignee"
                                            />
                                        </Col>
                                        {
                                            this.state.subCategoryOptions.length > 1 &&
                                            <Col xs={12} md={3} lg={3} style={{ paddingTop: "10px" }}>
                                                <Form.Label className="formlabel">Change SubCategory</Form.Label>
                                                <Select
                                                    styles={{
                                                        // Fixes the overlapping problem of the component
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    options={this.state.subCategoryOptions}
                                                    onChange={this.onChangeSubCategory.bind(this)}
                                                    placeholder="Select a SubCategory"
                                                />
                                            </Col>
                                        }
                                    </Fragment>

                                }
                            </Row>



                            <button type="button" disabled={this.state.disablePostReplyButtonOnClick === true} onClick={this.postReply} className="btn btn-success">{this.state.lbl_Post_Reply}</button>
                        </Form>
                    }
                    {
                        this.state.isAgent !== "true" &&
                        <Form>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2" className="formlabel">
                                    Response:
                                </Form.Label>
                                {/* <Col sm="10">
                                    <Select
                                        styles={{
                                            // Fixes the overlapping problem of the component
                                            menu: provided => ({ ...provided, zIndex: 9999 })
                                        }}
                                        placeholder="Select a canned response"
                                        options={this.state.cannedOptions}
                                        onChange={this.onChangeCannedResponse.bind(this)}
                                    />
                                </Col> */}
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
                            <button type="button" disabled={this.state.disablePostReplyButtonOnClick === true} onClick={this.postReply} className="btn btn-success">{this.state.lbl_Post_Reply}</button>
                        </Form>
                    }
                </div>
            </div >

        )
    }
}

export default TicketView;