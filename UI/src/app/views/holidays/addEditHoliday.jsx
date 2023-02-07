import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import { Formik } from 'formik';
import './holidayList.css'
import { Card, Checkbox, Divider, FormControl, FormControlLabel, Icon, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import { Strings } from 'config/strings'
import { createHolidays, getMasterDropdownData } from 'app/services/adminService';
import * as Yup from 'yup';
import moment from 'moment';

const AddEditHoliday = ({ onClose, editDetails }) => {
    const [valid, setValid] = React.useState(false)
    const [ProjectValue, setProjectValue] = React.useState([]);
    const [Project, setProject] = React.useState();
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
useEffect(() => {
    if (editDetails) {
      {
        setIsActive(editDetails?.is_active);
        setProject(editDetails?.project_id);
      }
    }
    getMasterDropdownData()?.then((resp) => {
      if (resp?.status === false) {
        return Swal.fire({
          icon: "error",
          title: "Error hi",
          text: resp.error,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
      } else {
        setProjectValue(resp?.data?.projects);
      }
    });
  }, []);



    const validationSchema = Yup.object().shape({
        holidayName: Yup.string()
          .max(20, 'Holiday Name can not be more than 20 characters long'),
      });

    const onSubmit = (values) => {
        const reqBody = {
            holidayName: values.holidayName,
            holidayDate: values.holidayDate!==null?moment(values.holidayDate).format(Strings.DATE_HOLIDAYS_FORMAT):"/",
            is_active: isActive,
            projectId: Project,
        };
         if (editDetails?.id) {
             reqBody.id = editDetails.id
         } else if (!values.holidayName) {
             return Swal.fire({
                 icon: 'warning',
                 title: 'Warning',
                 text: Strings.HOLIDAY_NAME_MANDATORY,
                 showCloseButton: true,
                 showConfirmButton: false,
                 width: 400,
             })
         }
        createHolidays(reqBody).then((resp) => {
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
              return navigate('/holidays');
            }

        })
    }
    const initialValues = {
        holidayName: editDetails?.holiday_name ? editDetails.holiday_name : '',
        holidayDate: editDetails?.holiday_date ? editDetails.holiday_date: ''
        
    }
    const handleCheckBoxChange = (event) => {
        if (event?.target.checked) {
            setIsActive(false);
        } else {
            setIsActive(true);
        }
    }
    const handleHolidays = (event) => {
        setProject(event.target.value);
      };
    
    return (
        <>
            <div>
                <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: '40vh' }}>
                    <HeaderTitle>
                        <div>
                            {editDetails?.id ? 'Edit Holiday' : 'Add Holiday'}
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
                                            name="holidayName"
                                            type="text"
                                            label="Holiday Name"
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={values.holidayName}
                                            onChange={handleChange}
                                            error={Boolean(errors.holidayName && touched.holidayName)}
                                            helperText={touched.holidayName && errors.holidayName}
                                            sx={{ mb: 1.5 }}
                                        />
                                        <br />
                                        
                                        <TextField
                                            fullWidth
                                            size="large"
                                            name="holidayDate"
                                            type="date"
                                            label="holiday_date"
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            value={values.holidayDate}
                                            onChange={handleChange}
                                            error={Boolean(errors.holidayDate && touched.holidayDate)}
                                            helperText={touched.holidayDate && errors.holidayDate}
                                            sx={{ mb: 1.5 }}

                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <br />
                                    </div>  
                                    <div>
                    <FormControl fullWidth>
                      <InputLabel required={true} id="projects">
                        Projects
                      </InputLabel>
                      <Select
                        labelId="projects"
                        id="projects"
                        required={true}
                        value={Project}
                        label="Project Name"
                        onChange={(w) => handleHolidays(w)}
                        defaultValue={Project}
                      >
                        {ProjectValue?.filter(
                          (d, i) => d.is_active === true
                        ).map((d, i) => {
                          console.log(ProjectValue,"hshshs")
                          return (
                            <MenuItem key={i} value={d.id}>
                              {d.name}
                            </MenuItem>
                          );
                        })}
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

export default AddEditHoliday