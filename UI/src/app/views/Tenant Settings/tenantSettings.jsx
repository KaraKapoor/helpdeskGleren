import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import { Card, Divider, FormControl, Grid, Icon, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { createTenantSettings, getAllTenantSettings } from 'app/services/adminService'
import { Strings } from 'config/strings'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const TenantSettings = ({ onClose, editDetails }) => {

  const navigate = useNavigate();
  const [selectedSessionTimeout, setSelectedSessionTimeout] = React.useState();
  const [data, setData] = useState([])
  console.log(data,"vdatadata")
 
  const handleClose = (event) => {
    navigate('/dashboard/default')
    return null;
  }

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
    
  const onSubmit = (values) => {
    const reqBody = {
      setting_value: selectedSessionTimeout,
      settingName: 'Session Timeout'
    };
    createTenantSettings(reqBody).then((resp) => {
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
          text: Strings.UPDATED_SUCCESSFULLY,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        })
        navigate('/dashboard/default')
        return null;
      }
    })
  }

  useEffect(() => {
    getAllTenantSettings().then((response) => {
      response?.data?.map((data, i) => {
        Object.assign(data)
        console.log(response.data,'hi')
        setData(response?.data[0]?.setting_value)
      })     
    })
  },[])

  const SessionHours = [
    { name: '1h', value: '1h' },
    { name: '2h', value: '2h' },
    { name: '3h', value: '3h' },
    { name: '4h', value: '4h' },
    { name: '5h', value: '5h' },
    { name: '6h', value: '6h' },
    { name: '7h', value: '7h' },
    { name: '8h', value: '8h' },
    { name: '9h', value: '9h' },
    { name: '10h', value: '10h' },
    { name: '11h', value: '11h' },
    { name: '12h', value: '12h' },
  ]

  const initialValues = {
    setting_value: editDetails?.setting_value ? editDetails.setting_value : ''
  }

  const handleSessionTimeoutChange = (event) => {
    setSelectedSessionTimeout(event.target.value);
  }

  return (
    <>
      <div>
        <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: '50vh' }}>
          <HeaderTitle>
            <div>
              Tenant Settings
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
            {({ values, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <FormContainer>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="Session_timeout">Session Timeout</InputLabel>
                      <Select
                        labelId="Session_timeout"
                        id="Session_timeout"
                        value={selectedSessionTimeout}
                        onChange={handleSessionTimeoutChange}
                        label="Session Timeout"
                        defaultValue={data}                     
                      >
                        {console.log(selectedSessionTimeout)}
                        {SessionHours.map(({ name, value }, idx) => (
                          <MenuItem value={value} key={idx}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
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

export default TenantSettings
