import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { getAllTenantSettings, getTenantSettingsById } from "app/services/adminService"
import { Fragment, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import TenantSettings from "./tenantSettings"

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const TenantSettingsView = () => {

    const [editDetails, setEditDetails] = useState()
    const [query] = useSearchParams()


    // useEffect=(()=>{
    //     setEditDetails()
    // })

    return (
        <Fragment>
            <ContentBox>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TenantSettings
                        setEditDetails={setEditDetails} 
                        editDetails={editDetails}
                        >
                        </TenantSettings>
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment>
    )
}

export default TenantSettingsView