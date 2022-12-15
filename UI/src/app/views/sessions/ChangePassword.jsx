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

const handleFormSubmit = async () => {
if (!password) {
return Swal.fire({
icon: "warning",
title: "Warning",
text: "Please enter your New Password",
showCloseButton: true,
showConfirmButton: false,
width: 400,
});
} else {
await changePassword({
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
