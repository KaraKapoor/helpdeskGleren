import { LoadingButton } from "@mui/lab";
import { Box, FormControlLabel, TextareaAutosize } from "@mui/material";
import { reportBug } from "app/services/adminService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './bugReport.css';

const BugReport = (props) => {
    const [issueDescription, setIssueDescription] = useState();
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
                "issueDescription":issueDescription
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
                        text: "OTP Sent Successfully",
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

    return (
        <Box width="100%" overflow="auto">
            <label className="issueDescription">Issue Description</label><br></br>
            <TextareaAutosize
              type="textarea"
              style={{ width: '100%',outline:'none' }}
              name="issueDescription"
              placeholder="Please tell us in some words which issue you are facing"
              id="standard-basic"
              value={issueDescription}
              onChange={handleChange}
              minRows={20}
              label="Issue Description (Min length 4, Max length 9)"
            />
            <LoadingButton type="submit" onClick={submitBug} color="primary" variant="contained" sx={{ mb: 2, mt: 3 }}>Submit</LoadingButton>
        </Box>
    )
}
export default BugReport;