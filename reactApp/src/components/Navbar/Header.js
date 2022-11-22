import React, { Component } from "react";
import "../Navbar/Header.css";
import * as Constants from "../Shared/constants";
import TicketDataService from "../../services/ticket.service";
import {
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_users_enabled:"NA",
      is_smtp_enabled:"NA",
      is_school_esc_enabled:"NA",
      is_college_esc_enabled:"NA",
      is_administrative_esc_enabled:"NA",
      isAgent: "NA",
      userId: "",
      activeUrlRoute:"",
    }
   
    this.state.userId = sessionStorage.getItem("userId");
    this.getUserDetails();
    this.getTenantSettings();
  }

  componentDidMount() {
    this.getUserDetails();
    // this.getTenantSettings();
    /**Start:Highlight the active nav item */
    let url = window.location.pathname;
    if (url.includes('/ticket') || url.includes('/viewTicket')) {
      this.setState({ activeUrlRoute: '/ticket' });
    } else if (url.includes('/addTicket')) {
      this.setState({ activeUrlRoute: '/addTicket' });
    } else if (url.includes('/escalatedTicket')) {
      this.setState({ activeUrlRoute: '/escalatedTicket' });
    } else if (url.includes('/transferRequest') || url.includes('/viewTransferTicket')) {
      this.setState({ activeUrlRoute: '/transferRequest' });
    } else if (url.includes('/allTickets')) {
      this.setState({ activeUrlRoute: '/allTickets' });
    } else if (url.includes('/myTeams')) {
      this.setState({ activeUrlRoute: '/myTeams' });
    } else if (url.includes('/dashboard')) {
      this.setState({ activeUrlRoute: '/dashboard' });
    } else if (url.includes('/analytics')) {
      this.setState({ activeUrlRoute: '/analytics' });
    }
    else {
      this.setState({ activeUrlRoute: '/ticket' });
    }
    /**End:Highlight the active nav item */

  }

  getUserDetails() {
    const obj = {
      id: this.state.userId,
    }
    TicketDataService.getUserDetails(obj)
      .then((response) => {
        this.setState({ isAgent: response.data.isAgent });
        this.setState({isCentralPoolAgent:sessionStorage.getItem("isCentralPoolAgent")});
        this.setState({isTeamLead:sessionStorage.getItem("isTeamLead")});
        this.setState({isCentralAdmin:sessionStorage.getItem("isCentralAdmin")});
      })

  }

  getTenantSettings() {
    const data = {
      
    }
    TicketDataService.findByTenantName(data).then((response) => {
        this.setState({ is_smtp_enabled: response.data.data.is_smtp_enabled }); 
        this.setState({ is_school_esc_enabled: response.data.data.is_school_esc_enabled }); 
        this.setState({ is_college_esc_enabled: response.data.data.is_college_esc_enabled }); 
        this.setState({ is_administrative_esc_enabled: response.data.data.is_administrative_esc_enabled }); 
        this.setState({ is_users_enabled: response.data.data.is_users_enabled }); 

        
      })

  }
  refreshPage(){
    window.location.reload(true);
  }
  logout(){
    sessionStorage.clear();
    window.location.reload();
  }
  render() {
    return (
      <div style={{display:"flex",flexDirection:"column",position:"fixed",width:"100%",top:"0",zIndex:"1"}}>
        <div>
          <Navbar className="backgroundColor" expand="lg">
            <Navbar.Brand href="">
              <img
                src="../glerenLogo.png"
                width="100%"
                height="auto"
                className="d-inline-block align-top"
                alt="HelpDesk Mini App"
              />
            </Navbar.Brand>
            <Navbar.Text className="ml-auto version"><span style={{fontWeight:"bold"}}>Version:</span> {Constants.APPLICATION_VERSION_NUMBER}<br></br><span style={{fontWeight:"bold"}}>Helpdesk number:</span> 251-2566353</Navbar.Text>
          </Navbar>
        </div>

        <div>
          <Navbar className="backgroundColor" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto" activeKey={this.state.activeUrlRoute}>
                {/* {
                  (this.state.isAgent === "true" || this.state.isCentralPoolAgent === "true" || this.state.isTeamLead==="true" || this.state.isCentralAdmin==="true") && <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                } */}
                <Nav.Link href="/ticket">My Tickets ({sessionStorage.getItem("myTicketsCount")})</Nav.Link>
                <Nav.Link href="/addTicket">New Ticket</Nav.Link>
                {
                  (this.state.isAgent === "true" || this.state.isCentralPoolAgent === "true" || this.state.isTeamLead==="true" || this.state.isCentralAdmin==="true") && <Nav.Link href="/escalatedTicket">Escalated Tickets ({sessionStorage.getItem("allEscalatedTicketsCount")})</Nav.Link>
                }
                {
                  (this.state.isCentralPoolAgent === "true" || this.state.isTeamLead==="true" || this.state.isCentralAdmin==="true") && <Nav.Link href="/transferRequest">Transfer Request ({sessionStorage.getItem("allTransferTickets")})</Nav.Link>
                }
                {
                  (this.state.isTeamLead==="true" || this.state.isCentralAdmin==="true") && <Nav.Link href="/myTeams">My Teams</Nav.Link>
                }
                <Nav.Link href="/analytics">Analytics</Nav.Link>
                {
                  (this.state.isCentralPoolAgent === "true" || this.state.isTeamLead==="true" || this.state.isCentralAdmin==="true") && <Nav.Link href="/allTickets">All Tickets ({sessionStorage.getItem("allTicketsCount")})</Nav.Link>
                }
                {
                  this.state.isCentralAdmin === "true"
                  &&
                  <NavDropdown title="Admin"  id="basic-nav-dropdown">
                    <div className="header">
                    <NavDropdown.Item href="/agentMapping" >Agent Mapping</NavDropdown.Item>
                    <NavDropdown.Item href="/teamList" >Teams</NavDropdown.Item>
                    {this.state.is_smtp_enabled === true && this.state.isCentralAdmin === "true" && <NavDropdown.Item href="/smtp_config">Configure SMTP</NavDropdown.Item>}
                    
                    {this.state.is_users_enabled === true && this.state.isCentralAdmin === "true" &&  <NavDropdown.Item href="/usersList">Users</NavDropdown.Item>}
                    {this.state.is_school_esc_enabled === true && this.state.isCentralAdmin === "true" &&  <NavDropdown.Item href="/schoolList">School Escalation</NavDropdown.Item>}
                    {this.state.is_college_esc_enabled === true && this.state.isCentralAdmin === "true" && <NavDropdown.Item href="/collegeList">College Escalation</NavDropdown.Item>  }
                    {this.state.is_administrative_esc_enabled === true && this.state.isCentralAdmin === "true" && <NavDropdown.Item href="/administrativeList">Administrative Escalation</NavDropdown.Item> }
                    
                    </div>
                  </NavDropdown>
                }

                <Nav.Link onClick={this.refreshPage}><i class="fa fa-refresh" aria-hidden="true"></i></Nav.Link>
                {sessionStorage.getItem("jwtToken") && <Nav.Link visi onClick={this.logout}>Logout</Nav.Link>}

                {/* <Nav.Link href="/newDashboard">New Dashboard</Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>
    );
  }
}
export default Header;
