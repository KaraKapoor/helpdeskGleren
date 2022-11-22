import React, { Component, createRef } from "react";
import MaterialTable from "material-table";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row, Modal, Breadcrumb } from "react-bootstrap";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import { Fragment } from "react";
import Select from "react-select";
import * as url from "../../http-common";
class DepartmentsList extends Component {
    tableRef = React.createRef();
    constructor(props) {
        super(props);
        this.onChangeOperation = this.onChangeOperation.bind(this);
        this.remoteData = this.remoteData.bind(this);
        this.exportData = this.exportData.bind(this);
        this.savePageLocation=this.savePageLocation.bind(this);
        this.state = {
            operationOptions: [],
        }
        this.columns = [
            { title: "Department Name", field: "departmentName" }
        ];
    }

    componentDidMount() {
        this.getOperationOptions();
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
        } else if (e.value === 2) {
            this.props.history.push("/unassociatedAgentsList");

        }
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

    async getAssociatedAgents(departmentId, departmentName) {
        this.savePageLocation();
        this.props.history.push(`/viewDepartmentAssociatedAgents/?id=${departmentId}&departmentName=${departmentName}`)
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
        await TicketDataService.getAllDepartmentsWithPagination(query.pageSize, query.page, orderDirection, orderBy)
            .then((resp) => {
                data = resp.data.tickets;
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
    async exportData() {
        this.state.exportDataDownloadLink = url.baseURL + `/api/dataExport/downloadAllDepartmentsAssociatedAgents`;
        window.location.href = this.state.exportDataDownloadLink;
    }
    savePageLocation() {
        sessionStorage.setItem("previousPageLocation", "/departmentsList");
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
                                        value: 1,
                                        label: "View All Departments",
                                    }}
                                    onChange={this.onChangeOperation.bind(this)}
                                    placeholder="Select operation"
                                />
                            </Col>
                            <Col xs={12} md={1} lg={1}>
                            </Col>
                            <Col xs={12} md={1} lg={1}>
                            </Col>
                            <Col xs={12} md={1} lg={1}>
                            </Col>
                            <Col xs={12} md={1} lg={1}>
                            </Col>
                            <Col xs={12} md={1} lg={1}>
                            </Col>
                            <Col xs={12} md={1} lg={1}>
                            </Col>
                            <Col xs={12} md={1} lg={1}>
                            </Col>
                            <Col xs={12} md={1} lg={1}>
                                <Form.Label style={{ visibility: "hidden" }}>Export</Form.Label>
                                <Button style={{ color: "#fff", backgroundColor: "#1f3143", float: "right" }} variant="primary" type="submit" onClick={this.exportData}>
                                    Export
                                </Button>
                            </Col>
                        </Row>
                    </Fragment>
                    {
                        <MaterialTable
                            title={"All Departments"}
                            columns={this.columns}
                            data={this.remoteData.bind()}
                            tableRef={this.tableRef}
                            options={{
                                search: false,
                                exportButton: false,
                                showSelectAllCheckbox: false,
                                toolbar: true,
                                showFirstLastPageButtons: false,
                                showTitle: true,
                                selection: false,
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
                                actionsColumnIndex: -1
                            }}
                            actions={[
                                {
                                    icon: 'people',
                                    tooltip: 'View Agents',
                                    position: 'auto',
                                    onClick: (event, rowData) => this.getAssociatedAgents(rowData.id, rowData.departmentName),
                                }
                            ]}
                        />
                    }
                </div>
            </div>
        );
    }
}
export default DepartmentsList;
