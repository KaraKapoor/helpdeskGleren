import { Box, Button, Card, Grid, styled, TextField } from "@mui/material";
import { forgetPasswordEmail } from "app/services/userService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik } from "formik";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: "center",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}));

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    margin: "1rem",
    borderRadius: 12,
  },
}));

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleFormSubmit = async () => {
    if (!email) {
      return Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter your Registered Email",
        showCloseButton: true,
        showConfirmButton: false,
        width: 400,
      });
    } else {
      await forgetPasswordEmail({ email: email }).then((resp) => {
        if (resp.status === false) {
          return Swal.fire({
            icon: "error",
            title: "Error",
            text: resp.error,
            showCloseButton: true,
            showConfirmButton: false,
            width: 400,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Reset Password Email Sent",
            showCloseButton: true,
            showConfirmButton: false,
            width: 400,
          }).then(() => {
            return navigate("/session/forgot-password");
          });
        }
      });
    }
  };

  return (
    <ForgotPasswordRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4}>
              <img
                width="300"
                src="/assets/images/illustrations/dreamer.svg"
                alt=""
              />
            </JustifyBox>

            <ContentBox>
              <Formik onSubmit={handleFormSubmit} initialValues={{ email: "" }}>
                {({ values, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <div>
                      <TextField
                        type="email"
                        name="email"
                        size="small"
                        label="Email"
                        // value={email}
                        variant="outlined"
                         onChange={(e) => setEmail(e?.target?.value)}
                        sx={{ mb: 3, width: "100%" }}
                      />
                      <br />
                    </div>


                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Reset Password
                    </Button>

					{/* <div>
                      <TextField 
                        type="password"
                        name="password"
                        size="small"
                        label="Password"
                        // value={email}
                        variant="outlined"
                         onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 3, width: "100%" }}
                      />
                      <br />
                    </div> */}
					

                    <Button
                      fullWidth
                      color="primary"
                      variant="outlined"
                      onClick={() => navigate(-1) || navigate(-2) }
                      sx={{ mt: 2 }}
                    >
                      Go Back
                    </Button>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </ForgotPasswordRoot>
  );
};

export default ForgotPassword;
