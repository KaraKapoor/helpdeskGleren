import React,{ Fragment,useEffect,useState } from "react";
import { LoadingButton } from "@mui/lab";
import {Box,Card,InputLabel,Icon,TextareaAutosize,TextField,} from "@mui/material";
import { reportBug } from "app/services/adminService";import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik } from "formik";
import {downloadFile,fileUpload} from "app/services/ticketService";
import './bugReport.css';

const BugReport = (props) => {
    const [issueDescription, setIssueDescription] = useState();
    const [image_data, setImageData] = useState([]);
    const [AttachmentsId,SetAttachmentId] = useState();
    const navigate = useNavigate();
    const handleChange = (event) => {
        setIssueDescription(event.target.value);
      };
    
    const submitBug=()=>{
        if (!issueDescription) {
            return Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: "Please enter your Issue Description",
                showCloseButton: true,
                showConfirmButton: false,
                width: 400,
            })
        }
        try {
            const formData={
                "issueDescription":issueDescription,
                "attachment":AttachmentsId
            }
            reportBug(formData).then((data)=>{
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
                        text: "Bug Reported Successfully",
                        showCloseButton: true,
                        showConfirmButton: false,
                        width: 400,
                    })
                    navigate('/dashboard/default')
                    return null;
    
                }
            })
        } catch (e) {
            console.log(e);
        }
    }
  const onChangeFile = (event) => {
    let file = event.target.files[0];
    if (!event?.target?.files[0]) {
      return null;
    }
    let data = new FormData();
    data.append("file", event?.target?.files[0]);
    fileUpload(data).then((resp) => {
      SetAttachmentId(resp?.data?.id)
      if (resp?.status === false) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: resp.error,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
      }
       else if (file.size > 10e6) {
        return Swal.fire({
            icon: "error",
            title: "Please upload a file smaller than 10 MB",
            text: resp.error,
            showCloseButton: true,
            showConfirmButton: false,
            width: 400,
          });
      }
      else if(file?.type === "image/jpeg" || file?.type === "image/jpg" || file?.type === "image/png" || file.type === "application/pdf"){
        console.log(resp,"resp");
        setImageData( image_data => [...image_data,resp.data])
      }
      else{
        return Swal.fire({
          icon: "error",
          title: "Please upload a image jpeg/jpg/pdf",
          text: resp.error,
          showCloseButton: true,
          showConfirmButton: false,
          width: 400,
        });
      }
    });
  };
  const deleteFunction =(value)=>{
    image_data?.splice(value,1)
    setImageData( image_data => [...image_data])
  }
  useEffect(()=>{
    deleteFunction()
  },[])
    return (
        <Box width="100%" overflow="auto">
            <label className="issueDescription">Issue Description</label><br></br>
            <TextareaAutosize
              type="textarea"
              style={{ width: '100%',outline:'none',borderRadius:"5px" }}
              name="issueDescription"
              placeholder="Please tell us in some words which issue you are facing"
              id="standard-basic"
              value={issueDescription}
              onChange={handleChange}
              minRows={20}
              label="Issue Description (Min length 4, Max length 9)"
      />
      <Formik>
        {({
          handleBlur,
        }) => (
          <>
            <TextField
              fullWidth
              size="large"
              name="files"
              type="file"
              variant="outlined"
              onBlur={handleBlur}
              onChange={onChangeFile}
              sx={{ mt: 1, mb:2}}
              value=""
              className="inputStyling"
            />
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <InputLabel>Attachments</InputLabel>
                  <Fragment>
                    {image_data.map((obj,index)=>{
                    return(
                      <>
                      <div>
                      <span className={obj.original_name ? "Datastyling" : ""}>{obj.original_name}</span>
                      {
                        obj ? (
                          <>
                          <span
                        onClick={() => {
                        deleteFunction(index)
                        }}
                      >
                        <Icon className="icon deleteIcon" >delete</Icon>
                      </span>
                      <span
                        onClick={(e) => {
                          const Download = {
                            keyName: obj.key,
                          };
                          downloadFile(Download).then((r) => {
                            window.open(r.data, "_blank");
                          });
                        }}
                      >
                        <Icon className="icon deleteIcon" >file_download</Icon>
                      </span>
                          </>
                        ) : ""
                      }
                    </div>
                    </>
                    )
                     })}
                  </Fragment>
            </Card>
          </>
        )}
      </Formik>
      <LoadingButton
        type="submit"
        onClick={submitBug}
        color="primary"
        variant="contained"
        sx={{ mb: 2, mt: 3 }}
      >
        Submit
      </LoadingButton>
    </Box>
  );
};
export default BugReport;