import { Box, Button, Card, Grid, styled, TextField } from "@mui/material";
import { changePassword } from "app/services/userService";
import { useEffect, useState } from "react";
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

const ChangePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  useEffect(() => {
    let currentUrl = window.location.href;
    let resetToken = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    setResetToken(resetToken);
  }, []);
  const checkPasswordValidity = (value) => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return "Password must not contain Whitespaces.";
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      return "Password must have at least one Uppercase Character.";
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
      return "Password must have at least one Lowercase Character.";
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
      return "Password must contain at least one Digit.";
    }

    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(value)) {
      return "Password must contain at least one Special Symbol.";
    }

    const isValidLength = /^.{10,16}$/;
    if (!isValidLength.test(value)) {
      return "Password must be 10-16 Characters Long.";
    }
    return null;
  };

  const handleFormSubmit = async () => {
    const message = checkPasswordValidity(password);
    if (!message) {
     
      changePassword({
        password: password,
        resetTokenId: resetToken,
      }).then((resp) => {
        
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
            text: "Password Changed Successfully",
            showCloseButton: true,
            showConfirmButton: false,
            width: 400,
          }).then(() => {
            return navigate("/session/signin");
          });
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: message,
        showCloseButton: true,
        showConfirmButton: false,
        width: 400,
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
                        type="password"
                        name="text"
                        size="small"
                        label="New Password"
                        value={password}
                        variant="outlined"
                        onChange={(e) => setPassword(e.target.value)}
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

                    <Button
                      fullWidth
                      color="primary"
                      variant="outlined"
                      onClick={() => navigate(-1)}
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

export default ChangePassword;
