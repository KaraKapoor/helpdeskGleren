import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField } from '@mui/material';
import { Box, styled } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Swal from 'sweetalert2'
import { registerTenant, sendOTPEmail, verifyOTPEmail } from 'app/services/userService';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(JustifyBox)(() => ({
  height: '100%',
  padding: '32px',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRegister = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 400,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
  },
}));

// inital login credentials
const initialValues = {
  email: '',
  password: '',
  username: '',
  remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!').matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  email: Yup.string().email('Invalid Email address').required('Email is required!'),
});

const JwtRegister = () => {
  const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSendEmailBtn, setShowSendEmailBtn] = useState(true);
  const [showVerifyOTPBtn, setShowVerifyOTPBtn] = useState(false);
  const [showRegisterBtn, setShowRegisterBtn] = useState(false);

  
  const onClickVerifyEmail=(values)=>{
    console.log(values)
  }

  const handleFormSubmit = (values) => {
    console.log(values);
    if (!values.firstName) {
      return Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: "Please enter your First Name",
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
      })
  } else if (!values.lastName) {
      return Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: "Please enter your Last Name",
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
      })
  } else if (!values.email) {
      return Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: "Please enter your email",
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
      })
  } else if (!values.workplace) {
      return Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: "Please enter your Workplace Name",
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
      })
  }
    setLoading(true);

    try {
      if (showSendEmailBtn) {
          const formData = {
              email: values.email
          }
          sendOTPEmail(formData).then((data) => {
              if (data.status === false) {
                  return Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: data.error,
                      showCloseButton: true,
                      showConfirmButton: false,
                      width: 400,
                  })
              } else {
                  Swal.fire({
                      icon: 'success',
                      title: 'Success',
                      text: "OTP Sent Successfully",
                      showCloseButton: true,
                      showConfirmButton: false,
                      width: 400,
                  })
                  setShowSendEmailBtn(false);
                  setShowVerifyOTPBtn(true);
                  return null;
  
              }
          })
      } else if (showVerifyOTPBtn) {
          const formData = {
              otp: values.otp,
              email: values.email
          }
          verifyOTPEmail(formData).then((data) => {
              if (data.status === false) {
                  return Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: data.error,
                      showCloseButton: true,
                      showConfirmButton: false,
                      width: 400,
                  })
              } else {
                  Swal.fire({
                      icon: 'success',
                      title: 'Success',
                      text: "OTP Verified Successfully",
                      showCloseButton: true,
                      showConfirmButton: false,
                      width: 400,
                  })
                  setShowVerifyOTPBtn(false);
                  setShowRegisterBtn(true);
                  return null;
  
              }
          })
      } else if (showRegisterBtn) {
          const formData = {
              email: values.email,
              tenantName: values.workplace,
              password: values.password,
              firstName: values.firstName,
              lastName: values.lastName
          }
          registerTenant(formData).then((data) => {
              if (data.status === false) {
                  return Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: data.error,
                      showCloseButton: true,
                      showConfirmButton: false,
                      width: 400,
                  })
              } else {
                  Swal.fire({
                      icon: 'success',
                      title: 'Success',
                      text: "Account Created Successfully",
                      showCloseButton: true,
                      showConfirmButton: false,
                      width: 400,
                  })
              }
              navigate('/session/signin')
          })
          return null;
      }
      setLoading(false);
  } catch (e) {
      console.log(e);
      setLoading(false);
  }
  };

  return (
    <JWTRegister>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <img
                width="100%"
                alt="Register"
                src="/assets/images/illustrations/posting_photo.svg"
              />
            </ContentBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                validationSchema={validationSchema}
                initialValues={initialValues}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />
                   <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="firstName"
                      label="First Name"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.firstName}
                      onChange={handleChange}
                      helperText={touched.firstName && errors.firstName}
                      error={Boolean(errors.firstName && touched.firstName)}
                      sx={{ mb: 3 }}
                    />



                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="lastName"
                      label="Last Name"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.lastName}
                      onChange={handleChange}
                      helperText={touched.lastName && errors.lastName}
                      error={Boolean(errors.lastName && touched.lastName)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 2 }}
                    />
                      <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="workplace"
                      label="Workplace Name"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.workplace}
                      onChange={handleChange}
                      helperText={touched.workplace && errors.workplace}
                      error={Boolean(errors.workplace && touched.workplace)}
                      sx={{ mb: 3 }}
                    />
                    {
                      showVerifyOTPBtn && 
                      <TextField
                      fullWidth
                      size="small"
                      type="number"
                      name="otp"
                      label="OTP"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.otp}
                      onChange={handleChange}
                      helperText={touched.otp && errors.otp}
                      error={Boolean(errors.otp && touched.otp)}
                      sx={{ mb: 3 }}
                    />

                    }

                    {
                      showRegisterBtn
                       && 
                       <LoadingButton
                       type="submit"
                       color="primary"
                       loading={loading}
                       variant="contained"
                       sx={{ mb: 2, mt: 3 }}
                     >
                       Regiser
                     </LoadingButton>
                    }
                    {showSendEmailBtn
                     && 
                      <LoadingButton
                        type="submit"
                        color="primary"
                        loading={loading}
                        variant="contained"
                        sx={{ mb: 2, mt: 3 }}
                        >
                        Verfiy Email
                      </LoadingButton>
                    
                    }
                    {
                      showVerifyOTPBtn && 
                      <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mb: 2, mt: 3 }}
                      >
                      Verfiy OTP 
                    </LoadingButton>
                    }

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Login
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTRegister>
  );
};

export default JwtRegister;
