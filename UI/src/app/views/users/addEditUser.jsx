import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import moment from 'moment'
import { Formik } from 'formik';
import './userList.css'
import { Card, Checkbox, Divider, FormControl, FormControlLabel, Grid, Icon, InputLabel, MenuItem, Select, TextField }
  from '@mui/material'
import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import { Strings } from 'config/strings'
import { authRoles } from 'app/auth/authRoles';
import { createUpdateUser } from 'app/services/userService';
import { getMasterDropdownData } from 'app/services/adminService';
import * as Yup from 'yup';

const AddEditUser = ({ onClose, editDetails }) => {
  const [valid, setValid] = React.useState(false)
  const [isActive, setIsActive] = React.useState(editDetails?.is_active ? editDetails.is_active : true);
  const [role, setSelectedRole] = React.useState(authRoles.user);
  const [masterDropdownData,setMasterDropdownData]= React.useState();
const [departments,setDepartments]= React.useState();
const [selectedDepartment, setSelectedDepartment]= React.useState();
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
const ISactiveError = styled.div`
  width:15px;
  height:15px;
  border:5px solid red;
  background-color:red;
  color:white;
  border-radius:50%;
  text-align:center;
`
let phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
const validationSchema = Yup.object().shape({
  designation: Yup.string()
    .max(20, 'Designation can not be more than 20 characters long'),

    firstName: Yup.string()
    .required("required")
    .max(20,"First-name can not be more than 20 characters long" ),

    lastName: Yup.string()
    .required("required")
    .max(20,"Last-name can not be more than 20 characters long" ),

  });

  React.useEffect(() => {
    if (editDetails) {
      {
        setIsActive(editDetails?.is_active);
        if(editDetails?.role==='admin'){
            setSelectedRole(authRoles.admin);
        }else if(editDetails?.role==='teamLead'){
            setSelectedRole(authRoles.teamLead);
        }else if(editDetails?.role==='agent'){
            setSelectedRole(authRoles.agent);
        }else if(editDetails?.role==='user'){
            setSelectedRole(authRoles.user);
        }
      }
    }
  }, [])

  const onSubmit = (values) => {
    const reqBody = {
      email: values.email,
      active: isActive,
      firstName: values.firstName,
      lastName: values.lastName,
      role: role.toString(),
      designation: values.designation,
      mobile: values.mobile,
      departmentId: selectedDepartment
    };
    if (editDetails?.id) {
    reqBody.id = editDetails.id
    }
    createUpdateUser(reqBody).then((resp) => {
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
    setTimeout(()=>{
      return window.location.href='/users';
    },2000)
    }
    })
  }
  const initialValues = {
    firstName: editDetails?.first_name ? editDetails.first_name : '',
    lastName: editDetails?.last_name ? editDetails.last_name : '',
    email: editDetails?.email ? editDetails.email : '',
    designation: editDetails?.designation ? editDetails.designation : '',
    mobile: editDetails?.mobile ? editDetails.mobile : '',
    role: editDetails?.role ? editDetails.role : '',
    departmentId: editDetails?.department_id? editDetails.department_id:'',
  }
  const onChangeRole=(event)=>{
    setSelectedRole(event.target.value);
  }
  const handleCheckBoxChange = (event) => {
    if (event?.target.checked) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  }
  useEffect(() => {
    getMasterDropdownData().then((resp)=>{
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
          setMasterDropdownData(resp.data);
          setSelectedDepartment(editDetails?.department_id);
      }
    })
  }, [])
  
  const handleDepartmentChange=(event)=>{
    setSelectedDepartment(event.target.value);
  }
  return (
    <>
      <div>
        <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: '50vh' }}>
          <HeaderTitle>
            <div>
              {editDetails?.id ? 'Edit User' : 'Add User'}
            </div>
            <div onClick={handleClose}>
              <Icon sx={{
                color: '#59B691',
                fontSize: '35px !important',
                cursor: 'pointer',
              }}>
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
                      <TextField fullWidth size="large" required={true} name="firstName" type="text" label="First Name"
                        variant="outlined" onBlur={handleBlur} value={values.firstName}
                        error={Boolean(errors.firstName && touched.firstName)} 
                        helperText={touched.firstName && errors.firstName}
                        onChange={handleChange} sx={{ mb: 1.5 }} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField fullWidth size="large" name="lastName" required={true} type="text" label="Last Name"
                        variant="outlined" onBlur={handleBlur} value={values.lastName}
                        error={Boolean(errors.lastName && touched.lastName)} 
                        helperText={touched.lastName && errors.lastName}
                        onChange={handleChange} sx={{ mb: 1.5 }} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField fullWidth size="large" name="email" required={true} type="email" label="Email"
                        disabled={editDetails?.id ? true : false} variant="outlined" onBlur={handleBlur}
                        value={values.email} onChange={handleChange} sx={{ mb: 1.5 }} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField fullWidth size="large" name="mobile" type="text" label="Mobile"
                        variant="outlined" onBlur={handleBlur} value={values.mobile} onChange={handleChange}
                        helperText={touched.mobile && errors.mobile}
                        sx={{ mb: 1.5 }} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField fullWidth size="large" name="designation" required={true} type="text" label="Designation"
                        variant="outlined" onBlur={handleBlur} value={values.designation}
                        onChange={handleChange}
                        error={Boolean(errors.designation && touched.designation)} 
                        helperText={touched.designation && errors.designation}
                        sx={{ mb: 1.5 }} />

                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel required={true} id="role">Role</InputLabel>
                        <Select
                          labelId="role"
                          id="role"
                          value={role}
                          label="Role"
                          required={true}
                          onChange={onChangeRole}
                          defaultValue={values.role}
                        >
                          <MenuItem value={authRoles.admin}>Admin</MenuItem>
                          <MenuItem value={authRoles.teamLead}>Team Lead</MenuItem>
                          <MenuItem value={authRoles.agent}>Agent</MenuItem>
                          <MenuItem value={authRoles.user}>User</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel  required={true} id="role">Department</InputLabel>
                        <Select
                          labelId="department"
                          id="department"
                          required={true}
                          value={selectedDepartment}
                          label="Department"
                          onChange={handleDepartmentChange}
                          defaultValue={selectedDepartment}
                          className="isactiveDivStyle"
                        >
							{
								 departments?.filter(department=>department.is_active || department.id === selectedDepartment)?.map((d, i) =>{
									return <MenuItem key={i} value={d.id} className="isactive-error">{d.name} {d.is_active === false ? <ISactiveError />: ""}</MenuItem>
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
                  <LoadingButton type="submit" color="primary" variant="contained"
                    sx={{ my: 2, top: "60", marginRight: "10px", marginTop: "25vh" }}>
                    Update
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

export default AddEditUser