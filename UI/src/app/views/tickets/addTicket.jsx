import React, { Fragment, useEffect } from "react";
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
import { LoadingButton } from "@mui/lab";
import * as Yup from 'yup';
import { Strings } from "config/strings";
import { authRoles } from "app/auth/authRoles";
import { getMasterDropdownData,getStatusByDepartment } from "app/services/adminService";
import {
  createTicket,
  deleteFile,
  fileUpload,
} from "app/services/ticketService";
import CircularProgress from "../../components/MatxLoading";
import {getStatusByDepId} from "../../utils/utils";

const CreateTicket = ({ onClose }) => {
  const [valid, setValid] = React.useState(false);
  const handleClose = (event) => !!onClose && onClose(event) && setValid(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState();
  const [selectedProject, setSelectedProject] = React.useState();
  const [selectedAssignee, setSelectedAssignee] = React.useState();
  const [selectedCategory, setSelectedCategory] = React.useState();
  const [selectedStatus, setSelectedStatus] = React.useState();
  const [selectedPriority, setSelectedPriority] = React.useState();
  const [departments, setDepartments] = React.useState();
  const [projects, setProjects] = React.useState([]);
  const [assignees, setAssignee] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [status, setStatus] = React.useState([]);
  const [priority, setPriority] = React.useState([]);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [fileLoading, setfileLoading] = React.useState(false);
  const navigate = useNavigate();

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
  const MyErrorMessage = styled.div`
    color: red;
    font-size: 13px;
  `;

  const validationSchema = Yup.object().shape({
    storyPoints: Yup.number()
      .max(20, 'Story Points can not be more than 20 numbers long'),
  });
 
  const onSubmit = (values) => {
    const reqBody = {
      departmentId: selectedDepartment,
      projectId: selectedProject,
      assigneeId: selectedAssignee,
      category: selectedCategory,
      statusId: selectedStatus,
      priority: selectedPriority,
      fixVersion: values.fixVersion,
      issueDetails: values.issueDetails,
      issueSummary: values.issueSummary,
      dueDate: values.dueDate,
      storyPoints: values.storyPoints,
      files: selectedFiles,
    };


    
    createTicket(reqBody).then((resp) => {
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
        Swal.fire({
          icon: "success",
          title: "Success",
          text: Strings.CREATED_SUCCESSFULLY,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
        return navigate("/my-reported-tickets");
      }
    });
  };
  const initialValues = {};
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
        //setPriorityOption(resp?.data?.ticketPriorites);
        setDepartments(resp?.data?.departments);
        setProjects(resp?.data?.currentUserProjects);
        setAssignee(resp?.data?.agents);
        // setStatus(resp?.data?.activeStatus);
        setPriority(resp?.data?.ticketPriorites);
      }
    });
  }, []);

  const handleDepartmentChange = async (event) => {
    setSelectedDepartment(event.target.value);
    await getStatusByDepId(event.target.value);

  };
  const getStatusByDepId = async (departmentId) => {
    await getStatusByDepartment({ departmentId }).then(async(response) => {
      setStatus(response.data);
    })
  }
  
  
  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };
  const handleAssigneeChange = (event) => {
    setSelectedAssignee(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };
  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
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
        setSelectedFiles([...selectedFiles, resp.data]);
        setfileLoading(false);
      }
    });
  };

  return (
    <>
      <div>
        <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: "50vh" }}>
          <HeaderTitle>
            <div>Create Ticket</div>
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
          <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema}>
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
                  <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="department">
                          Department
                        </InputLabel>
                        <Select
                          labelId="department"
                          id="department"
                          required={true}
                          value={selectedDepartment}
                          label="Department"
                          onChange={handleDepartmentChange}
                          defaultValue={selectedDepartment}
                        >
                          {departments?.filter(department=>department.is_active)?.map((d, i) => {
                            return (
                              <MenuItem key={i} value={d.id}>
                                {d.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="project">
                          Project
                        </InputLabel>
                        <Select
                          labelId="project"
                          id="project"
                          required={true}
                          value={selectedProject}
                          label="Project"
                          onChange={handleProjectChange}
                          defaultValue={selectedProject}
                        >
                          {projects?.map((d, i) => {
                            return (
                              <MenuItem key={i} value={d.id}>
                                {d.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="assignee">
                          Assignee
                        </InputLabel>
                        <Select
                          labelId="assignee"
                          id="assignee"
                          required={true}
                          value={selectedAssignee}
                          label="Assignee"
                          onChange={handleAssigneeChange}
                          defaultValue={selectedAssignee}
                        >
                          {assignees?.filter(assignee=>assignee.is_active)?.map((d, i) => {
                            return (
                              <MenuItem key={i} value={d.id}>
                                {d.first_name} {d.last_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="category">
                          Category
                        </InputLabel>
                        <Select
                          labelId="category"
                          id="category"
                          required={true}
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
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="status">
                          Status
                        </InputLabel>
                        <Select
                          labelId="status"
                          id="status"
                          required={true}
                          value={selectedStatus}
                          label="Status"
                          onChange={handleStatusChange}
                          defaultValue={selectedStatus}
                        >
                          {status?.map((d, i) => {
                            return (
                              <MenuItem key={i} value={d.id}>
                                {d.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="priority">
                          Priority
                        </InputLabel>
                        <Select
                          labelId="priority"
                          id="priority"
                          required={true}
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
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        name="fixVersion"
                        type="text"
                        label="Fix Version"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.fixVersion}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        name="dueDate"
                        type="datetime-local"
                        label="Due Date"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.dueDate}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
  
                        InputLabelProps={{
                          shrink: true,
                      }}
                        inputProps={{
                          min: new Date().toISOString().slice(0, 16),
                        }}
                       
                      />
                      
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        name="storyPoints"
                        type="number"
                        label="Story Points"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.storyPoints}
                        inputProps={{ min: 1 }}
                        onChange={handleChange}
                        error={Boolean(errors.storyPoints && touched.storyPoints)} 
                        helperText={touched.storyPoints && errors.storyPoints}
                        sx={{ mb: 1.5 }}
                        InputLabelProps={{
                          shrink: true,
                      }}
                      />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        required={true}
                        name="issueDetails"
                        type="text"
                        label="Issue Summary"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.issueDetails}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                      />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
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
                        label="Issue Summary"
                        placeholder="Issue Description"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.issueSummary}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                      />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
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
                      <br></br>
                      {fileLoading && <CircularProgress></CircularProgress>}
                      {selectedFiles.map((f, index) => {
                        return (
                          <Fragment>
                            <div id={f.id}>
                              <span>{f.original_name}</span>
                              <span
                                onClick={(e) => {
                                  const obj = {
                                    uploadId: f.id,
                                    keyName: f.key,
                                  };
                                  deleteFile(obj).then((r) => {
                                    let files = selectedFiles.filter(
                                      (_, i) => i !== index
                                    );
                                    setSelectedFiles(files);
                                  });
                                }}
                              >
                                <Icon className="icon deleteIcon">delete</Icon>
                              </span>
                            </div>
                          </Fragment>
                        );
                      })}
                    </Grid>
                    {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                                            {
                                                selectedFiles.map((f) => {
                                                    return (
                                                        <div id={f.id}>
                                                            <span>{f.original_name}</span>
                                                            <span onClick={deleteFile(f)}><Icon className="icon deleteIcon">delete</Icon></span>
                                                        </div>
                                                    )

                                                })
                                            }
                                        </Grid> */}
                  </Grid>
                </FormContainer>
                <div className="d-flex justify-content-end">
                  <LoadingButton
                    type="submit"
                    color="secondary"
                    variant="contained"
                    sx={{
                      my: 2,
                      top: "60",
                      marginRight: "10px",
                      marginTop: "5vh",
                    }}
                  >
                    Submit
                  </LoadingButton>
                </div>
              </form>
            )}
          </Formik>
        </Card>
      </div>
    </>
  );
};

export default CreateTicket;
