import React, { Component, createRef } from "react";
import MaterialTable from "material-table";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row, Modal, Breadcrumb } from "react-bootstrap";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import { Fragment } from "react";
import Select from "react-select";
import * as url from "../../http-common";
class AgentsListInDepartments extends Component {
    tableRef = React.createRef();
    constructor(props) {
        super(props);
        this.onChangeOperation = this.onChangeOperation.bind(this);
        this.remoteData = this.remoteData.bind(this);
        this.onChangeDepartment = this.onChangeDepartment.bind(this);
        this.addToDepartmentClick = this.addToDepartmentClick.bind(this);
        this.onCloseDepartmentPopup = this.onCloseDepartmentPopup.bind(this);
        this.updateAgentMapping = this.updateAgentMapping.bind(this);
        this.exportData = this.exportData.bind(this);
        this.state = {
            departmentId: undefined,
            departmentName: undefined,
            operationOptions: [],
            departmentOptions: [],
            showDepartmentPopup: false,
            userId: undefined,
        }
        this.columns = [
            { title: "Email", field: "email" },
            { title: "FullName", field: "fullName" },
            { title: "Mobile", field: "mobile" },
            { title: "Office Type", field: "officeType" },
            { title: "Designation", field: "designation" },
            { title: "EmployeeId", field: "employeeId" },
        ];
        this.selectedUserId = [];
        this.state.userId = sessionStorage.getItem("userId");
    }

    componentDidMount() {
        /* Fetch the department id from url*/
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        this.setState({ departmentId: params.id });
        this.setState({ departmentName: params.departmentName });
        /*Ends-- Fetch the department id from url*/
        this.getOperationOptions();
        this.getDepartmentOptions();
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

    async onChangeOperation(e) {
        if (e.value === 1) {
            console.log(e);
            this.props.history.push("/departmentsList");
        } else if (e.value === 2) {
            console.log(e);
            this.props.history.push("/unassociatedAgentsList");

        }
    }
    async exportData() {
        this.state.exportDataDownloadLink = url.baseURL + `/api/dataExport/downloadDepartmentAssociatedAgents?departmentId=${this.state.departmentId}`;
        window.location.href = this.state.exportDataDownloadLink;
    }
    async remoteData(query) {
        let data;
        let pageNumber;
        let pageCount;
        let orderDirection = query.orderDirection;
        let orderBy = undefined;
        if (query.orderBy) {
            orderBy = query.orderBy.field;
        }
        await TicketDataService.getDepartmentAssociatedAgents(query.pageSize, query.page, query.search, orderDirection, orderBy, this.state.departmentId)
            .then((resp) => {
                for (let i of resp.data.users) {
                    i.email = i.user.email;
                    i.mobile = i.user.mobile;
                    i.designation = i.user.designation;
                    i.employeeId = i.user.employeeId;
                    i.fullName = i.user.fullName;
                    i.officeType = i.user.officeType;
                }
                data = resp.data.users;
                pageNumber = resp.data.currentPage;
                pageCount = resp.data.totalItems;
            })
        return Promise.resolve(
            {
                data: data,
                page: pageNumber,
                totalCount: pageCount
            }
        );

    }
    async getOperationOptions() {
        const options = [
            {
                value: 1,
                label: "View All Departments",
            },
            {
                value: 2,
                label: "Add Agents To Departments",
            }
        ];
        this.setState({ operationOptions: options });
    }
    addToDepartmentClick() {
        if (this.selectedUserId.length == 0) {
            return this.showWarningToast("Please select atleast one user");
        }
        this.setState({ showDepartmentPopup: true });
    }
    onCloseDepartmentPopup() {
        this.setState({ showDepartmentPopup: false });
    }
    async updateAgentMapping() {
        const reqBody = {
            userIds: this.selectedUserId,
            departmentId: this.state.selectedDepartmentId,
            createdBy: null,
            updatedBy: this.state.userId,
        }
        await TicketDataService.saveUpdateDepartmentMapping(reqBody).then((resp) => {
            this.showSuccessToast('Agent updated successfully');
            this.setState({ showDepartmentPopup: false });
            this.selectedUserId = [];
            this.filterTickets();
        })

    }
    async onChangeDepartment(e) {
        this.setState({ selectedDepartmentId: e.value });

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
    onUserSelectionChange(e) {
        const arrayOfId = []
        for (var i of e) {
            arrayOfId.push(i.userId);
        }
        this.selectedUserId = arrayOfId;
    }
    async filterTickets() {
        this.tableRef.current.state.query.page = 0;
        this.tableRef.current.state.query.pageSize = 20;
        this.tableRef.current && this.tableRef.current.onQueryChange();
    }
    render() {
        return (
            <div id="test">
                <div style={{ marginTop: "20px" }}>
                    <h5 className="formHeading">Agents Mapping</h5>
                </div>
                <div>
                    <Fragment>
                        <Breadcrumb>
                            {sessionStorage.getItem("previousPageLocation") === "/ticket" &&
                                <Breadcrumb.Item href="/ticket">My Tickets</Breadcrumb.Item>
                            }
                            {sessionStorage.getItem("previousPageLocation") === "/departmentsList" &&
                                <Breadcrumb.Item href="/departmentsList">All Departments</Breadcrumb.Item>
                            }

                            <Breadcrumb.Item active>
                            {this.state.departmentName + ` Department`}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Row>
                            <Col xs={12} md={4} lg={4}>
                                <Form.Label className="formlabel" >Select operation</Form.Label>
                                <Select
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                    }}
                                    options={this.state.operationOptions}
                                    onChange={this.onChangeOperation.bind(this)}
                                    placeholder="Select operation"
                                />
                            </Col>
                            <Col xs={3} md={6} lg={6}>
                                <Form.Label style={{ visibility: "hidden" }}>Change Status</Form.Label><br></br>
                                <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.addToDepartmentClick} >
                                    Change Department
                                </Button>
                            </Col>
                            <Col xs={3} md={2} lg={2}>
                                <Form.Label style={{ visibility: "hidden" }}>Export</Form.Label><br></br>
                                <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.exportData} >
                                    Export
                                </Button>
                            </Col>
                        </Row>
                    </Fragment>
                    {
                        <MaterialTable
                            title={`Agents in ${this.state.departmentName} Department`}
                            columns={this.columns}
                            data={this.remoteData.bind()}
                            tableRef={this.tableRef}
                            options={{
                                search: true,
                                exportButton: false,
                                showSelectAllCheckbox: false,
                                toolbar: true,
                                showFirstLastPageButtons: false,
                                showTitle: true,
                                selection: true,
                                maxBodyHeight: '450px',
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
                                showTextRowsSelected: false,
                                actionsColumnIndex: -1,

                            }}
                            onSelectionChange={(e) => {
                                this.onUserSelectionChange(e);
                            }}
                        />
                    }
                    {
                        <div>
                            <Modal show={this.state.showDepartmentPopup} onHide={this.onCloseDepartmentPopup} keyboard={true} backdrop="static" size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                                <Modal.Header closeButton >
                                    <Modal.Title style={{ color: "#26568e" }}>Update Agent Mapping</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="departmentName">
                                            <Form.Label className="formlabel">Select Department</Form.Label>
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
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="success" onClick={this.updateAgentMapping} >
                                        Submit
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>


                    }
                </div>
            </div>
        );
    }
}
export default AgentsListInDepartments;