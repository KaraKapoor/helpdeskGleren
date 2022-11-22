import React, { Component } from "react";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row } from "react-bootstrap";
import "../Ticket/addTicket.css";
import { toast } from 'react-toastify';
import * as url from "../../http-common";
import * as Constants from "../Shared/constants";
class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.state = {
      email: undefined,
      password: undefined
    };
  }

  componentDidMount() {

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

  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }
  async login() {
    var data = {
      email: this.state.email,
      password: this.state.password
    };

    //Validation starts
    if (data.email === undefined || data.email === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.password === undefined || data.password === "") {
      return this.showWarningToast("Please fill mandatory information");
    }

    try {
      await TicketDataService.login(data)
        .then(async (response) => {
          if (response.data.success) {
            console.log(response);
            sessionStorage.setItem("email",response.data.responseObj.email);
            sessionStorage.setItem("mobile",response.data.responseObj.mobile);
            sessionStorage.setItem("openId",response.data.responseObj.openId);
            sessionStorage.setItem("userId",response.data.responseObj.id);
            sessionStorage.setItem("userDepartment",response.data.responseObj.openDepartmentId);
            sessionStorage.setItem("mobile",response.data.responseObj.mobile);
            sessionStorage.setItem("employeeId",response.data.responseObj.employeeId);
            sessionStorage.setItem("jwtToken",response.data.responseObj.token);

            this.props.history.push("/ticket");
            window.location.reload();
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
    // if (!this.state.renderData) {
    //   return <div />; //Render component once api call's are completed.
    // }
    return (
      <div>
        <div style={{ margin: "auto", width: "30%", paddingTop: "250px" }}>
          <div class="shadow p-3 mb-5 rounded" style={{ backgroundColor: "#ffefd5" }}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="formlabel required">Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={this.state.email} onChange={this.onChangeEmail} />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className="formlabel required">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.onChangePassword} />
              </Form.Group>
              <Button style={{ color: "#fff", backgroundColor: "#1f3143" }} variant="primary" type="button" onClick={this.login}>
                Login
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }

}

export default Login;
