import React, { Component } from "react";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row } from "react-bootstrap";
import "../Ticket/addTicket.css";
import { toast } from 'react-toastify';
// import * as url from "../../http-common";
// import * as Constants from "../Shared/constants";

class Smtp_config extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.onChangeSmtpHost = this.onChangeSmtpHost.bind(this);
	this.onChangeSmtpPort = this.onChangeSmtpPort.bind(this);
	this.onChangeSmtpUser = this.onChangeSmtpUser.bind(this);
	this.onChangeSmtpPassword = this.onChangeSmtpPassword.bind(this);
	this.onChangeSmtpEmail = this.onChangeSmtpEmail.bind(this);
    this.state = {
      smtp_host: undefined,
	    smtp_port: undefined,
      smtp_user: undefined,
      smtp_password: undefined,
      smtp_email: undefined,
    };
  }

  async componentDidMount() {
    const data = {
    
    };
   const resp = await TicketDataService.findByTenantName(data);
    console.log(resp);
        this.setState({smtp_host:resp.data.data.smtp_host});
        this.setState({smtp_port:resp.data.data.smtp_port});
        this.setState({smtp_user:resp.data.data.smtp_user});
        this.setState({smtp_password:resp.data.data.smtp_password});
        this.setState({smtp_email:resp.data.data.smtp_email});
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

  onChangeSmtpHost(e) {
    this.setState({smtp_host: e.target.value });
  }
  onChangeSmtpPort(e) {
    this.setState({ smtp_port: e.target.value });
  }
  onChangeSmtpUser(e) {
    this.setState({ smtp_user: e.target.value });
  }
  onChangeSmtpPassword(e) {
    this.setState({  smtp_password: e.target.value });
  }
  onChangeSmtpEmail(e) {
    this.setState({  smtp_email: e.target.value });
  }
    
  async submit() {
    var data = {
    smtp_host: this.state.smtp_host,
    smtp_port: this.state.smtp_port,
    smtp_user: this.state.smtp_user,
    smtp_password: this.state.smtp_password,
    smtp_email: this.state.smtp_email,
    };

    //Validation starts
    if (data.smtp_host === undefined || data.smtp_host === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.smtp_port=== undefined || data.smtp_port=== "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.smtp_user === undefined || data.smtp_user === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.smtp_password === undefined || data.smtp_password === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.smtp_email === undefined || data.smtp_email === "") {
      return this.showWarningToast("Please fill mandatory information");
    }

    try {
      await TicketDataService.createUpdateSmtpConfigTenantSettings(data)
        .then(async (response) => {
          if (response.data.success) {
            this.showSuccessToast("SMTP Configured Successfully");
            console.log(response);
            
          } else {
            this.showErrorToast(response.data.message);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (ex) {
      console.log(ex);
    }

  }
  render() {
    return (
      <div>
        <div>
          <div class="shadow p-3 mb-5 rounded" style={{ backgroundColor: "#ffffff" }}>
          <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                    <h5 className="formHeading">Configure SMTP</h5>
                </div>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicSmtpHost">
                <Form.Label className="formlabel required">SMTP HOST</Form.Label>
                <Form.Control type="text" placeholder="Enter SMTP Host" value={this.state.smtp_host} onChange={this.onChangeSmtpHost} />
              </Form.Group>
			  
              <Form.Group className="mb-3" controlId="formBasicSmtpPort">
                <Form.Label className="formlabel required">SMTP PORT</Form.Label>
                <Form.Control type="text" placeholder="Enter SMTP Port" value={this.state.smtp_port} onChange={this.onChangeSmtpPort} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicSmtpUser">
                <Form.Label className="formlabel required">SMTP USER</Form.Label>
                <Form.Control type="text" placeholder="Enter SMTP User" value={this.state.smtp_user} onChange={this.onChangeSmtpUser} />
              </Form.Group>
			  
              <Form.Group className="mb-3" controlId="formBasicSmtpPassword">
                <Form.Label className="formlabel required">SMTP PASSWORD</Form.Label>
                <Form.Control type="password" placeholder="Enter SMTP Password" value={this.state.smtp_password} onChange={this.onChangeSmtpPassword} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicSmtpEmail">
                <Form.Label className="formlabel required">SMTP EMAIL ADDRESS</Form.Label>
                <Form.Control type="email" placeholder="Enter SMTP Email Address" value={this.state.smtp_email} onChange={this.onChangeSmtpEmail} />
              </Form.Group>
              
              <Button style={{ color: "#fff", backgroundColor: "#1f3143" }} variant="primary" type="button" onClick={this.submit}>
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }

}

export default Smtp_config;
