import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { getLoggedInUserDetails } from "app/services/userService"
import React, { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MyProfile from "./myProfile"


const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))


const MyProfileView = () => {
    const navigate = useNavigate()
    const [initialValues,setInitialValues]=React.useState()
    const [loadPage,setLoadPage]= React.useState(false);
    useEffect(() => {
        fetch();
    }, [])
    const fetch = async () => {
        try {
          const { data } = await getLoggedInUserDetails();
          if (data) {
            setInitialValues( {
                firstName: data?.first_name?data.first_name: '',
                lastName: data?.last_name?data.last_name: '',
                email: data?.email?data.email: '',
                mobile:data?.mobile?data.mobile: '',
                designation:data?.designation?data.designation: '',
                role: data?.role?data.role: '',
                id: data?.id?data.id:'',
                department: data?.department_id?data.department_id:''
                })
                setLoadPage(true);
          }
          
        } catch {}
      };
    return (
        <Fragment>
            <ContentBox>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {loadPage &&
                        <MyProfile  
                           editData={initialValues}                       
                           onClose={() => {
                            navigate('/dashboard/default')
                        }}></MyProfile>
                    }
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment>
    )
}

export default MyProfileView