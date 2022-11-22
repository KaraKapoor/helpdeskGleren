import "./App.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Navbar/Header";
import Ticket from "./components/Ticket/ticket";
import TicketList from "./components/Ticket/ticketList";
import { Layout } from "./components/Shared/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from 'react-toastify';
import TicketView from "./components/Ticket/viewTicket";
import NewDashboard from "./components/Dashboard/NewDashboard";
import EscalatedTicket from "./components/Ticket/escalatedTicket";
import TransferTicket from "./components/Ticket/transferTicket";
import ViewTransferTicket from "./components/Ticket/viewTransferTicket";
import TicketListCentralPool from "./components/Ticket/listAllTicketsCentralPool";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import TicketDataService from "./services/ticket.service"
import FeedbackForm from "./components/Ticket/feedbackForm";
import ShowLoader from "./components/Ticket/showLoader";
import AgentMapping from "./components/Ticket/agent_Department_Mapping";
import ViewDepartmentAssociatedAgents from "./components/Ticket/agentsListInDepartment";
import DepartmentsList from "./components/Ticket/departmentsList";
import UnassociatedAgentsList from "./components/Ticket/unassociatedAgentsList";
import TeamList from "./components/Ticket/teamList";
import AddTeam from "./components/Ticket/addTeam";
import MyTeams from "./components/Ticket/myTeams";
import TicketAging from "./components/Ticket/ticketAging";
import Login from "./components/Ticket/login";
import PrivateRoute from "./components/Ticket/privateRoute";
import Smtp_config from "./components/Ticket/smtp_config";
import Users from "./components/Ticket/users";
import UsersList from "./components/Ticket/usersList";
import schoolEscalationList from "./components/Ticket/schoolEscalationList";
import addSchoolEscalation from "./components/Ticket/addSchoolEscalation";
import collegeEscalationList from "./components/Ticket/collegeEscalationList";
import addCollegeEscalation from "./components/Ticket/addCollegeEscalation";
import addAdministrative from "./components/Ticket/addAdministrative";
import administrativeList from "./components/Ticket/administrativeList";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayCountResponse: null
    }
  }

  async componentDidMount() {
    /*Start-For Development Purpose only */
    // sessionStorage.setItem("email", "dummy101010@narayanagroup.com");
    // sessionStorage.setItem("mobile", "+917011238983");
    // sessionStorage.setItem("userDepartment", "od-69a058fea9fcba8bfdf46ccae73aa552");
    // sessionStorage.setItem("employeeId", "101010");
    // sessionStorage.setItem("userId", "378");
    // sessionStorage.setItem("token", "u-sYJsPofun3IfIQoGP8Um2f");
    // sessionStorage.setItem("openId", "ou_8520339786d000365c980ae62244e185");

    // sessionStorage.setItem("email", "sri.charan@nspira.in");
    // sessionStorage.setItem("mobile", "+918179889386");
    // sessionStorage.setItem("userDepartment", "od-acf07dd3f9a5e3606d3bd1cfd906a390");
    // sessionStorage.setItem("employeeId", "322972");
    // sessionStorage.setItem("userId", "94");
    // sessionStorage.setItem("token", "u-sYJsPofun3IfIQoGP8Um2f");
    // sessionStorage.setItem("openId", "ou_10935bd375c25d0b32112f4e2957d4b2");


    sessionStorage.setItem("email", "sravankumarreddy.kunchala@cbd.nspira.in");
    sessionStorage.setItem("mobile", "+919963904689");
    sessionStorage.setItem("userDepartment", "od-01cda749fdb9f196ac1ed4c37fde9730");
    sessionStorage.setItem("employeeId", "299981");
    sessionStorage.setItem("userId", "57");
    sessionStorage.setItem("token", "u-sYJsPofun3IfIQoGP8Um2f");
    sessionStorage.setItem("openId", "ou_4ac604bee368ceee17e8ed00f5220a2b");
    /*End-For Development Purpose only */

    // window.onload = function() {
    //   if(!window.location.hash) {
    //     window.location = window.location + '#';
    //     window.location.reload();
    //   }
    // }

    if (!window.location.href.includes("feedbackForm")) {
      let params= new Object();
      params= this.get_Query_Params_From_URL();  
      
        Object.entries(params).map(item => {
          sessionStorage.setItem(item[0], item[1]);
        }) 
        const obj = {
          id: sessionStorage.getItem("userId"),
        }
        await TicketDataService.getUserDetails(obj)
          .then(async (response) => {
            if (response.data.helpdeskRole === null || response.data.helpdeskRole === "") {
              sessionStorage.setItem("isCentralPoolAgent", "false");
              sessionStorage.setItem("isTeamLead", "false");
              sessionStorage.setItem("isCentralAdmin", "false");
              sessionStorage.setItem("isAgent", "false");
            } else if (await response.data.helpdeskRole.toLowerCase() === "central agent") {
              sessionStorage.setItem("isCentralPoolAgent", "true");
              sessionStorage.setItem("isTeamLead", "false");
              sessionStorage.setItem("isCentralAdmin", "false");
              sessionStorage.setItem("isAgent", "false");
            } else if( await response.data.helpdeskRole.toLowerCase()==="team lead"){
              sessionStorage.setItem("isCentralPoolAgent", "true");
              sessionStorage.setItem("isTeamLead", "true");
              sessionStorage.setItem("isCentralAdmin", "false");
              sessionStorage.setItem("isAgent", "false");
            }  else if( await response.data.helpdeskRole.toLowerCase()==="central admin"){
              sessionStorage.setItem("isCentralPoolAgent", "true");
              sessionStorage.setItem("isTeamLead", "true");
              sessionStorage.setItem("isCentralAdmin", "true");
              sessionStorage.setItem("isAgent", "false");
            } else if (await response.data.helpdeskRole.toLowerCase() === "agent") {
              sessionStorage.setItem("isCentralPoolAgent", "false");
              sessionStorage.setItem("isTeamLead", "false");
              sessionStorage.setItem("isCentralAdmin", "false");
              sessionStorage.setItem("isAgent", "true");
            }
            else {
              sessionStorage.setItem("isCentralPoolAgent", "false");
              sessionStorage.setItem("isTeamLead", "false");
              sessionStorage.setItem("isCentralAdmin", "false");
              sessionStorage.setItem("isAgent", "false");
            }
  
          })
        const obj1 = {
          userId: sessionStorage.getItem("userId"),
        }
        await TicketDataService.getTicketsCountForDisplay(obj1)
          .then(async (response) => {
            this.setState({ displayCountResponse: response.data });
            console.log(this.state.displayCountResponse);
            await sessionStorage.setItem("allEscalatedTicketsCount", response.data.allEscalatedTickets);
            await sessionStorage.setItem("allTicketsCount", response.data.allTicketsCount);
            await sessionStorage.setItem("allTransferTickets", response.data.allTransferTickets);
            await sessionStorage.setItem("myTicketsCount", response.data.myTicketsCount);
            
          }) 

      }
  }
  get_Query_Params_From_URL() {
    var url = window.location.href;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0, result = {}; i < qs.length; i++) {
      qs[i] = qs[i].split('=');
      result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
  }
  render() {
    if (this.state.displayCountResponse === null) {
      return (
        <React.Fragment>
          {
            !window.location.href.includes("feedbackForm") &&
            <Header ></Header> &&
            <ShowLoader></ShowLoader>
          }
          <Layout>
            <Router>
              <Switch>
                <Route path="/feedbackForm" component={FeedbackForm}></Route>
              </Switch>
            </Router>
          </Layout>
        </React.Fragment>
      );
    } else if(window.location.href.includes("login")){
      return (
        <div style={{backgroundImage: `url("../Login_BG.jpg")`,backgroundSize:"cover",minHeight:"100vh"}}>
        <React.Fragment>
        <ToastContainer />
            <Router>
              <Switch>
                <Route path="/login" component={Login}></Route>
              </Switch>
            </Router>
        </React.Fragment>
        </div>

      );
    } else {
      return (<React.Fragment>
        <ToastContainer />
        {
          !window.location.href.includes("feedbackForm") &&
          <Header ></Header>
        }

        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" component={TicketList} />
              {/* <PrivateRoute path="/ticket" component={TicketList} /> */}
              <Route path="/ticket" component={TicketList} />
              <PrivateRoute path="/addTicket" component={Ticket} />
              <PrivateRoute path="/viewTicket" component={TicketView} />
              <PrivateRoute path="/dashboard" component={NewDashboard} />
              <PrivateRoute path="/escalatedTicket" component={EscalatedTicket} />
              <PrivateRoute path="/transferRequest" component={TransferTicket} />
              <PrivateRoute path="/viewTransferTicket" component={ViewTransferTicket} />
              <PrivateRoute path="/allTickets" component={TicketListCentralPool} />
              <PrivateRoute path="/feedbackForm" component={FeedbackForm} />
              <PrivateRoute path="/agentMapping" component={AgentMapping} />
              <PrivateRoute path="/viewDepartmentAssociatedAgents" component={ViewDepartmentAssociatedAgents} />
              <PrivateRoute path="/departmentsList" component={DepartmentsList} />
              <PrivateRoute path="/unassociatedAgentsList" component={UnassociatedAgentsList} />
              <PrivateRoute path="/teamList" component={TeamList} />
              <PrivateRoute path="/addTeam" component={AddTeam} />
              <PrivateRoute path="/myTeams" component={MyTeams} />
              <PrivateRoute path="/analytics" component={TicketAging} />
              <PrivateRoute path="/smtp_config" component={Smtp_config} />
              <PrivateRoute path="/users" component={Users} />
              <PrivateRoute path="/usersList" component={UsersList} />
              <PrivateRoute path="/schoolList" component={schoolEscalationList} />
              <PrivateRoute path="/addSchoolEscalation" component={addSchoolEscalation} />
              <PrivateRoute path="/collegeList" component={collegeEscalationList} />
              <PrivateRoute path="/addCollegeEscalation" component={addCollegeEscalation} />
              <PrivateRoute path="/addAdministrative" component={addAdministrative} />
              <PrivateRoute path="/administrativeList" component={administrativeList} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
      );
    }

  }
}
export default App;
