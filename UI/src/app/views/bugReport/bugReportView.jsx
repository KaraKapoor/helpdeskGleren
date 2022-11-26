import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { Fragment, useState } from "react"
import BugReport from "./bugReport"


const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))


const BugReportView = () => {
    return (
        <Fragment>
            <ContentBox>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <BugReport></BugReport>
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment>
    )
}

export default BugReportView