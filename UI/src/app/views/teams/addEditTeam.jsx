import React from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import moment from 'moment'
import { Formik } from 'formik';
import './teamList.css'
import { Card, Checkbox, Divider, FormControl, FormControlLabel, Grid, Icon, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import { Strings } from 'config/strings'
import { createTeam, getMasterDropdownData } from 'app/services/adminService';
import * as Yup from 'yup';

const AddEditTeam = ({ onClose, editDetails }) => {
  const [valid, setValid] = React.useState(false)
  const [isActive, setIsActive] = React.useState(editDetails?.is_active ? editDetails.is_active : true);
  const [teamName, setTeamName] = React.useState();
  const [selectedDepartment, setSelectedDepartment] = React.useState();
  const [selectedProject, setSelectedProject] = React.useState();
  const [selectedAgents, setSelectedAgents] = React.useState([]);
  const [selectedLeads, setSelectedLeads] = React.useState([]);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState();
  const [projects, setProjects] = React.useState();
  const [users, setUsers] = React.useState();
  const [agents, setAgents] = React.useState();
  const handleClose = (event) => !!onClose && onClose(event) && setValid(false)
  const navigate = useNavigate();

  const HeaderTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    font-size: 1.5rem;
`
  const FormContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props) => (props.divide ? '50% 48.4%' : '100%')};
    padding: 1rem 1rem 0 1rem;
    gap: 1rem;
`
  const MyErrorMessage = styled.div`
    color: red;
    font-size: 13px;
`

  React.useEffect(() => {
    if (editDetails) {
      {
        setIsActive(editDetails?.is_active);
      }
    }
    getMasterDropdownData().then((resp) => {
      if (resp?.status === false) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: resp.error,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        })
      } else {
        setDepartments(resp?.data?.departments);
        setProjects(resp?.data?.projects);
        setUsers(resp?.data?.users);
        setAgents(resp?.data?.agents);
        setSelectedDepartment(editDetails?.department_id);
        setSelectedProject(editDetails?.project_id);
        setSelectedAgents(editDetails?.agents?editDetails.agents:[]);
        setSelectedUsers(editDetails?.users?editDetails.users:[]);
        setSelectedLeads(editDetails?.leads?editDetails.leads:[]);
      }
    })
  }, [])

  const onSubmit = (values) => {
    const reqBody = {
      teamName: values.teamName,
      departmentId: selectedDepartment,
      projectId: selectedProject,
      users: selectedUsers,
      leads: selectedLeads,
      active: isActive,
      agents: selectedAgents
    };
    if (editDetails?.id) {
      reqBody.id = editDetails.id
    }
    createTeam(reqBody).then((resp) => {
        if (resp?.status === false) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: resp.error,
                showCloseButton: true,
                showConfirmButton: false,
                width: 400,
            })
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: editDetails?.id ? Strings.UPDATED_SUCCESSFULLY : Strings.CREATED_SUCCESSFULLY,
                showCloseButton: true,
                showConfirmButton: false,
                width: 400,
            })
            return navigate('/teams');
        }

    })
  }
  const initialValues = {
    teamName: editDetails?.name? editDetails.name:''
  }
  const handleCheckBoxChange = (event) => {
    if (event?.target.checked) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  }
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  }
  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  }
  const handleUserChange= (event)=>{
    const {target: { value },} = event;
    setSelectedUsers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }
  const handleLeadChange= (event)=>{
    const {target: { value },} = event;
    setSelectedLeads(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }
  const handleAgentsChange= (event)=>{
    const {target: { value },} = event;
      setSelectedAgents(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
  }

  const validationSchema = Yup.object().shape({
    teamName: Yup.string()
      .max(12, 'Team Name can not be more than 12 characters long'),
  });

  return (
    <>
      <div>
        <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: '50vh' }}>
          <HeaderTitle>
            <div>
              {editDetails?.id ? 'Edit Team' : 'Add Team'}
            </div>
            <div onClick={handleClose}>
              <Icon
                sx={{
                  color: '#59B691',
                  fontSize: '35px !important',
                  cursor: 'pointer',
                }}
              >
                cancelsharp
              </Icon>
            </div>
          </HeaderTitle>
          <Divider />
          <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <FormContainer>
                  <Grid container spacing={2}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField fullWidth size="large" required={true} name="teamName" type="text" label="Team Name"
                        variant="outlined" onBlur={handleBlur} value={values.teamName}
                        onChange={handleChange} sx={{ mb: 1.5 }} error={Boolean(errors.teamName && touched.teamName)}  helperText={touched.teamName && errors.teamName} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="department">Department</InputLabel>
                        <Select
                          labelId="department"
                          id="department"
                          required={true}
                          value={selectedDepartment}
                          label="Department"
                          onChange={handleDepartmentChange}
                          defaultValue={selectedDepartment}
                        >
                          {
                            departments?.map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="project">Project</InputLabel>
                        <Select
                          labelId="project"
                          id="project"
                          required={true}
                          value={selectedProject}
                          label="Project"
                          onChange={handleProjectChange}
                          defaultValue={selectedProject}
                        >
                          {
                            projects?.map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="user">Users</InputLabel>
                        <Select
                          labelId="user"
                          id="user"
                          multiple
                          value={selectedUsers}
                          label="Users"
                          onChange={handleUserChange}
                          defaultValue={selectedUsers}
                        >
                          {
                            users?.map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="leadId">Team Lead</InputLabel>
                        <Select
                          labelId="teamLead"
                          id="teamLead"
                          required={true}
                          multiple
                          value={selectedLeads}
                          label="Team Lead"
                          onChange={handleLeadChange}
                          defaultValue={selectedLeads}
                        >
                          {
                            agents?.map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="agent">Agents</InputLabel>
                        <Select
                          labelId="agents"
                          id="agents"
                          multiple
                          required={true}
                          value={selectedAgents}
                          label="Agents"
                          onChange={handleAgentsChange}
                          defaultValue={selectedAgents}
                        >
                          {
                            agents?.map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControlLabel control={<Checkbox />}
                        disabled={!editDetails?.id}
                        checked={!isActive}
                        onChange={handleCheckBoxChange}
                        label="Inactive"
                      />
                    </Grid>
                  </Grid>
                </FormContainer>
                <div className='d-flex justify-content-end'>
                  <LoadingButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{ my: 2, top: "50", marginRight: "10px", marginTop: "15vh" }}
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
  )
}

export default AddEditTeam
