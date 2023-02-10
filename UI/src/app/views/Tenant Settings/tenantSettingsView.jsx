import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { Fragment, useState } from "react"
import TenantSettings from "./tenantSettings"

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const TenantSettingsView = () => {

    return (
        <Fragment>
            <ContentBox>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TenantSettings>
                        </TenantSettings>
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment>
    )
}

export default TenantSettingsView