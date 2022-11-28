import React from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import { Formik } from 'formik';
import './departmentList.css'
import { Card, Checkbox, Divider, FormControlLabel, Icon, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import { Strings } from 'config/strings'
import { createDepartment } from 'app/services/adminService';

const AddEditDepartment = ({ onClose, editDetails }) => {
    const [valid, setValid] = React.useState(false)
    const [isActive, setIsActive] = React.useState(editDetails?.is_active ? editDetails.is_active : true);
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
        if(editDetails){{
            setIsActive(editDetails?.is_active);
        }}
    }, [])

    const onSubmit = (values) => {
        const reqBody = {
            departmentName: values.departmentName,
            is_active: isActive
        };
        if (editDetails?.id) {
            reqBody.id = editDetails.id
        } else if (!values.departmentName) {
            return Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: Strings.DEPARTMENT_NAME_MANDATORY,
                showCloseButton: true,
                showConfirmButton: false,
                width: 400,
            })
        }
        createDepartment(reqBody).then((resp) => {
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
                return navigate('/departments');
            }

        })
    }
    const initialValues = {
        departmentName: editDetails?.name ? editDetails.name : ''
    }
    const handleCheckBoxChange = (event) => {
        if (event?.target.checked) {
            setIsActive(false);
        } else {
            setIsActive(true);
        }
    }
    return (
        <>
            <div>
                <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: '50vh' }}>
                    <HeaderTitle>
                        <div>
                            {editDetails?.id ? 'Edit Department' : 'Add Department'}
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
                                            name="departmentName"
                                            type="text"
                                            label="Department Name"
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={values.departmentName}
                                            onChange={handleChange}
                                            sx={{ mb: 1.5 }}
                                        />
                                        <br />

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

export default AddEditDepartment
