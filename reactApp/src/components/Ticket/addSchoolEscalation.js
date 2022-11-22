import React, { Component } from "react";
import { toast } from 'react-toastify';
import "../Ticket/addTicket.css";
import TicketDataService from "../../services/ticket.service";
import { Col, Form, Button, Row, Breadcrumb } from "react-bootstrap";
import { data } from "jquery";

class addSchoolEscalation extends Component {
    constructor(props) {
        super(props);
         this.saveUpdateSchoolEscalation = this.saveUpdateSchoolEscalation.bind(this);
    this.onChangebranch = this.onChangebranch.bind(this);
	this.onChangedepartment = this.onChangedepartment.bind(this);
	this.onChangemodule = this.onChangemodule.bind(this);
	this.onChangestate = this.onChangestate.bind(this);
	this.onChangedistrict = this.onChangedistrict.bind(this);
	this.onChangeagm = this.onChangeagm.bind(this);
	this.onChangeblankcol = this.onChangeblankcol.bind(this);
	this.onChangel1name = this.onChangel1name.bind(this);
	this.onChangel1mobile = this.onChangel1mobile.bind(this);
	this.onChangel1email = this.onChangel1email.bind(this);
    this.onChangel2name = this.onChangel2name.bind(this);
	this.onChangel2mobile = this.onChangel2mobile.bind(this);
	this.onChangel2email = this.onChangel2email.bind(this);
    this.onChangel3name = this.onChangel3name.bind(this);
	this.onChangel3mobile = this.onChangel3mobile.bind(this);
	this.onChangel3email = this.onChangel3email.bind(this);
    this.onChangel4name = this.onChangel4name.bind(this);
	this.onChangel4mobile = this.onChangel4mobile.bind(this);
	this.onChangel4email = this.onChangel4email.bind(this);
    this.onChangel5name = this.onChangel5name.bind(this);
	this.onChangel5mobile = this.onChangel5mobile.bind(this);
	this.onChangel5email = this.onChangel5email.bind(this);
    this.onChangehodname = this.onChangehodname.bind(this);
	this.onChangehodmobile = this.onChangehodmobile.bind(this);
	this.onChangehodemail = this.onChangehodemail.bind(this);

        this.state = {
               department: undefined,
               branch:undefined,
                module: undefined,
                state: undefined,
                district: undefined,
                agm: undefined,
                blankcol: undefined,
                l1name: undefined,
                l1mobile: undefined,
                l1email: undefined,
                l2name: undefined,
                l2mobile: undefined,
                l2email: undefined,
                l3name: undefined,
                l3mobile: undefined,
                l3email: undefined,
                l4name: undefined,
                l4mobile: undefined,
                l4email: undefined,
                l5name: undefined,
                l5mobile: undefined,
                l5email: undefined,
                hodname: undefined,
                hodmobile: undefined,
                hodemail: undefined,
                idschoolescalation: undefined
    };
        this.isViewMode = false;
        if (window.location.href.includes('/id:')) {
          var currentUrl = window.location.href;
          var idParam = currentUrl.split("/id:")
          this.state.idschoolescalation = idParam[1];
            this.isViewMode = true;
        }
    }

   async componentDidMount() {
      if(this.state.idschoolescalation!==undefined){
        const data={
          id:this.state.idschoolescalation
        }
        const resp=await TicketDataService.getSchoolEscalationById(data);
        console.log(resp);
        this.setState({department:resp.data.department});
        this.setState({branch:resp.data.branch});
        // console.log(this.state.fullName);
        this.setState({module:resp.data.module});
        this.setState({state:resp.data.state});
        this.setState({district:resp.data.district});
        this.setState({ agm:resp.data.agm});
        this.setState({blankcol:resp.data.blankcol});
        this.setState({l1name:resp.data.l1name});
        this.setState({l1mobile:resp.data.l1mobile});
        this.setState({l1email:resp.data.l1email});
        this.setState({l2name:resp.data.l2name});
        this.setState({l2mobile:resp.data.l2mobile});
        this.setState({l2email:resp.data.l2email});
        this.setState({l3name:resp.data.l3name});
        this.setState({l3mobile:resp.data.l3mobile});
        this.setState({l3email:resp.data.l3email});
        this.setState({l4name:resp.data.l4name});
        this.setState({l4mobile:resp.data.l4mobile});
        this.setState({l4email:resp.data.l4email});
        this.setState({l5name:resp.data.l5name});
        this.setState({l5mobile:resp.data.l5mobile});
        this.setState({l5email:resp.data.l5email});
        this.setState({hodname:resp.data.hodname});
        this.setState({hodmobile:resp.data.hodmobile});
        this.setState({hodemail:resp.data.hodemail});
       // this.setState({password:resp.data.password});
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

    onChangebranch(e) {
    this.setState({ branch: e.target.value });
  }
  onChangedepartment(e) {
    this.setState({ department: e.target.value });
  }
  onChangemodule(e) {
    this.setState({ module: e.target.value });
  }
    onChangestate(e) {
    this.setState({  state: e.target.value });
  }
    onChangedistrict(e) {
    this.setState({  district: e.target.value });
  }
    onChangeagm(e) {
    this.setState({  agm: e.target.value });
  }
  onChangeblankcol(e) {
    this.setState({ blankcol: e.target.value });
  }
 onChangel1name(e) {
    this.setState({ l1name: e.target.value });
  }
  onChangel1mobile(e) {
    this.setState({ l1mobile: e.target.value });
  }
  onChangel1email(e) {
    this.setState({ l1email: e.target.value });
  }
  onChangel2name(e) {
    this.setState({ l2name: e.target.value });
  }
  onChangel2mobile(e) {
    this.setState({ l2mobile: e.target.value });
  }
  onChangel2email(e) {
    this.setState({ l2email: e.target.value });
  }
  onChangel3name(e) {
    this.setState({ l3name: e.target.value });
  }
  onChangel3mobile(e) {
    this.setState({ l3mobile: e.target.value });
  }
  onChangel3email(e) {
    this.setState({ l3email: e.target.value });
  }
  onChangel4name(e) {
    this.setState({ l4name: e.target.value });
  }
  onChangel4mobile(e) {
    this.setState({ l4mobile: e.target.value });
  }
  onChangel4email(e) {
    this.setState({ l4email: e.target.value });
  }
  onChangel5name(e) {
    this.setState({ l5name: e.target.value });
  }
  onChangel5mobile(e) {
    this.setState({ l5mobile: e.target.value });
  }
  onChangel5email(e) {
    this.setState({ l5email: e.target.value });
  }
  onChangehodname(e) {
    this.setState({ hodname: e.target.value });
  }
  onChangehodmobile(e) {
    this.setState({ hodmobile: e.target.value });
  }
  onChangehodemail(e) {
    this.setState({ hodemail: e.target.value });
  }

    async saveUpdateSchoolEscalation() {
      let data = {};
      if (this.state.idschoolescalation) {
          data = {

            department: this.state.department,
            branch: this.state.branch,
            module: this.state. module,
            state: this.state.state,
            district: this.state.district,
            agm: this.state.agm,
            blankcol: this.state.blankcol,
            l1name: this.state.l1name,
            l1mobile: this.state.l1mobile,
            l1email: this.state.l1email,
            l2name: this.state.l2name,
            l2mobile: this.state.l2mobile,
            l2email: this.state.l2email,
            l3name: this.state.l3name,
            l3mobile: this.state.l3mobile,
            l3email: this.state.l3email,
            l4name: this.state.l4name,
            l4mobile: this.state.l4mobile,
            l4email: this.state.l4email,
            l5name: this.state.l5name,
            l5mobile: this.state.l5mobile,
            l5email: this.state.l5email,
            hodname: this.state.hodname,
            hodmobile: this.state.hodmobile,
            hodemail: this.state.hodemail,
            id: this.state.idschoolescalation,


          }
          await TicketDataService.createUpdateSchool(data).then((resp) => {
              if (resp) {
                this.showSuccessToast(" Details Submitted Successfully");
                  this.props.history.push("/schoolList");
              } else {
                  this.showErrorToast(resp.message);
              }
          })
      } else {
          data = {
            department: this.state.department,
            branch: this.state.branch,
            module: this.state. module,
            state: this.state.state,
            district: this.state.district,
            agm: this.state.agm,
            blankcol: this.state.blankcol,
            l1name: this.state.l1name,
            l1mobile: this.state.l1mobile,
            l1email: this.state.l1email,
            l2name: this.state.l2name,
            l2mobile: this.state.l2mobile,
            l2email: this.state.l2email,
            l3name: this.state.l3name,
            l3mobile: this.state.l3mobile,
            l3email: this.state.l3email,
            l4name: this.state.l4name,
            l4mobile: this.state.l4mobile,
            l4email: this.state.l4email,
            l5name: this.state.l5name,
            l5mobile: this.state.l5mobile,
            l5email: this.state.l5email,
            hodname: this.state.hodname,
            hodmobile: this.state.hodmobile,
            hodemail: this.state.hodemail,
        // password: this.state.password,
          }
          await TicketDataService.createUpdateSchool(data).then((resp) => {
              if (resp) {
                this.showSuccessToast("Details submitted");
                  this.props.history.push("/schoolList");
              } else {
                  this.showErrorToast(resp.message);
              }
          })
      }
  

    //Validation starts
    if (data.department === undefined || data.department === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data.branch=== undefined || data.branch=== "") {
      return this.showWarningToast("Please fill mandatory information");
    }
    if (data. module === undefined || data. module === "") {
      return this.showWarningToast("Please fill mandatory information");
    }
  }

    async getSchoolEscalationDetails(){
        const data = {
            idschoolescalation: this.state.idschoolescalation
        }
        const resp = await  TicketDataService.getSchoolEscalationById(data);
        this.setState({department:resp.data.department});
        this.setState({department:resp.data.branch});
        // console.log(this.state.fullName);
        this.setState({module:resp.data.module});
        this.setState({state:resp.data.state});
        this.setState({district:resp.data.district});
        this.setState({ agm:resp.data.agm});
        this.setState({blankcol:resp.data.blankcol});
        this.setState({l1name:resp.data.l1name});
        this.setState({l1mobile:resp.data.l1mobile});
        this.setState({l1email:resp.data.l1email});
        this.setState({l2name:resp.data.l2name});
        this.setState({l2mobile:resp.data.l2mobile});
        this.setState({l2email:resp.data.l2email});
        this.setState({l3name:resp.data.l3name});
        this.setState({l3mobile:resp.data.l3mobile});
        this.setState({l3email:resp.data.l3email});
        this.setState({l4name:resp.data.l4name});
        this.setState({l4mobile:resp.data.l4mobile});
        this.setState({l4email:resp.data.l4email});
        this.setState({l5name:resp.data.l5name});
        this.setState({l5mobile:resp.data.l5mobile});
        this.setState({l5email:resp.data.l5email});
        this.setState({hodname:resp.data.hodname});
        this.setState({hodmobile:resp.data.hodmobile});
        this.setState({hodemail:resp.data.hodemail});

        //Prepopulate all users
        for (let i of resp.data) {
            this.getSchoolEscalationDetails(i.value);

        }
    }
    render() {
        return (
            <div>
        <div>
        <h5 className="formHeading">School Escalation</h5>
          <div class="shadow p-3 mb-5 rounded" style={{ backgroundColor: "#ffffff" }}>
          
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="formlabel required">Branch</Form.Label>
                <Form.Control type="input" placeholder="Enter Branch" value={this.state.branch} onChange={this.onChangebranch} />
              </Form.Group>
			  
              <Form.Group className="mb-3" controlId="formBasicFullName">
                <Form.Label className="formlabel required">Department</Form.Label>
                <Form.Control type="input" placeholder="Enter Department" value={this.state.department} onChange={this.onChangedepartment} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicOpenId">
                <Form.Label className="formlabel required">Module</Form.Label>
                <Form.Control type="input" placeholder="Enter Module" value={this.state.module} onChange={this.onChangemodule} />
              </Form.Group>
			  
              <Form.Group className="mb-3" controlId="formBasicMobile">
                <Form.Label className="formlabel">State</Form.Label>
                <Form.Control type="PhoneInput" maxLength="12" placeholder="Enter State" value={this.state.state} onChange={this.onChangestate} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicOfficeType">
                <Form.Label className="formlabel ">District</Form.Label>
                <Form.Control type="text" placeholder="Enter District" value={this.state.district} onChange={this.onChangedistrict} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicDesignation">
                <Form.Label className="formlabel">agm</Form.Label>
                <Form.Control type="text" placeholder="Agm" value={this.state.agm} onChange={this.onChangeagm} />
              </Form.Group>
			  <Form.Group className="mb-3" controlId="formBasicHelpDeskRole">
                <Form.Label className="formlabel">blankcol</Form.Label>
                <Form.Control type="text" placeholder="Blankcol" value={this.state.blankcol} onChange={this.onChangeblankcol} />
              </Form.Group>
              <label className="subHeading"> <b>Level 1 Details</b> </label>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-1 Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" value={this.state.l1name} onChange={this.onChangel1name} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-1 Mobile</Form.Label>
                <Form.Control type="text" placeholder="Enter Mobile number" value={this.state.l1mobile} onChange={this.onChangel1mobile} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-1 Email</Form.Label>
                <Form.Control type="email" placeholder="Enter Email Address" value={this.state.l1email} onChange={this.onChangel1email} />
              </Form.Group>
              <label className="subHeading"> <b>Level 2 Details</b> </label>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-2 Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" value={this.state.l2name} onChange={this.onChangel2name} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-2 Mobile</Form.Label>
                <Form.Control type="text" placeholder="Enter Mobile number" value={this.state.l2mobile} onChange={this.onChangel2mobile} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-2 Email</Form.Label>
                <Form.Control type="email" placeholder="Enter Email Address" value={this.state.l2email} onChange={this.onChangel2email} />
              </Form.Group>
              <label className="subHeading"> <b>Level 3 Details</b> </label>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-3 Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" value={this.state.l3name} onChange={this.onChangel3name} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-3 Mobile</Form.Label>
                <Form.Control type="text" placeholder="Enter Mobile number" value={this.state.l3mobile} onChange={this.onChangel3mobile} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-3 Email</Form.Label>
                <Form.Control type="email" placeholder="Enter Email Address" value={this.state.l3email} onChange={this.onChangel3email} />
              </Form.Group>
              <label className="subHeading"> <b>Level 4 Details</b> </label>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-4 Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" value={this.state.l4name} onChange={this.onChangel4name} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-4 Mobile</Form.Label>
                <Form.Control type="text" placeholder="Enter Mobile number" value={this.state.l4mobile} onChange={this.onChangel4mobile} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-4 Email</Form.Label>
                <Form.Control type="email" placeholder="Enter Email Address" value={this.state.l4email} onChange={this.onChangel4email} />
              </Form.Group>
              <label className="subHeading"> <b>Level 5 Details</b> </label>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-5 Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" value={this.state.l5name} onChange={this.onChangel5name} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-5 Mobile</Form.Label>
                <Form.Control type="text" placeholder="Enter Mobile number" value={this.state.l5mobile} onChange={this.onChangel5mobile} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Level-5 Email</Form.Label>
                <Form.Control type="email" placeholder="Enter Email Address" value={this.state.l5email} onChange={this.onChangel5email} />
              </Form.Group>
              <label className="subHeading"> <b>Hod Details</b> </label>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Hod Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" value={this.state.hodname} onChange={this.onChangehodname} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Hod Mobile</Form.Label>
                <Form.Control type="text" placeholder="Enter Mobile number" value={this.state.hodmobile} onChange={this.onChangehodmobile} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="formlabel">Hod Email</Form.Label>
                <Form.Control type="email" placeholder="Enter Email Address" value={this.state.hodemail} onChange={this.onChangehodemail} />
              </Form.Group>
              <Button style={{ color: "#fff", backgroundColor: "#1f3143" }} variant="primary" type="button" onClick={this.saveUpdateSchoolEscalation}>
              {this.isViewMode?'Update':'Submit'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
        );
    }
}
export default addSchoolEscalation;