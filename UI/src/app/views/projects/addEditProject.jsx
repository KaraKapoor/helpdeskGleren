import React from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import moment from 'moment'
import { Formik } from 'formik';
import './projectList.css'
import { createProject, getById } from 'app/services/projectService'
import { Card, Checkbox, Divider, FormControlLabel, Icon, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import { Strings } from 'config/strings'
import * as Yup from 'yup';

const AddEditProject = ({ onClose, editDetails }) => {
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

    const validationSchema = Yup.object().shape({
        projectName: Yup.string()
          .max(50, 'Project Name can not be more than 50 characters long'),
      });

    const onSubmit = (values) => {
        const reqBody = {
            projectName: values.projectName,
            is_active: isActive
        };
        if (editDetails?.id) {
            reqBody.id = editDetails.id
        } else if (!values.projectName) {
            return Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: Strings.PROJECT_NAME_MANDATORY,
                showCloseButton: true,
                showConfirmButton: false,
                width: 400,
            })
        }
        createProject(reqBody).then((resp) => {
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
                return navigate('/project');
            }

        })
    }
    const initialValues = {
        projectName: editDetails?.name ? editDetails.name : ''
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
                            {editDetails?.id ? 'Edit Project' : 'Add Project'}
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
                        validationSchema={validationSchema}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <FormContainer divide={true}>
                                    <div>
                                        <TextField
                                            fullWidth
                                            size="large"
                                            name="projectName"
                                            type="text"
                                            label="Project Name"
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={values.projectName}
                                            onChange={handleChange}
                                            sx={{ mb: 1.5 }}
                                            error={Boolean(errors.projectName && touched.projectName)}  helperText={touched.projectName && errors.projectName}
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

export default AddEditProject
