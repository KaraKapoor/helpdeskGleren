import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import { loginUser } from 'app/services/userService';
import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '100',
  padding: '32px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRoot = styled(JustifyBox)(({ imgUrl }) => ({
  background: '#1A2038',
  height: '100vh',
  '& .card': {
      maxWidth: 800,
      borderRadius: 12,
      margin: '1rem',
  },
}))

// inital login credentials
const initialValues = {
  email: '',
  password: '',
  workplace: '',
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!'),
  email: Yup.string().email('Invalid Email address').required('Email is required!'),
  workplace: Yup.string().required('Work Place is required!'),
});

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password, values.workplace);
      setLoading(false);
      navigate('/')

    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Email"
                      size="small"
                      type="email"
                      name="email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      required={true}
                      sx={{ mb: 3 }}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      size="small"
                      name="password"
                      type="password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      required={true}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                      InputLabelProps={{ shrink: true }}
                    />
                    <br></br>

                     <TextField
                        fullWidth
                        label="Work Place"
                        size="small"
                        name="workplace"
                        type="text"
                        variant="outlined"
                         onBlur={handleBlur}
                         value={values.workplace}
                         onChange={handleChange}
                         required={true}
                         helperText={touched.workplace && errors.workplace}
                         error={Boolean(errors.workplace && touched.workplace)}
                         sx={{ mb: 1.5 }}
                        InputLabelProps={{ shrink: true }}
                      />

                    <FlexBox justifyContent="space-between">
                      {/* <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>Remember Me</Paragraph>
                      </FlexBox> */}

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>

                    <Paragraph>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Register
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
};

export default JwtLogin;
