import React from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import moment from 'moment'
import { Formik } from 'formik';
import { Card, Checkbox, Divider, FormControl, FormControlLabel, Icon, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import { Strings } from 'config/strings'
import { createStatus, getMasterDropdownData } from 'app/services/adminService';
import "./statusList.css";

const AddEditStatus = ({ onClose, editDetails }) => {
    const [valid, setValid] = React.useState(false)
    const [isActive, setIsActive] = React.useState(editDetails?.is_active ? editDetails.is_active : true);
    const [statusTypes, setStatusType] = React.useState([]);
    const [departmentvalue, setDepartmentValue] = React.useState([]);
    const [selectedStatusType, setSelectedStatusType] = React.useState();
    const [department, setDepartment] = React.useState();
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
                setSelectedStatusType(editDetails?.status_type);
            
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
                setStatusType(resp?.data?.statusTypes)
                setDepartmentValue(resp?.data?.departments)
            }
        })
    }, [])

    const onSubmit = (values) => {
        const reqBody = {
            statusName: values.statusName,
            statusType: selectedStatusType,
            // department: department,
            is_active: isActive
        };
        if (editDetails?.id) {
            reqBody.id = editDetails.id
        } else if (!values.statusName) {
            return Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: Strings.STATUS_NAME_MANDATORY,
                showCloseButton: true,
                showConfirmButton: false,
                width: 400,
            })
        }
        createStatus(reqBody).then((resp) => {
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
                return navigate('/status');
            }

        })
    }
    const initialValues = {
        statusName: editDetails?.name ? editDetails.name : ''
    }
    const handleCheckBoxChange = (event) => {
        if (event?.target.checked) {
            setIsActive(false);
        } else {
            setIsActive(true);
        }
    }
    const handleStatusType = (event) => {
        setSelectedStatusType(event.target.value);
    }
    const handleDepartment = (event) => {
        setDepartment(event.target.value);
    }
    return (
        <>
            <div>
                <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: '50vh' }}>
                    <HeaderTitle>
                        <div>
                            {editDetails?.id ? 'Edit Status' : 'Add Status'}
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
                    <Formik
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <FormContainer divide={true}>
                                    <div>
                                        <TextField
                                            fullWidth
                                            size="large"
                                            name="statusName"
                                            type="text"
                                            label="Status Name"
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={values.statusName}
                                            onChange={handleChange}
                                            sx={{ mb: 1.5 }}
                                        />
                                        <br />

                                    </div>
                                    <div>
                                        <FormControl fullWidth>
                                            <InputLabel required={true} id="statusTypes">Status Type</InputLabel>
                                            <Select
                                                labelId="statusTypes"
                                                id="statusTypes"
                                                required={true}
                                                value={selectedStatusType}
                                                label="statusTypes"
                                                onChange={handleStatusType}
                                                defaultValue={selectedStatusType}
                                            >
                                                {
                                                    statusTypes?.map((d, i) => {
                                                        return <MenuItem key={i} value={d}>{d}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl fullWidth>
                                            <InputLabel required={true} id="department">Department</InputLabel>
                                            <Select
                                                labelId="department"
                                                id="department"
                                                required={true}
                                                value={department}
                                                label="department"
                                                onChange={handleDepartment}
                                                defaultValue={department}
                                            >
                                                {
                                                    departmentvalue?.filter((d,i) => (d.is_active === true)).map((d, i) => {
                                                        return <MenuItem key={i} value={d}>{d.name}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            disabled={!editDetails?.id}
                                            checked={!isActive}
                                            onChange={handleCheckBoxChange}
                                            label="Inactive"
                                        />
                                    </div>
                                </FormContainer>
                                <div className='d-flex justify-content-end'>
                                    <LoadingButton
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        sx={{ my: 2, top: "100", marginRight: "10px", marginTop: "45vh" }}
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

export default AddEditStatus
