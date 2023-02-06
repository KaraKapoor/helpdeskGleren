import React, { Fragment, useEffect,useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import moment from "moment";
import { Formik } from "formik";
import "./ticketsList.css";
import {
  Card,
  Checkbox,
  Divider,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import styled from "@emotion/styled";
import {
 getMasterDropdownData,
 getStatusByDepartment
} from "app/services/adminService";
import {
  allTickets,
  deleteFile,
  downloadFile,
  fileUpload,
  getFixVersionByProject,
  getTicketById,
  updateTicket,
} from "app/services/ticketService";
import CustomTabs from "./customTabs";
import CircularProgress from "../../components/MatxLoading";
import AsyncSelect from "react-select/async";

const ViewTicket = ({ onClose }) => {
  const [assignees, setAssignee] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [status, setStatus] = React.useState([]);
  const [priority, setPriority] = React.useState([]);
  const [editData, setEditData] = React.useState();
  const [selectedReporter, setSelectedReporter] = React.useState();
  const [selectedDepartment, setSelectedDepartment] = React.useState();
  const [selectedProject, setSelectedProject] = React.useState();
  const [selectedAssignee, setSelectedAssignee] = React.useState();
  const [selectedCategory, setSelectedCategory] = React.useState();
  const [selectedStatus, setSelectedStatus] = React.useState();
  const [selectedPriority, setSelectedPriority] = React.useState();
  const [selectedResolvedBy, setSelectedResolvedBy] = React.useState();
  const [selectedTestedBy, setSelectedTestedBy] = React.useState();
  const [selectedReviewedBy, setSelectedReviewedBy] = React.useState();
  const [initialValues, setInitialValues] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [fixverions, setFixverions] = React.useState([]);
  const [linktickets, setLinkedTickets]= React.useState([])
  const [selectedValue, setSelectedValue] = useState(null);
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [fileLoading, setfileLoading] = React.useState(false);
  const [parentticket , setparentticket]=React.useState([])
  const [LinkedeleteValue,setLinkedeleteValue] = React.useState(false)
  const navigate = useNavigate();
  var host = window.location.protocol + "//" + window.location.host;
  const HeaderTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    font-size: 1.5rem;
  `;
  const FormContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props) => (props.divide ? "50% 48.4%" : "100%")};
    padding: 1rem 1rem 0 1rem;
    gap: 1rem;
  `;
  const LinkedHeadFlex = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:5px 0px;
`
const ISactiveError = styled.div`
width:15px;
height:15px;
border:5px solid red;
background-color:red;
color:white;
border-radius:50%;
text-align:center;
`
  const ContentBox = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
  }));
  const updateTicketDetails = (value, fieldType) => {
    let reqBody = {
      field: fieldType,
      id: editData.id,
    };
    switch (fieldType) {
      case "issueDetails":
        if (editData.issue_details === value) {
          return null;
        }
        reqBody.issueDetails = value;
        break;
      case "issueSummary":
        if (editData.issue_summary === value) {
          return null;
        }
        reqBody.issueSummary = value;
        break;
      case "files":
        reqBody.files = value;
        break;
      case "assignee":
        reqBody.assignee = value;
        break;
      case "category":
        reqBody.category = value;
        break;
      case "status":
        reqBody.status = value;
        break;
      case "priority":
        reqBody.priority = value;
        break;
      case "fixVersion":
        if (editData.fix_version === value) {
          return null;
        }
        reqBody.fixVersion = value;
        break;
      case "dueDate":
        if (editData.due_date === value) {
          return null;
        }
        reqBody.dueDate = value;
        break;
      case "storyPoints":
        if (editData.story_points === value) {
          return null;
        }
        reqBody.storyPoints = value;
        break;
      case "resolvedBy":
        reqBody.resolvedBy = value;
        break;
      case "testedBy":
        reqBody.testedBy = value;
        break;
      case "reviewedBy":
        reqBody.reviewedBy = value;
        break;
      case "linked_tickets":
          reqBody.linked_tickets = value?.map((data) => data);
        break;
    }
    updateTicket(reqBody).then((resp) => {
      if (resp?.status === false) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: resp.error,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
      } else {
        getTicketDetails(editData.id);
        return Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Successfully",
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
      }
    });
  };
  const onClickClose = () => {
    navigate("/");
  };
  useEffect(() => {
    getMasterDropdownData().then((resp) => {
      if (resp?.status === false) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: resp.error,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
      } else {
        setCategory(resp?.data?.ticketCategory);
        // setAssignee(resp?.data?.agents);

        let agents = resp?.data?.agents;
        let users = resp?.data?.users;
        let combinedArray = agents.concat(users);
        setAssignee(combinedArray);
        setPriority(resp?.data?.ticketPriorites);
      }
    });
    const url = window.location.href;
    const id = url.split("/").pop();
    getTicketDetails(id);
  }, []);

  const getStatusByDepId = async (departmentId) => {
    await getStatusByDepartment({ departmentId }).then(async(response) => {
      setStatus(response.data);
    })
  }

  const getTicketDetails = (id) => {
    getTicketById({ id: id }).then(async(resp) => {
      if (resp?.status === false) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: resp.error,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
      } else {
        setEditData(resp.data);
        setSelectedReporter(
          resp.data.createdBy.first_name + " " + resp.data.createdBy.last_name
        );
        setSelectedDepartment(resp.data.department.name);
        await getStatusByDepId(resp.data.department_id);
        setLinkedTickets(resp.data.linked_tickets)
        setparentticket(resp.parentlinkticket )
        setSelectedProject(resp.data.project);
        setSelectedAssignee(resp.data.assignee_id);
        setSelectedCategory(resp.data.category);
        setSelectedStatus(resp.data.status_id);
        setSelectedPriority(resp.data.priority);
        setSelectedResolvedBy(resp.data.resolved_by);
        setSelectedReviewedBy(resp.data.reviewed_by);
        setSelectedTestedBy(resp.data.tested_by);
        let dueDate;
        if (resp?.data?.due_dt !== null) {
          dueDate = moment(resp.data.due_dt).format("YYYY-MM-DD");
        }
        setInitialValues({
          issueDetails: resp?.data?.issue_details
            ? resp.data.issue_details
            : "",
          issueSummary: resp?.data?.issue_summary
            ? resp.data.issue_summary
            : "",
          fixVersion: resp?.data?.fix_version_id ? resp.data.fix_version_id : "",
          storyPoints: resp?.data?.story_points ? resp.data.story_points : 0,
          dueDate: dueDate,
        });
        setLoading(false);
      }
    });
  };

  const handleAssigneeChange = (event) => {
    setSelectedAssignee(event.target.value);
    updateTicketDetails(event.target.value, "assignee");
  };
  const handleResolvedByChange = (event) => {
    setSelectedResolvedBy(event.target.value);
    updateTicketDetails(event.target.value, "resolvedBy");
  };
  const handleReviewedByChange = (event) => {
    setSelectedReviewedBy(event.target.value);
    updateTicketDetails(event.target.value, "reviewedBy");
  };
  const handleTestedByChange = (event) => {
    setSelectedTestedBy(event.target.value);
    updateTicketDetails(event.target.value, "testedBy");
  };
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    updateTicketDetails(event.target.value, "category");
  };
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    updateTicketDetails(event.target.value, "status");
  };
  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
    updateTicketDetails(event.target.value, "priority");
  };
  const onChangeFile = (event) => {
   setfileLoading(true);
    if (!event?.target?.files[0]) {
      return null;
    }
    let data = new FormData();
    data.append("file", event?.target?.files[0]);
    fileUpload(data).then((resp) => {
      if (resp?.status === false) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: resp.error,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
      } else {
        updateTicketDetails(resp.data, "files");
        setfileLoading(false);
      }
    });
  };
  useEffect(()=>{
    if(selectedProject){
      getFixVersionByProject({project_id:selectedProject.id}).then((data)=>{
        setFixverions(data?.data)
      })
    }
  },[selectedProject])

  const deleteLinkTicket=(index)=>{
    setLinkedeleteValue(true)
   linktickets?.splice(index,1)
    updateTicketDetails(
      linktickets,
      "linked_tickets"
    );
  }
  const promiseOptions = (inputValue) =>
  { 
    const queryParam = `?page=${page}&size=${rowsPerPage}&linkTicket=${inputValue}`;
    return allTickets(queryParam).then((response) => {
      
      return response.pagingData
  });
  }
  const handleChange1 = value => {
    setSelectedValue(value)
      value?.map((data)=>{
        if(linktickets === null){
          updateTicketDetails(
            [data?.id],  
            "linked_tickets"
            )
        }else{
          updateTicketDetails(
            [...linktickets,data?.id],  
            "linked_tickets"
            )
        }
      })
  }
  return (
    <>
      {!loading && (
        <div>
          <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: "50vh" }}>
            <HeaderTitle>
              <div>Ticket-{editData?.id}</div>
              <div onClick={onClickClose}>
                <Icon
                  sx={{
                    color: "#59B691",
                    fontSize: "35px !important",
                    cursor: "pointer",
                  }}
                >
                  cancelsharp
                </Icon>
              </div>
            </HeaderTitle>
            <Divider />
            <Formik onSubmit={updateTicket} initialValues={initialValues}>
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <FormContainer>
                    <ContentBox>
                      <Grid container spacing={3}>
                        <Grid item lg={8} md={8} sm={12} xs={12}>
                          <TextField
                            fullWidth
                            size="large"
                            required={true}
                            name="issueDetails"
                            type="text"
                            label="Issue Name"
                            variant="outlined"
                            onBlur={(e) => {
                              updateTicketDetails(
                                e.target.value,
                                "issueDetails"
                              );
                            }}
                            value={values.issueDetails}
                            onChange={handleChange}
                            sx={{ mb: 1.5 }}
                          />
                          <InputLabel>Issue Description</InputLabel>
                          <TextareaAutosize
                            fullWidth
                            size="large"
                            style={{
                              width: "100%",
                              outline: "none",
                              borderRadius: "5px",
                            }}
                            minRows={10}
                            required={true}
                            name="issueSummary"
                            type="textarea"
                            label="Issue Name"
                            placeholder="Issue Description"
                            variant="outlined"
                            onBlur={(e) => {
                              updateTicketDetails(
                                e.target.value,
                                "issueSummary"
                              );
                            }}
                            value={values.issueSummary}
                            onChange={handleChange}
                            sx={{ mb: 1.5 }}
                          />
                          <TextField
                            fullWidth
                            size="large"
                            name="files"
                            type="file"
                            variant="outlined"
                            onBlur={handleBlur}
                            onChange={onChangeFile}
                            sx={{ mb: 1.5 }}
                            value=""
                          />
                          <Card sx={{ px: 3, py: 2, mb: 3 }}>
                            <InputLabel>Attachments</InputLabel>
                            {fileLoading && (
                            <div style={{position: "fixed",backgroundColor: "#00000075",width: "100%",top: "0",left: "0",zIndex: "999",height: "100vh",
}}
>
                            <CircularProgress></CircularProgress>
                              </div>
                          )}
                            {editData.ticketFiles?.map((f, index) => {
                              return (
                                <Fragment>
                                  <div id={f.id}>
                                    <span>{f.upload.original_name}</span>
                                    <span
                                      onClick={(e) => {
                                        const obj = {
                                          uploadId: f.upload_id,
                                          keyName: f.upload.key,
                                        };
                                        deleteFile(obj).then((r) => {
                                          getTicketDetails(f.ticket_id);
                                        });
                                      }}
                                    >
                                      <Icon className="icon deleteIcon">
                                        delete
                                      </Icon>
                                    </span>
                                    <span
                                      onClick={(e) => {
                                        const obj = {
                                          keyName: f.upload.key,
                                        };
                                        downloadFile(obj).then((r) => {
                                          window.open(r.data, "_blank");
                                          getTicketDetails(f.ticket_id);
                                        });
                                      }}
                                    >
                                      <Icon className="icon deleteIcon">
                                        file_download
                                      </Icon>
                                    </span>
                                  </div>
                                </Fragment>
                              );
                            })}
                          </Card>
                          <Card sx={{ px: 3, py: 2, mb: 3 }}>
                            <LinkedHeadFlex>
                            <InputLabel>Linked Ticket</InputLabel>
                            </LinkedHeadFlex>
                            {linktickets?.map((data,index)=>{
                              return (<div className="close-icon">
                              <a href={`${host}/view-ticket/${data}`}>
                                {host}/view-ticket/{data}
                              </a>
                              <Icon className="icon" onClick={()=>deleteLinkTicket(index)}>close</Icon>
                            </div>)
                            })}
                            {parentticket?.length>0&&<div className="parentticket-list">
                             <InputLabel>Parent Ticket</InputLabel>
                             {parentticket?.map((data,index)=>{
                               return (
                                 <div className="close-icon">
                              <a href={`${host}/view-ticket/${data?.id}`}>
                                {host}/view-ticket/{data?.id}
                              </a>
                            </div>
                             )})}
                             </div>}
                            {fileLoading && (
                              <div
                                style={{
                                  position: "fixed",
                                  backgroundColor: "#00000075",
                                  width: "100%",
                                  top: "0",
                                  left: "0",
                                  zIndex: "999",
                                  height: "100vh",
                                }}
                              >
                                <CircularProgress></CircularProgress>
                              </div>
                            )}
                          </Card>
                          <Card sx={{ px: 3, py: 2, mb: 3 }}>
                            <CustomTabs ticketId={editData.id}></CustomTabs>
                          </Card>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <Card sx={{ px: 3, py: 2, mb: 3 }}>
                            <TextField
                              fullWidth
                              size="small"
                              disabled
                              readOnly
                              name="reporter"
                              type="text"
                              label="Reporter"
                              variant="outlined"
                              onBlur={handleBlur}
                              value={selectedReporter}
                              onChange={handleChange}
                              sx={{ mb: 1.5 }}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              disabled
                              readOnly
                              name="department"
                              type="text"
                              label="Department"
                              variant="outlined"
                              onBlur={handleBlur}
                              value={selectedDepartment}
                              onChange={handleChange}
                              sx={{ mb: 1.5 }}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              disabled
                              readOnly
                              name="project"
                              type="text"
                              label="Project"
                              variant="outlined"
                              onBlur={handleBlur}
                              value={selectedProject?.name}
                              onChange={handleChange}
                              sx={{ mb: 1.5 }}
                            />
                            <FormControl fullWidth size="small">
                              <InputLabel required={true} id="assignee">
                                Assignee
                              </InputLabel>
                              <Select
                                labelId="assignee"
                                id="assignee"
                                required={true}
                                value={selectedAssignee}
                                label="Assignee"
                                className="isactiveDivStyle"
                                onChange={handleAssigneeChange}
                                defaultValue={selectedAssignee}
                              >
                                {assignees?.map((d, i) => {
                                  return (
                                    <MenuItem key={i} value={d.id} className="isactive-error">
                                      {d.first_name} {d.last_name} {!d.is_active ? <ISactiveError />: ""}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <FormControl
                              fullWidth
                              size="small"
                              className="mt-2"
                            >
                              <InputLabel id="category">Category</InputLabel>
                              <Select
                                labelId="category"
                                id="category"
                                value={selectedCategory}
                                label="Category"
                                onChange={handleCategoryChange}
                                defaultValue={selectedCategory}
                              >
                                {category?.map((d) => {
                                  return (
                                    <MenuItem key={d} value={d}>
                                      {d}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <FormControl
                              fullWidth
                              size="small"
                              className="mt-2"
                            >
                              <InputLabel id="status">Status</InputLabel>
                              <Select
                                labelId="status"
                                id="status"
                                value={selectedStatus}
                                label="Status"
                                className="isactiveDivStyle"
                                onChange={handleStatusChange}
                                defaultValue={selectedStatus}
                              >
                                {status?.map((d, i) => {
                                  return (
                                    <MenuItem key={i} value={d.id} className="isactive-error">
                                      {d.name} {!d.is_active ? <ISactiveError />: ""}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <FormControl
                              fullWidth
                              size="small"
                              className="mt-2"
                            >
                              <InputLabel id="priority">Priority</InputLabel>
                              <Select
                                labelId="priority"
                                id="priority"
                                value={selectedPriority}
                                label="Priority"
                                onChange={handlePriorityChange}
                                defaultValue={selectedPriority}
                              >
                                {priority?.map((d) => {
                                  return (
                                    <MenuItem key={d} value={d}>
                                      {d}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <FormControl   fullWidth
                              size="small"
                              className="mt-2">
                    <InputLabel required={true} id="fixVersion">
                          fixVersion
                        </InputLabel>
                      <Select
                        fullWidth
                        size="large"
                        name="fixVersion"
                        type="text"
                        label="Fix Version"
                        variant="outlined"
                        value={values.fixVersion}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                        className="isactiveDivStyle"
                        onBlur={(e) => {
                          updateTicketDetails(
                            e.target.value,
                            "fixVersion"
                          );
                        }}
                      >
                        {fixverions?.map((d, i) => {
                            return (
                              <MenuItem key={i} value={d.id} className="isactive-error">
                                {d.fix_version} {!d.is_active ? <ISactiveError />: ""}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                      <AsyncSelect
                                isMulti
                                loadOptions={promiseOptions}
                                placeholder="Link tickets"
                                onChange={handleChange1}
                                cacheOptions
                                value={selectedValue}
                                getOptionLabel={e => `${e.issue_details}`}
                                getOptionValue={e => `${e.id}`}
                                className="async-select-class"
                                />
                      </FormControl>
                            <TextField
                              fullWidth
                              size="small"
                              className="mt-2"
                              name="dueDate"
                              type="date"
                              label="Due Date"
                              variant="outlined"
                              onBlur={(e) => {
                                updateTicketDetails(e.target.value, "dueDate");
                              }}
                              defaultValue={values.dueDate}
                              value={values.dueDate  || '' }
                              onChange={handleChange}
                              sx={{ mb: 1.5 }}
                              InputLabelProps={{ shrink: true }}                         />
                            <TextField
                              fullWidth
                              size="small"
                              className="mt-2"
                              name="storyPoints"
                              type="number"
                              label="Story Points"
                              variant="outlined"
                              onBlur={(e) => {
                                updateTicketDetails(
                                  e.target.value,
                                  "storyPoints"
                                );
                              }}
                              value={values.storyPoints}
                              onChange={handleChange}
                              sx={{ mb: 1.5 }}
                            />
                            <FormControl
                              fullWidth
                              size="small"
                              className="mt-2"
                            >
                              <InputLabel id="resolvedBy">
                                Resolved By
                              </InputLabel>
                              <Select
                                labelId="resolvedBy"
                                id="resolvedBy"
                                value={selectedResolvedBy}
                                label="Resolved By"
                                onChange={handleResolvedByChange}
                                defaultValue={selectedResolvedBy}
                                className="isactiveDivStyle"
                              >
                                {assignees?.map((d, i) => {
                                  return (
                                    <MenuItem key={i} value={d.id} className="isactive-error">
                                      {d.first_name} {d.last_name} {!d.is_active ? <ISactiveError />: ""}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <FormControl
                              fullWidth
                              size="small"
                              className="mt-2"
                            >
                              <InputLabel id="reviewedBy">
                                Reviewed By
                              </InputLabel>
                              <Select
                                labelId="reviewedBy"
                                id="reviewedBy"
                                value={selectedReviewedBy}
                                label="Reviewed By"
                                onChange={handleReviewedByChange}
                                defaultValue={selectedReviewedBy}
                                className="isactiveDivStyle"
                              >
                                {assignees?.map((d, i) => {
                                  return (
                                    <MenuItem key={i} value={d.id} className="isactive-error">
                                      {d.first_name} {d.last_name} {!d.is_active ? <ISactiveError />: ""}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <FormControl
                              fullWidth
                              size="small"
                              className="mt-2"
                            >
                              <InputLabel id="testedBy">Tested By</InputLabel>
                              <Select
                                labelId="testedBy"
                                id="testedBy"
                                value={selectedTestedBy}
                                label="Tested By"
                                onChange={handleTestedByChange}
                                defaultValue={selectedTestedBy}
                                className="isactiveDivStyle"
                              >
                                {assignees?.map((d, i) => {
                                  return (
                                    <MenuItem key={i} value={d.id} className="isactive-error">
                                      {d.first_name} {d.last_name} {!d.is_active ? <ISactiveError />: ""}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <InputLabel id="createdAT" className="mt-2">
                              Created Date:{" "}
                              {moment(editData.createdAt).format(
                                "DD-MM-YYYY HH:mm"
                              )}
                            </InputLabel>
                            <InputLabel id="updatedAT">
                              Modified Date:{" "}
                              {moment(editData.updatedAt).format(
                                "DD-MM-YYYY HH:mm"
                              )}
                            </InputLabel>
                          </Card>
                        </Grid>
                      </Grid>
                    </ContentBox>
                  </FormContainer>
                </form>
              )}
            </Formik>
          </Card>
        </div>
      )}
    </>
  );
};

export default ViewTicket;
