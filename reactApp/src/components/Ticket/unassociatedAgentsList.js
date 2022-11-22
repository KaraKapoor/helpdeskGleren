import React, { Component, createRef } from "react";
import MaterialTable from "material-table";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row, Modal, Breadcrumb } from "react-bootstrap";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import { Fragment } from "react";
import Select from "react-select";
class UnassociatedAgentsList extends Component {
    tableRef = React.createRef();
    constructor(props) {
        super(props);
        this.onChangeOperation = this.onChangeOperation.bind(this);
        this.remoteData = this.remoteData.bind(this);
        this.onChangeDepartment = this.onChangeDepartment.bind(this);
        this.addToDepartmentClick = this.addToDepartmentClick.bind(this);
        this.onCloseDepartmentPopup = this.onCloseDepartmentPopup.bind(this);
        this.updateAgentMapping = this.updateAgentMapping.bind(this);
        this.state = {
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
    async remoteData(query) {
        let data;
        let pageNumber;
        let pageCount;
        let orderDirection = query.orderDirection;
        let orderBy = undefined;
        if (query.orderBy) {
            orderBy = query.orderBy.field;
        }
        await TicketDataService.getAllUnassociatedAgentsList(query.pageSize, query.page, query.search, orderDirection, orderBy)
            .then((resp) => {
                for (let i of resp.data.response.users) {
                    i.email = i.email;
                    i.mobile = i.mobile;
                    i.designation = i.designation;
                    i.employeeId = i.employeeId;
                    i.fullName = i.fullName;
                    i.officeType = i.officeType;
                }
                data = resp.data.response.users;
                pageNumber = resp.data.response.currentPage;
                pageCount = resp.data.response.totalItems;
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
            createdBy: this.state.userId,
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
            arrayOfId.push(i.id);
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
                           <Breadcrumb.Item href="/agentMapping">Agent Mapping</Breadcrumb.Item>
                            {sessionStorage.getItem("previousPageLocation") === "/departmentsList" &&
                                <Breadcrumb.Item href="/departmentsList">All Departments</Breadcrumb.Item>
                            }
                            {sessionStorage.getItem("previousPageLocation") === "/unassociatedAgentsList" &&
                                <Breadcrumb.Item href="/unassociatedAgentsList">Add Agents To Department</Breadcrumb.Item>
                            }

                            <Breadcrumb.Item active>
                                Agents
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
                                    value={{
                                        value: 2,
                                        label: "Add Agents To Departments",
                                    }}
                                    onChange={this.onChangeOperation.bind(this)}
                                    placeholder="Select operation"
                                />
                            </Col>
                            <Col xs={3} md={8} lg={8}>
                                <Form.Label style={{ visibility: "hidden" }}>Change Status</Form.Label><br></br>
                                <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.addToDepartmentClick} >
                                    Add To Department
                                </Button>
                            </Col>
                        </Row>
                    </Fragment>
                    {
                        <MaterialTable
                            title={'Unassociated Agents'}
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
export default UnassociatedAgentsList;