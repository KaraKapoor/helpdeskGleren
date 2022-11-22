import React, { Component } from "react";
import { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import { PieChart } from 'react-minimal-pie-chart';
import TicketDataService from "../../services/ticket.service";

class NewDashboard extends Component {
    constructor(props) {
        super(props);
        this.refreshChartData = this.refreshChartData.bind(this);
        this.state = {
            userId: undefined,
            openTicketCount: 0,
            closedTicketCount: 0,
            overdueTicketCount: 0
        }
    }
    componentDidMount() {
        this.state.userId = sessionStorage.getItem("userId");
        this.getPieChartDetails();
    }

    getPieChartDetails() {
        const req = {
            userId: this.state.userId
        }
        TicketDataService.getPieChartDetailsForLoggedInUser(req).then((resp) => {
            this.setState({ openTicketCount: resp.data.openTicketCount });
            this.setState({ closedTicketCount: resp.data.closedTicketCount });
            this.setState({ overdueTicketCount: resp.data.overdueTicketCount});
        })
    }
    refreshChartData() {
        this.getPieChartDetails();
    }
    render() {
        return (
            <Fragment>
                <label style={{ cursor: "pointer" }}>Refresh Data <i class="fa fa-refresh" aria-hidden="true" onClick={this.refreshChartData.bind()}></i></label>
                <div style={{ maxWidth: "50%", height: "auto", margin: "auto" }}>
                    <Row>
                        <Col xs={12} md={8} lg={8}>
                            <PieChart
                                labelStyle={{
                                    fontSize: '5px',
                                    fontFamily: 'sans-serif'
                                }}
                                label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
                                animate="true"
                                data={[
                                    { title: 'Opened', value: this.state.openTicketCount, color: '#0b5fa3' },
                                    { title: 'Closed', value: this.state.closedTicketCount, color: '#f48120' },
                                    // { title: 'In-Progress', value: 20, color: '#F69852' },
                                    { title: 'Overdue', value: this.state.overdueTicketCount, color: '#78c66c' },
                                ]}

                            />
                        </Col>
                        <Col xs={12} md={4} lg={4}>
                            <div className="shadow p-3 mb-5 bg-white rounded" style={{ marginLeft: "400px", minWidth: "200px", alignItems: "self-end" }}>
                                <h5>LEGEND</h5>
                                <hr></hr>
                                <label style={{ display: "flex" }}><span style={{ backgroundColor: "#0b5fa3", height: "30px", width: "30px", display: "flex", borderRadius: "7px" }}></span>&nbsp;&nbsp;Opened ({this.state.openTicketCount})</label><br>
                                </br>
                                <label style={{ display: "flex" }}><span style={{ backgroundColor: "#f48120", height: "30px", width: "30px", display: "flex", borderRadius: "7px" }}></span>&nbsp;&nbsp;Closed ({this.state.closedTicketCount})</label><br></br>
                                {/* <label style={{ display: "flex" }}><span style={{ backgroundColor: "#F69852", height: "30px", width: "30px", display: "flex", borderRadius: "7px" }}></span>&nbsp;&nbsp;In-Progress (20)</label><br></br> */}
                                <label style={{ display: "flex" }}><span style={{ backgroundColor: "#78c66c", height: "30px", width: "30px", display: "flex", borderRadius: "7px" }}></span>&nbsp;&nbsp;Overdue ({this.state.overdueTicketCount})</label><br></br>

                            </div>
                        </Col>
                    </Row>

                </div>
            </Fragment>


        );
    }
}
export default NewDashboard;