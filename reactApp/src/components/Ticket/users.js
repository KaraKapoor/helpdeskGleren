import React, { Component } from "react";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row, Breadcrumb } from "react-bootstrap";

class Users extends Component {
    constructor(props) {
        super(props);
         this.saveUpdateUsers = this.saveUpdateUsers.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
	this.onChangeFullName = this.onChangeFullName.bind(this);
	this.onChangeOpenId = this.onChangeOpenId.bind(this);
	this.onChangeMobile = this.onChangeMobile.bind(this);
	this.onChangeOfficeType = this.onChangeOfficeType.bind(this);
	this.onChangeDesignation = this.onChangeDesignation.bind(this);
	this.onChangeHelpDeskRole = this.onChangeHelpDeskRole.bind(this);
	//this.onChangeIsAgent = this.onChangeIsAgent.bind(this);
	this.onChangeBranch = this.onChangeBranch.bind(this);
	this.onChangeOpenDepartmentId = this.onChangeOpenDepartmentId.bind(this);
	this.onChangeEmployeeId = this.onChangeEmployeeId.bind(this);
	this.onChangePassword = this.onChangePassword.bind(this);
        this.state = {
      email: undefined,
	  fullName: undefined,
      openId: undefined,
      mobile: undefined,
      officeType: undefined,
      designation: undefined,
      helpdeskRole: undefined,
     // isAgent: undefined,
      branch:undefined,
      openDepartmentId: undefined,
      employeeId: undefined,
      password: undefined,
	  userId: undefined
    };
        this.isViewMode = false;
        if (window.location.href.includes('/id:')) {
          var currentUrl = window.location.href;
          var idParam = currentUrl.split("/id:")
          this.state.userId = idParam[1];
            this.isViewMode = true;
        }
    }

   async componentDidMount() {
      var currentUrl = window.location.href;
      let url = new URL(currentUrl);
      let params = url.slice;
      console.log(params);
      if(params){
        this.getUserDetails(); 
      }
      if(this.state.userId!==undefined){
        const obj={
          id:this.state.userId
        }
        const resp=await TicketDataService.getUserById(obj);
        console.log(resp);
        this.setState({fullName:resp.data.fullName});
        console.log(this.state.fullName);
        this.setState({email:resp.data.email});
        this.setState({openId:resp.data.openId});
        this.setState({mobile:resp.data.mobile});
        this.setState({ helpdeskRole:resp.data.helpdeskRole});
        this.setState({openDepartmentId:resp.data.openDepartmentId});
        this.setState({employeeId:resp.data.employeeId});
        this.setState({officeType:resp.data.officeType});
        this.setState({branch:resp.data.branch});
       // this.setState({password:resp.data.password});
        //this.setState({isAgent:resp.data.isAgent});
        this.setState({designation:resp.data.designation});
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

  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
    onChangeFullName(e) {
    this.setState({ fullName: e.target.value });
  }
    onChangeOpenId(e) {
    this.setState({ openId: e.target.value });
  }
    onChangeMobile(e) {
    this.setState({  mobile: e.target.value });
  }
    onChangeOfficeType(e) {
    this.setState({  officeType: e.target.value });
  }
    onChangeDesignation(e) {
    this.setState({  designation: e.target.value });
  }
  onChangeHelpDeskRole(e) {
    this.setState({ helpdeskRole: e.target.value });
  }
//  onChangeIsAgent(e) {
//     this.setState({ isAgent: e.target.value });
//   }
   onChangeBranch(e) {
    this.setState({  branch: e.target.value });
  }
   onChangeOpenDepartmentId(e) {
    this.setState({ openDepartmentId: e.target.value });
  }
   onChangeEmployeeId(e) {
    this.setState({ employeeId: e.target.value });
  }
    onChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  
  async saveUpdateUsers() {
    //Validation starts
    if (this.state.email === undefined || this.state.email === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.fullName === undefined || this.state.fullName === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.openId === undefined || this.state.openId === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.mobile === undefined || this.state.mobile === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.officeType === undefined || this.state.officeType === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.designation === undefined || this.state.designation === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.helpdeskRole === undefined || this.state.helpdeskRole === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    // if (data.isAgent === undefined || data.isAgent === "") {
    //   return this.showWarningToast("Please fill mandatory information");
    // }
    if (this.state.branch === undefined || this.state.branch === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.openDepartmentId === undefined || this.state.openDepartmentId === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (this.state.employeeId === undefined || this.state.employeeId === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    // if (data.password === undefined || data.password === "") {
    //   return this.showWarningToast("Please fill mandatory information");
    // }
    let data = {};
    if (this.state.userId) {
      data = {
        id: this.state.userId,
        email: this.state.email,
        fullName: this.state.fullName,
        openId: this.state.openId,
        mobile: this.state.mobile,
        officeType: this.state.officeType,
        designation: this.state.designation,
        helpdeskRole: this.state.helpdeskRole,
        // isAgent: this.state.isAgent,
        branch: this.state.branch,
        openDepartmentId: this.state.openDepartmentId,
        employeeId: this.state.employeeId,
        //  password: this.state.password,
      }
      await TicketDataService.create(data).then((resp) => {
        if (resp) {
          this.showSuccessToast(" Details Submitted Successfully");
          this.props.history.push("/usersList");
        } else {
          this.showErrorToast(resp.data.message);
        }
      })
    } else {
      data = {
        email: this.state.email,
        fullName: this.state.fullName,
        openId: this.state.openId,
        mobile: this.state.mobile,
        officeType: this.state.officeType,
        designation: this.state.designation,
        helpdeskRole: this.state.helpdeskRole,
        //isAgent: this.state.isAgent,
        branch: this.state.branch,
        openDepartmentId: this.state.openDepartmentId,
        employeeId: this.state.employeeId,
        password: this.state.password,
      }
      await TicketDataService.create(data).then((resp) => {
        if (resp) {
          this.showSuccessToast("User details submitted");
          this.props.history.push("/usersList");
        } else {
          this.showErrorToast(resp.data.message);
        }
      })
    }
  }

    async getUserDetails(){
        const data = {
            userId: this.state.userId
        }
        const userResp = await TicketDataService.getUserById(data);
         this.setState({ email: userResp.data.teamName });
        this.setState({ fullName: userResp.data.fullName });
        this.setState({ openId: userResp.data.openId });
        this.setState({ mobile: userResp.data.mobile });
		this.setState({ officeType: userResp.data.officeType });
		this.setState({ designation: userResp.data.designation });
		this.setState({ helpdeskRole: userResp.data.helpdeskRole });
		//this.setState({ isAgent: userResp.data.isAgent });
		this.setState({ branch: userResp.data.branch });
		this.setState({ openDepartmentId: userResp.data.openDepartmentId });
		this.setState({ employeeId: userResp.data.employeeId });
		this.setState({ password: userResp.data.password });
		

        //Prepopulate all users
        for (let i of userResp.data) {
            this.getUserDetails(i.value);

        }
    }
    render() {
        return (
            <div>
        <div>
        <h5 className="formHeading">Users</h5>
          <div class="shadow p-3 mb-5 rounded" style={{ backgroundColor: "#ffffff" }}>
          
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="formlabel required">Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={this.state.email} onChange={this.onChangeEmail} />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
			  
              <Form.Group className="mb-3" controlId="formBasicFullName">
                <Form.Label className="formlabel required">Full Name</Form.Label>
                <Form.Control type="input" placeholder="Enter Full Name" value={this.state.fullName} onChange={this.onChangeFullName} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicOpenId">
                <Form.Label className="formlabel required">Open Id</Form.Label>
                <Form.Control type="input" placeholder="Enter Open Id" value={this.state.openId} onChange={this.onChangeOpenId} />
              </Form.Group>
			  
              <Form.Group className="mb-3" controlId="formBasicMobile">
                <Form.Label className="formlabel required">Mobile</Form.Label>
                <Form.Control type="PhoneInput" maxLength="12" placeholder="Enter Mobile No." value={this.state.mobile} onChange={this.onChangeMobile} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicOfficeType">
                <Form.Label className="formlabel required">Office Type</Form.Label>
                <Form.Control type="text" placeholder="Enter Office Type" value={this.state.officeType} onChange={this.onChangeOfficeType} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicDesignation">
                <Form.Label className="formlabel required">Designation</Form.Label>
                <Form.Control type="text" placeholder="Enter Designation" value={this.state.designation} onChange={this.onChangeDesignation} />
              </Form.Group>
			  <Form.Group className="mb-3" controlId="formBasicHelpDeskRole">
                <Form.Label className="formlabel required">Help Desk Role</Form.Label>
                <Form.Control type="text" placeholder="Enter Help Desk Role" value={this.state.helpdeskRole} onChange={this.onChangeHelpDeskRole} />
              </Form.Group>
			  {/* <Form.Group className="mb-3" controlId="formBasicIsAgent">
                <Form.Label className="formlabel ">Is Agent</Form.Label>
                <Form.Control type="Boolean" placeholder="Is Agent" value={this.state.isAgent} onChange={this.onChangeIsAgent}/> */}
                {/* <div className="radio">
          <label>
            <input  type="radio" value="true"checked={true} />
            True
          </label>
          <label style={{ marginTop: "5px", marginLeft: "20px" }}>
            <input  type="radio" value="false" checked={false} />
            False
          </label>
        </div> */}
             
 
			   <Form.Group className="mb-3" controlId="formBasicBranch">
                <Form.Label className="formlabel required">Branch</Form.Label>
                <Form.Control type="input" placeholder="Enter Branch" value={this.state.branch} onChange={this.onChangeBranch} />
              </Form.Group>
			  <Form.Group className="mb-3" controlId="formBasicOpenDepartmentId">
                <Form.Label className="formlabel required">Open Department Id</Form.Label>
                <Form.Control type="input" placeholder="Enter Department Id" value={this.state.openDepartmentId} onChange={this.onChangeOpenDepartmentId} />
              </Form.Group>
			  <Form.Group className="mb-3" controlId="formBasicEmployeeId">
                <Form.Label className="formlabel required">Employee Id</Form.Label>
                <Form.Control type="input" placeholder="Enter Employee Id" value={this.state.employeeId} onChange={this.onChangeEmployeeId} />
              </Form.Group>
              {/* {this? style={{ visibility: show}} : style={{ "visibile": "hidden"}}   } */}
            <Form.Group className="mb-3" controlId="formBasicPassword" style={{visibility:this.state.userId==undefined?"visible":"hidden"}}>
                <Form.Label className="formlabel ">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.onChangePassword} />
              </Form.Group>
              <Button style={{ color: "#fff", backgroundColor: "#1f3143" }} variant="primary" type="button" onClick={this.saveUpdateUsers}>
              {this.isViewMode?'Update':'Submit'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
        );
    }
}
export default Users;