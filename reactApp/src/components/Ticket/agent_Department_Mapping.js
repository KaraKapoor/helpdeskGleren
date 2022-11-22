import React, { Component, createRef } from "react";
import MaterialTable from "material-table";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row, Modal, Breadcrumb } from "react-bootstrap";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import { Fragment } from "react";
import Select from "react-select";
class AgentMapping extends Component {
    tableRef = React.createRef();
    constructor(props) {
        super(props);
        this.onChangeOperation = this.onChangeOperation.bind(this);
        this.savePageLocation = this.savePageLocation.bind(this);
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

    savePageLocation(path) {
        sessionStorage.setItem("previousPageLocation", path);
    }
    async onChangeOperation(e) {
        if (e.value === 1) {
            this.savePageLocation('/departmentsList');
            this.props.history.push("/departmentsList");
        } else if (e.value === 2) {
            this.savePageLocation('/unassociatedAgentsList');
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


    render() {
        return (
            <div id="test">
                <div style={{ marginTop: "20px" }}>
                    <h5 className="formHeading">Agents Mapping</h5>
                </div>
                <div>
                    <Fragment>
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
                        </Row>
                    </Fragment>
                </div>
            </div>
        );
    }
}
export default AgentMapping;
