import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { Fragment, useState } from "react"
import ProjectList from "./projectList";


const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
}));

const SubTitle = styled('span')(({ theme }) => ({
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
}));

const H4 = styled('h4')(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '16px',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
}));

const ProjectView = () => {
    const [currentView, setCurrentView] = useState('List');
    const onItemLClick = (project) => {
        setCurrentView('Details');
    };
    const addNewLClick = () => {
        setCurrentView('Details');
    }
    return (
        <Fragment>
            <ContentBox>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                    <ProjectList onItemLClick={onItemLClick} addNewLClick={addNewLClick} ></ProjectList>
                        {/* {currentView === 'List' ? <ProjectList onItemLClick={onItemLClick} addNewLClick={addNewLClick} ></ProjectList> : ""} */}
                        {/* {currentView === 'Details' ? <ProjectDetails onClose={() => setCurrentView('List')}></ProjectDetails> : ""} */}
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment>
    )
}

export default ProjectView