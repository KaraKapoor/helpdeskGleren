import React, { Component } from "react";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row, Breadcrumb } from "react-bootstrap";
import { Fragment } from "react";
import Select from "react-select";

class AddTeam extends Component {
    constructor(props) {
        super(props);
        this.onChangeDepartment = this.onChangeDepartment.bind(this);
        this.onChangeTeamLead = this.onChangeTeamLead.bind(this);
        this.onChangeTeamName = this.onChangeTeamName.bind(this);
        this.saveUpdateTeam = this.saveUpdateTeam.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        this.state = {
            agentOptions: [],
            teamLeadOptions: [],
            teamName: undefined,
            teamId: undefined,
            selectedDepartment: undefined,
            selectedTeamLeads: [],
            selectedAgents: [],
            locale: { 'format': 'DD/MM/YYYY' },
            departmentOptions: [],
            showDepartmentDropdown: false,
            userId: undefined
        };
        this.isViewMode = false;
        if (window.location.href.includes('/id:')) {
            var idParam = window.location.href.split("/id:");
            var teamId = idParam[1];
            this.state.teamId = teamId;
            this.isViewMode = true;
        }
        this.state.userId = sessionStorage.getItem("userId");

    }

    componentDidMount() {
        this.getDepartmentOptions();
        this.getAllTeamLeads();
        if (this.state.teamId) {
            this.getTeamById();
        }


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

    onChangeAgent(e) {
        this.setState({ selectedAgents: e });
    }
    onChangeTeamLead(e) {
        this.setState({ selectedTeamLeads: e });
    }
    onChangeTeamName(e) {
        this.setState({ teamName: e.target.value });
    }
    onChangeDepartment(e) {
        this.setState({ agentOptions: [] });
        console.log(e);
        this.setState({ selectedDepartment: e });
        for (let i of e) {
            this.getAllDepartmentAssoAgents(i.value);

        }
        this.setState({ showDepartmentDropdown: true });

    }
    async saveUpdateTeam() {
        if (this.state.teamName === undefined || this.state.selectedTeamLeads.length === 0 || this.state.selectedAgents.length === 0 || this.state.selectedDepartment === undefined) {
            return this.showWarningToast("Please fill mandatory information");
        }
        let teamLeadArray = [];
        let agentsArray = [];
        for (let i of this.state.selectedTeamLeads) {
            teamLeadArray.push(i.value);
        }
        for (let j of this.state.selectedAgents) {
            agentsArray.push({ depId: j.departmentId, userId: j.value });
        }
        let reqBody = {};
        if (this.state.teamId) {
            reqBody = {
                id: this.state.teamId,
                teamName: this.state.teamName,
                teamLeads: teamLeadArray,
                agentsMap: agentsArray,
                createdBy: this.state.userId,
                updatedBy: this.state.userId
            }
            await TicketDataService.saveUpdateTeam(reqBody).then((resp) => {
                if (resp.data.success) {
                    this.showSuccessToast(resp.data.message);
                    this.props.history.push("/teamList");
                } else {
                    this.showErrorToast(resp.data.message);
                }
            })
        } else {
            reqBody = {
                teamName: this.state.teamName,
                teamLeads: teamLeadArray,
                agentsMap: agentsArray,
                createdBy: this.state.userId,
                updatedBy: this.state.userId
            }
            await TicketDataService.saveUpdateTeam(reqBody).then((resp) => {
                if (resp.data.success) {
                    this.showSuccessToast(resp.data.message);
                    this.props.history.push("/teamList");
                } else {
                    this.showErrorToast(resp.data.message);
                }
            })
        }
    }
    cancelClick(){
        this.props.history.push("/teamList");
    }

    async deleteTeam() {
        const req = {
            teamId: this.state.teamId
        }
        const resp = await TicketDataService.deleteTeamById(req);
        if (resp.data.success === true) {
            this.showSuccessToast(resp.data.message);
            this.props.history.push("/teamList");
        } else {
            this.showErrorToast(resp.data.message);
        }
    }

    async getAllDepartmentAssoAgents(departmentId) {
        const res = await TicketDataService.getDepartmentAssociatedAgents(500, 0, undefined, undefined, undefined, departmentId);
        const data = res.data.users;
        const options = data.map((d) => ({
            value: d.user.id,
            label: d.user.fullName+`<${d.user.email}>`,
            departmentId: departmentId
        }));
        let previousValues = this.state.agentOptions;
        let allAgentsArray = previousValues.concat(options)
        this.setState({ agentOptions: allAgentsArray });
    }
    async getAllTeamLeads() {
        const res = await TicketDataService.getAllTeamLeadUsers();
        const data = res.data;
        const options = data.map((d) => ({
            value: d.id,
            label: d.fullName+`<${d.email}>`,
        }));
        this.setState({ teamLeadOptions: options });

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
    async getTeamById() {
        const req = {
            teamId: this.state.teamId
        }
        const teamResp = await TicketDataService.getTeamById(req);
        this.setState({ showDepartmentDropdown: true });
        this.setState({ teamName: teamResp.data.teamName });
        this.setState({ selectedTeamLeads: teamResp.data.selectedTeamLeads });
        this.setState({ selectedAgents: teamResp.data.selectedAgents });
        this.setState({ selectedDepartment: teamResp.data.selectedDepartment });

        //Prepopulate all agents
        for (let i of teamResp.data.selectedDepartment) {
            this.getAllDepartmentAssoAgents(i.value);

        }
    }
    render() {
        // if (!this.state.data) {
        //   return <div />; //Render component once api call's are completed.
        // }
        return (
            <div id="test">
                <div style={{ marginTop: "20px" }}>
                    <h5 className="formHeading">{this.isViewMode ? 'View Team' : 'Add Team'}</h5>
                    <div className="shadow p-3 mb-5 rounded" style={{ "minHeight": "450px" }}>
                    <Breadcrumb>
                        {sessionStorage.getItem("previousPageLocation") === "/teamList" &&
                            <Breadcrumb.Item href="/teamList">Teams List</Breadcrumb.Item>
                        }

                        <Breadcrumb.Item active>
                            {this.state.teamName}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                        <Form>
                            <Form.Group as={Row} className="mb-3" controlId="formPlainTeamName">
                                <Form.Label className={"formlabel required"} column sm="2">
                                    Team Name
                                </Form.Label>
                                <Col sm="10">
                                    <Form.Control type="text" placeholder="Enter Team Name" value={this.state.teamName} onChange={this.onChangeTeamName} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlainTeamLead">
                                <Form.Label className={"formlabel required"} column sm="2">
                                    Team Lead
                                </Form.Label>
                                <Col sm="10">
                                    <Select
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 })
                                        }}
                                        options={this.state.teamLeadOptions}
                                        value={this.state.selectedTeamLeads}
                                        isMulti={true}
                                        onChange={this.onChangeTeamLead.bind(this)}
                                        placeholder="Select Team Lead"
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formPlainTeamLead">
                                <Form.Label className={"formlabel required"} column sm="2">
                                    Select Department
                                </Form.Label>
                                <Col sm="10">
                                    <Select
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 })
                                        }}
                                        isMulti={true}
                                        options={this.state.departmentOptions}
                                        value={this.state.selectedDepartment}
                                        onChange={this.onChangeDepartment.bind(this)}
                                        placeholder="Select Department"
                                    />
                                </Col>

                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formPlainTeamLead">
                                {
                                    this.state.showDepartmentDropdown &&
                                    <Fragment>
                                        <Form.Label className={"formlabel required"} column sm="2">
                                            Agents
                                        </Form.Label>
                                        <Col sm="10">
                                            <Select
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 })
                                                }}
                                                options={this.state.agentOptions}
                                                isMulti={true}
                                                value={this.state.selectedAgents}
                                                onChange={this.onChangeAgent.bind(this)}
                                                placeholder="Select Agents"
                                            />
                                        </Col>
                                    </Fragment>

                                }
                            </Form.Group>
                        </Form>
                        <div style={{ marginTop: "100px" }}>
                            {this.isViewMode && <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right", margin: "10px" }} variant="primary" onClick={this.deleteTeam} type="submit">Delete
                            </Button>}
                            {!this.isViewMode && <Button type="button" className="btn btn-success" onClick={this.saveUpdateTeam} style={{ float: "right", margin: "10px" }}>Save</Button>}
                            {this.isViewMode && <Button type="button" className="btn btn-success" onClick={this.saveUpdateTeam} style={{ float: "right", margin: "10px" }}>Update</Button>}
                            <Button type="button" className="btn btn-warning" onClick={this.cancelClick} style={{ float: "right", margin: "10px" }}>Cancel</Button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
export default AddTeam;