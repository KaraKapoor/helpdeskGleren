import { LoadingButton } from "@mui/lab";
import React, { useEffect,useRef,useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Avatar,
} from "@mui/material";
import { getMasterDropdownData, reportBug } from "app/services/adminService";
import { Formik } from "formik";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styled from "@emotion/styled";
import {
  getLoggedInUserDetails,
  getProfilePic,
  updateUserProfile,
} from "app/services/userService";
import { Strings } from "config/strings";
import { deleteFile, fileUpload } from "app/services/ticketService";

import useAuth from "app/hooks/useAuth";
import { Link, useSearchParams } from "react-router-dom";
import CircularProgress from "../../components/MatxLoading";
import { get } from "lodash";
const MyProfile = ({ onClose, editData }) => {
  const [valid, setValid] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState(editData);
  const [masterDropdownData, setMasterDropdownData] = React.useState();
  const [image_data , setImageData]=useState(null)
  const [departments, setDepartments] = React.useState();
  const [selectedDepartment, setSelectedDepartment] = React.useState();
  const [fileLoading, setfileLoading] = React.useState(false);
  const navigate = useNavigate();
  const handleClose = (event) => !!onClose && onClose(event) && setValid(false);
  const [users, setUsers] = useState({ avatar: "", raw: "" });
  const [isDelete, setisDelete] = useState(false);
  console.log(users,"usersusers")
  const [filename , setfileName] = useState("")
  const { logout, user } = useAuth();
  const uploadInputRef = useRef(null)
  const [fileresponse , setFileResponse]= useState({});
  let [searchParams] = useSearchParams();
  const searchdata=searchParams.get('updated')

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
  useEffect(() => {
    getProfilePic()
      .then((data) => {
        setUsers({...users,avatar:data?.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit = (values) => {
    const reqBody = {
      designation: values.designation,
      firstName: values.firstName,
      lastName: values.lastName,
      mobile: values.mobile,
      id: values.id,
      departmentId: selectedDepartment,
      photouploadId:image_data?.id ? image_data.id:null
    };
    updateUserProfile(reqBody).then((resp) => {
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
        getProfilePic()
        Swal.fire({
          icon: "success",
          title: "Success",
          text: Strings.UPDATED_SUCCESSFULLY,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
         return window.location.href="/dashboard/default?updated=true";
      }
    });
  };
  const deletethisFile =async()=>{
    const response =  await getLoggedInUserDetails();   
    const obj = {
      uploadId: response?.data?.id,
      keyName: response?.data?.key,
    };
    deleteFile(obj).then((r) =>{
      console.log(image_data,r,"after delete");
      setfileName("");
      setUsers({...users,avatar:""});
      setImageData(null);
    });
  }
  useEffect(() => {
    getMasterDropdownData().then((resp) => {
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
        setDepartments(resp?.data?.departments);
        setMasterDropdownData(resp.data);
        setSelectedDepartment(editData?.department);
  }
});
  }, [users]);

  const handleDepartmentChange = (event) => {
setSelectedDepartment(event.target.value);
  };
  const onChangeFile = (event) => {
    setfileLoading(true);
    if (!event?.target?.files[0]) {
        return null;
    }
    let data = new FormData();
    data.append("file", event?.target?.files[0]);
    setfileName(get(event,"target.files[0].name"))
    fileUpload(data).then((resp) => {
      setImageData(resp?.data);
      setfileLoading(false); Swal.fire({
        icon: "success",
        title: "Success",
        text: Strings.PROFILE_IMAGE_UPDATED_SUCCESSFULLY,
        showCloseButton: true,
        showConfirmButton: false,
        width: 400,
      });
      
      const reqBody={
        photouploadId:resp.data.id,
        id:resp.data.uploaded_by
      }
      updateUserProfile(reqBody).then((data)=>{
        if(data){
          getProfilePic()
      .then((data) => {
        setUsers({...users,avatar:data?.data});
      })
      .catch((err) => {
        console.log(err);
      });
        }
      });
    })
}
  return (
    <>
      <div>
        <Card elevation={3} sx={{ pt: 0, mb: 0 }}>
          <HeaderTitle>
            <div>Edit Profile</div>
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
          <Formik onSubmit={onSubmit} initialValues={initialValues}>
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <FormContainer>
                  <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        name="firstName"
                        type="text"
                        label="First Name"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.firstName}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        name="lastName"
                        type="text"
                        label="Last Name"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.lastName}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        name="email"
                        type="email"
                        label="Email"
                        disabled={true}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.email}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        name="mobile"
                        type="text"
                        label="Mobile"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.mobile}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        name="designation"
                        type="text"
                        label="Designation"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.designation}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="large"
                        name="role"
                        type="text"
                        label="Role"
                        disabled={true}
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.role}
                        onChange={handleChange}
                        sx={{ mb: 1.5 }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="role">Department</InputLabel>
                        <Select
                          labelId="department"
                          id="department"
                          value={selectedDepartment}
                          label="Department"
                          onChange={handleDepartmentChange}
                          defaultValue={selectedDepartment}
                        >
                      {departments?.map((d, i) => {
                        return (
                            <MenuItem key={i} value={d.id}>
                              {d.name}
                            </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* <TextField
                    fullWidth
                    label="Profile Image"
                    size="large"
                    name="files"
                    type="file"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={onChangeFile}
                    sx={{ mb: 1.5 }}
                    value=""
                    InputLabelProps={{ shrink: true }}
                  /> */}
                  <div>
                  <label>Profile Image</label>
                   <input
                      ref={uploadInputRef}
                      style={{ display: "none" }}
                      onChange={onChangeFile}
                      type="file"
                    />
                    <Button
                      onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
                      style ={{ cursor:'pointer', marginLeft:'30px', backgroundColor:'white', padding:'8px  20px', border: 'none', width:'25%', color:'blue',textAlign:'left',fontSize:'16px' }}
                    >
                     { filename || 'Click to Upload'}
                     </Button>
                     
                     <Button onClick={deletethisFile} style ={{ backgroundColor:'white',  width:'25%', color:'blue', border: 'none' }}
                       disabled={users.avatar? false:true}>
                     <Icon className="icon deleteIcon">delete</Icon>
                     </Button>

                     </div>

                  {fileLoading && 
                      <div style={{position: 'fixed',backgroundColor: '#00000075',width:'100%',top:'0',left:'0',zIndex:'999',height:'100vh'}}>
                      <CircularProgress />                                          
                      </div>  }
                  <label htmlFor="upload-button">
                    {users.avatar ? (
                      <img
                        src={users.avatar}
                        alt="dummy"
                        width="70"
                        height="70"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : (
                      <>
                        <Avatar src={user.avatar} sx={{ cursor: "pointer" }} />
                      </>
                    )}
                  </label>

                </FormContainer>
                <div className="d-flex justify-content-end">
                  <LoadingButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{
                      my: 2,
                      top: "60",
                      marginRight: "10px",
                      marginTop: "25vh",
                    }}
                  >
                    Update
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
export default MyProfile;