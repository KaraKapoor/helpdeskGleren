import React, { Component } from "react";
import TicketDataService from "../../services/ticket.service";
import "../Ticket/addTicket.css";
import { toast } from 'react-toastify';
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { Fragment } from "react";

class FeedbackForm extends Component {
    constructor(props) {
        super(props);
        this.onSubmitFeedbackForm = this.onSubmitFeedbackForm.bind(this);
        this.onNoClick = this.onNoClick.bind(this);
        this.onYesClick = this.onYesClick.bind(this);
        this.onChangeReopenReason=this.onChangeReopenReason.bind(this);
        this.state = {
            selectedResponse: "Yes",
            isFormSubmit: false,
            isFeedbackSubmitted: null,
            feedbacklinkId:null,
            reopenReason:"",
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
    onSubmitFeedbackForm() {
        const submitObj={
            feedbacklinkId:this.state.feedbacklinkId,
            ticketSatisfaction:this.state.selectedResponse,
            reopenReason:this.state.reopenReason
        }
        TicketDataService.submitFeedbackForm(submitObj)
        .then((resp)=>{
            console.log(resp);
            this.setState({isFormSubmit:true});
        })
    }
    onYesClick() {
        console.log("Yes");
        this.setState({ selectedResponse: "Yes" });
    }
    onNoClick() {
        console.log("No");
        this.setState({ selectedResponse: "No" });
    }
    onChangeReopenReason(e){
        console.log(e.target.value);
        this.setState({reopenReason:e.target.value});
    }
    componentDidMount() {
        let uuid = "";
        var currentUrl = window.location.href;
        let url = new URL(currentUrl);
        let params = new URLSearchParams(url.search.slice(1));
        for (let pair of params.entries()) {
            uuid = pair[1];
        }
        this.setState({feedbacklinkId:uuid});
        const obj = {
            formUUId: uuid
        }
        TicketDataService.getFeedbackRecord(obj)
            .then((res) => {
                console.log(res.data.isFeedbackSubmitted);
                this.setState({ isFeedbackSubmitted: res.data.isFeedbackSubmitted });
            })
    }

    render() {
        return (
            <div style={{ marginTop: "150px" }}>
                <div className="shadow p-3 mb-5 bg-white rounded" style={{ marginTop: "20px" }}>
                    <div>
                        <Row>
                            <Col>
                                <h5 className="formHeading" style={{ backgroundColor: "#ffffff" }, { textAlign: "center" }}>Feedback Form</h5>
                            </Col>

                        </Row>
                        {
                            this.state.isFeedbackSubmitted === false &&this.state.isFormSubmit===false&&
                            <Fragment>
                                <Row>
                                    <Col>
                                        <h5>Tell Us About Your Experience</h5>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "20px" }}>
                                    <Col>
                                        <p>If you are satisfied please click on <span style={{ fontWeight: "bold" }}>YES</span> button. If not click on <span style={{ fontWeight: "bold" }}>NO</span> button</p>
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: "20px" }}>
                                    <Col>
                                        <label className={`lblFeedbackForm ${this.state.selectedResponse === "Yes" ? 'feedbackButtons' : ''}`} onClick={this.onYesClick.bind()}>YES</label>
                                    </Col>
                                    <Col>
                                        <label className={`lblFeedbackForm ${this.state.selectedResponse === "No" ? 'feedbackButtons' : ''}`} onClick={this.onNoClick.bind()}>NO</label>
                                    </Col>
                                    <Col></Col>
                                    <Col></Col>
                                    <Col></Col>
                                </Row>
                                {
                                    this.state.selectedResponse === "No" &&
                                    <Row style={{ marginTop: "20px" }}>
                                        <Col>
                                            <Form>
                                                <Form.Group controlId="textArea1">
                                                <Form.Label className="formlabel">Reason</Form.Label>
                                                <Form.Control as="textarea" rows={5} onChange={this.onChangeReopenReason} />
                                                </Form.Group>
                                                

                                            </Form>
                                        </Col>
                                    </Row>
                                }
                                <Row style={{ marginTop: "20px" }}>
                                    <Col>
                                        <Button style={{ color: "#fff", backgroundColor: "#1f3143" }} onClick={this.onSubmitFeedbackForm.bind()} variant="primary" type="submit">
                                            Submit
                                         </Button>
                                    </Col>
                                </Row>
                            </Fragment>
                        }


                    </div>
                    {
                        this.state.isFormSubmit === true &&
                        <div>
                            <h5 style={{ marginTop: "350px" }, { textAlign: "center" }}>Thankyou For Your Feedback</h5>
                        </div>
                    }
                    {
                        this.state.isFeedbackSubmitted===true &&
                        <div>
                            <h5 style={{ marginTop: "350px" }, { textAlign: "center" }}>Your Feedback is already submitted</h5>
                        </div>

                    }

                </div>
            </div>

        )
    }
}

export default FeedbackForm;