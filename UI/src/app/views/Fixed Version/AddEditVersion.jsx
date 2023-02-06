import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import moment from "moment";
import { Formik } from "formik";
import {
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import { Strings } from "config/strings";
import {
  createFixVersion,
  getMasterDropdownData,
} from "app/services/adminService";
import "./FixedVersion.css";
import * as Yup from "yup";

const AddEditVersion = ({ onClose, editDetails }) => {
  const [valid, setValid] = React.useState(false);
  const [isActive, setIsActive] = React.useState(
editDetails?.is_active ? editDetails.is_active : true
);
  const [ProjectValue, setProjectValue] = React.useState([]);
  const [Project, setProject] = React.useState();
  const handleClose = (event) => !!onClose && onClose(event) && setValid(false);
  const navigate = useNavigate();
  const HeaderTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    font-size: 1.5rem;
  `;
  const FormContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props) => (props.divide ? "50% 48.4%" : "100%")};
    padding: 1rem 1rem 0 1rem;
    gap: 1rem;
  `;
  const ISactiveError = styled.div`
  width:15px;
  height:15px;
  border:5px solid red;
  background-color:red;
  color:white;
  border-radius:50%;
  text-align:center;
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
    fix_version: Yup.string().max(
      20,
      "FixVersion Name can not be more than 20 characters long"
    ),
  });
  const onSubmit = (values) => {
    const reqBody = {
      fixversion: values.fix_version,
      project_id: Project,

      is_active: isActive,
    };
    if (editDetails?.id) {
      reqBody.id = editDetails.id;
    } else if (!values.fix_version) {
      return Swal.fire({
        icon: "warning",
        title: "Warning",
        text: Strings.FIX_VERSION_MANDATORY,
        showCloseButton: true,
        showConfirmButton: false,
        width: 400,
      });
    }
    createFixVersion(reqBody)?.then((resp) => {
      if (resp?.status === false) {
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
          text: editDetails?.id
            ? Strings.UPDATED_SUCCESSFULLY
            : Strings.CREATED_SUCCESSFULLY,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
        return navigate("/fixedversion");
      }
    });
  };
  const initialValues = {
    fix_version: editDetails?.fix_version ? editDetails.fix_version : "",
  };
  const handleCheckBoxChange = (event) => {
    if (event?.target.checked) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };
  const handleDepartment = (event) => {
    console.log(event, "jsjsjs");
    setProject(event.target.value);
  };
  return (
    <>
      <div>
        <Card elevation={3} sx={{ pt: 0, mb: 0, minHeight: "50vh" }}>
          <HeaderTitle>
            <div>
              {editDetails?.id ? "Edit Fix version" : "Add Fix version"}
            </div>
            <div onClick={handleClose}>
              <Icon
                sx={{
                  color: "#59B691",
                  fontSize: "35px !important",
                  cursor: "pointer",
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
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <FormContainer divide={true}>
                  <div>
                    <TextField
                      fullWidth
                      size="large"
                      name="fix_version"
                      type="text"
                      label="Fix Version"
                      required={true}
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.fix_version}
                      onChange={handleChange}
                      error={Boolean(errors.fix_version && touched.fix_version)}
                      helperText={touched.fix_version && errors.fix_version}
                      sx={{ mb: 1.5 }}
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
                        onChange={(w) => handleDepartment(w)}
                        defaultValue={Project}
                        className="isactiveDivStyle"
                      >
                        {ProjectValue?.map((d, i) => {
                          return (
                            <MenuItem key={i} value={d.id}  className="isactive-error">
                              {d.name} {d.is_active === false ? <ISactiveError />: ""}
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
                <div className="d-flex justify-content-end">
                  <LoadingButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{
                      my: 2,
                      top: "100",
                      marginRight: "10px",
                      marginTop: "45vh",
                    }}
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
  );
};

export default AddEditVersion;
