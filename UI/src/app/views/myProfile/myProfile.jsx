import { LoadingButton } from "@mui/lab";
import React, { useEffect } from 'react'
import { Box, Divider, FormControlLabel, Grid, Icon, TextareaAutosize, TextField } from "@mui/material";
import { reportBug } from "app/services/adminService";
import { Formik } from "formik";
import { useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styled from '@emotion/styled'
import { getLoggedInUserDetails, updateUserProfile } from "app/services/userService";
import { Strings } from "config/strings";

const MyProfile = ({onClose,editData}) => {
const [valid, setValid] = React.useState(false)
const [initialValues,setInitialValues]=React.useState(editData)
const navigate = useNavigate();
const handleClose = (event) => !!onClose && onClose(event) && setValid(false);
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
designation: values.designation,
firstName: values.firstName,
lastName: values.lastName,
mobile: values.mobile,
id: values.id
};
updateUserProfile(reqBody).then((resp)=>{
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
return navigate('/dashboard/default');
}
})
}

return (
<>
	<div>
		<Card elevation={3} sx={{ pt: 0, mb: 0 }}>
			<HeaderTitle>
				<div>
					Edit Profile
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
			<Formik onSubmit={onSubmit} initialValues={initialValues}>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
				<form onSubmit={handleSubmit}>
					<FormContainer>
						<Grid container spacing={2}>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextField fullWidth size="large" name="firstName" type="text" label="First Name"
									variant="outlined" onBlur={handleBlur} value={values.firstName}
									onChange={handleChange} sx={{ mb: 1.5 }} />
							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextField fullWidth size="large" name="lastName" type="text" label="Last Name"
									variant="outlined" onBlur={handleBlur} value={values.lastName}
									onChange={handleChange} sx={{ mb: 1.5 }} />
							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextField fullWidth size="large" name="email" type="email" label="Email"
									disabled={true} variant="outlined" onBlur={handleBlur} value={values.email}
									onChange={handleChange} sx={{ mb: 1.5 }} />
							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextField fullWidth size="large" name="mobile" type="text" label="Mobile"
									variant="outlined" onBlur={handleBlur} value={values.mobile} onChange={handleChange}
									sx={{ mb: 1.5 }} />
							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextField fullWidth size="large" name="designation" type="text" label="Designation"
									variant="outlined" onBlur={handleBlur} value={values.designation}
									onChange={handleChange} sx={{ mb: 1.5 }} />

							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextField fullWidth size="large" name="role" type="text" label="Role" disabled={true}
									variant="outlined" onBlur={handleBlur} value={values.role} onChange={handleChange}
									sx={{ mb: 1.5 }} />
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
export default MyProfile;