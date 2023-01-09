import React from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import moment from 'moment'
import { Formik } from 'formik';
import './escalationList.css'
import { Card, Checkbox, Divider, FormControl, FormControlLabel, Grid, Icon, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import { Strings } from 'config/strings'
import { createEscalationMatrix, getMasterDropdownData } from 'app/services/adminService';
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

const AddEditEscalation = ({ onClose, editDetails }) => {
  const [valid, setValid] = React.useState(false)
  const [isActive, setIsActive] = React.useState(editDetails?.is_active ? editDetails.is_active : true);
  const [departments, setDepartments] = React.useState();
  const [selectedDepartment, setSelectedDepartment] = React.useState();
  const [agents, setAgents] = React.useState();
  const [selectedL1, setSelectedL1] = React.useState();
  const [selectedL2, setSelectedL2] = React.useState();
  const [selectedL3, setSelectedL3] = React.useState();
  const [selectedL4, setSelectedL4] = React.useState();
  const [selectedL5, setSelectedL5] = React.useState();
  const [selectedL6, setSelectedL6] = React.useState();
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
        setAgents(resp?.data?.agents);
        setSelectedDepartment(editDetails?.department_id);
        setSelectedL1(editDetails?.l1_id);
        setSelectedL2(editDetails?.l2_id);
        setSelectedL3(editDetails?.l3_id);
        setSelectedL4(editDetails?.l4_id);
        setSelectedL5(editDetails?.l5_id);
        setSelectedL6(editDetails?.l6_id);
      }
    })
  }, [])

  const handleClearClick = () => {
    setSelectedL2();
  };

  const handleClearClickforL3=()=>{
    setSelectedL3();
  }

 const handleClearClickforL4=()=>{
  setSelectedL4();
 }

 const handleClearClickForL5=()=>{
  setSelectedL5();
 }

 const handleClearClickForL6=()=>{
  setSelectedL6();
 }

  const onSubmit = (values) => {
    const reqBody = {
      departmentId: selectedDepartment,
      l1Id: selectedL1,
      l2Id: selectedL2,
      l3Id: selectedL3,
      l4Id: selectedL4,
      l5Id: selectedL5,
      l6Id: selectedL6,
      is_active: isActive
    };
    if (editDetails?.id) {
      reqBody.id = editDetails.id
    } else if (!selectedDepartment) {
      return Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: Strings.DEPARTMENT_NAME_MANDATORY,
        showCloseButton: true,
        showConfirmButton: false,
        width: 400,
      })
    }
    createEscalationMatrix(reqBody).then((resp) => {
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
            return navigate('/escalations');
        }

    })
  }
  const initialValues = {
    departmentId: editDetails?.departmentId ? editDetails.departmentId : '',
    l1Id: editDetails?.l1_id ? editDetails.l1_id : '',
    l2Id: editDetails?.l2Id ? editDetails.l2Id : '',
    l3Id: editDetails?.l3Id ? editDetails.l3Id : '',
    l4Id: editDetails?.l4Id ? editDetails.l4Id : '',
    l5Id: editDetails?.l5Id ? editDetails.l5Id : '',
    l6Id: editDetails?.l6Id ? editDetails.l6Id : ''
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
  const handleL1Change = (event) => {
    setSelectedL1(event.target.value);
  }
  const handleL2Change = (event) => {
    setSelectedL2(event.target.value);
  }
  const handleL3Change = (event) => {
    setSelectedL3(event.target.value);
  }
  const handleL4Change = (event) => {
    setSelectedL4(event.target.value);
  }
  const handleL5Change = (event) => {
    setSelectedL5(event.target.value);
  }
  const handleL6Change = (event) => {
    setSelectedL6(event.target.value);
  }
  return (
    <>
      <div>
        <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: '50vh' }}>
          <HeaderTitle>
            <div>
              {editDetails?.id ? 'Edit Escalation' : 'Add Escalation'}
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
          <Formik onSubmit={onSubmit} initialValues={initialValues}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <FormContainer>
                  <Grid container spacing={2}>
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
                             departments?.filter(department=>department.is_active)?.map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="l1User">Level-1</InputLabel>
                        <Select
                          labelId="l1User"
                          id="l1User"
                          required={true}
                          value={selectedL1}
                          label="Level-1"
                          onChange={handleL1Change}
                          defaultValue={selectedL1}
                        >
                          {
                            agents?.filter(data=>data.is_active).map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="l2User">Level-2</InputLabel>
                        <Select
                          labelId="l2User"
                          id="l2User"
                          value={selectedL2}
                          label="Level-2"
                          onChange={handleL2Change}
                          defaultValue={selectedL2}
                          sx={{"& .MuiSelect-iconOutlined": {display: selectedL2? 'none': ''}, "&.Mui-focused .MuiIconButton-root": {color: 'primary.main'}}}
                          endAdornment={<IconButton sx={{display: selectedL2? "": "none"}} onClick={handleClearClick}><ClearIcon/></IconButton>}
                        >
                          {
                            agents?.filter(data=>data.is_active).map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="l3User">Level-3</InputLabel>
                        <Select
                          labelId="l3User"
                          id="l3User"
                          value={selectedL3}
                          label="Level-3"
                          onChange={handleL3Change}
                          defaultValue={selectedL3}
                          sx={{"& .MuiSelect-iconOutlined": {display: selectedL3? 'none': ''}, "&.Mui-focused .MuiIconButton-root": {color: 'primary.main'}}}
                          endAdornment={<IconButton sx={{display: selectedL3? "": "none"}} onClick={handleClearClickforL3}><ClearIcon/></IconButton>}
                        >
                          {
                            agents?.filter(data=>data.is_active).map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="l4User">Level-4</InputLabel>
                        <Select
                          labelId="l4User"
                          id="l4User"
                          value={selectedL4}
                          label="Level-4"
                          onChange={handleL4Change}
                          defaultValue={selectedL4}
                          sx={{"& .MuiSelect-iconOutlined": {display: selectedL4? 'none': ''}, "&.Mui-focused .MuiIconButton-root": {color: 'primary.main'}}}
                          endAdornment={<IconButton sx={{display: selectedL4? "": "none"}} onClick={handleClearClickforL4}><ClearIcon/></IconButton>}
                        >
                          {
                            agents?.filter(data=>data.is_active).map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="l5User">Level-5</InputLabel>
                        <Select
                          labelId="l5User"
                          id="l5User"
                          value={selectedL5}
                          label="Level-5"
                          onChange={handleL5Change}
                          defaultValue={selectedL5}
                          sx={{"& .MuiSelect-iconOutlined": {display: selectedL5? 'none': ''}, "&.Mui-focused .MuiIconButton-root": {color: 'primary.main'}}}
                          endAdornment={<IconButton sx={{display: selectedL5? "": "none"}} onClick={handleClearClickForL5}><ClearIcon/></IconButton>}
                        >
                          {
                            agents?.filter(data=>data.is_active).map((d, i) => {
                              return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="l6User">Level-6</InputLabel>
                        <Select
                          labelId="l6User"
                          id="l6User"
                          value={selectedL6}
                          label="Level-6"
                          onChange={handleL6Change}
                          defaultValue={selectedL6}
                          sx={{"& .MuiSelect-iconOutlined": {display: selectedL6? 'none': ''}, "&.Mui-focused .MuiIconButton-root": {color: 'primary.main'}}}
                          endAdornment={<IconButton sx={{display: selectedL6? "": "none"}} onClick={handleClearClickForL6}><ClearIcon/></IconButton>}
                        >
                          {
                            agents?.filter(data=>data.is_active).map((d, i) => {
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

export default AddEditEscalation
