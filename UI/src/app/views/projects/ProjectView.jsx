import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { getById } from "app/services/projectService";
import { Fragment, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import AddEditProject from "./addEditProject";
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
    const [currentView, setCurrentView] = useState('Project');
    const navigate = useNavigate()
    const [query] = useSearchParams()
    const [editDetails, setEditDetails] = useState()

    useEffect(() => {
        if (query.get('type') === 'create-project') {
            setCurrentView('Create')
        } else if (query?.get('type')?.split('/')[0] === 'edit-project') {
            onEditClick(query.get('type').split('/')[1])
        } else {
            setCurrentView('Project')
            setEditDetails();
        }
    }, [query])

    const onEditClick = async(projectId) => {
        await getById({id:projectId}).then((response) => {
            setEditDetails(response.data)
        })
        setCurrentView('Edit')
        navigate({
            search: `?type=edit-project/${projectId}`,
        })
    }
    const onCreateClick = () => {
        setCurrentView('Create')
        navigate({
            search: `?type=create-project`,
        })
    }

    return (
        <Fragment>
            <ContentBox>
            {currentView === 'Project' && (
                    <ProjectList
                        onEditClick={onEditClick}
                        onCreateClick={onCreateClick}
                        setEditDetails={setEditDetails}
                        setCurrentView={setCurrentView}
                    />
                )}
                {currentView === 'Create' && (
                    <AddEditProject
                        onClose={() => {
                            setCurrentView('List')
                            navigate({
                                search: '',
                            })
                            setEditDetails()
                        }}
                        editDetails={editDetails}
                    />
                )}
                {currentView === 'Edit' && editDetails && (
                    <AddEditProject
                        onClose={() => {
                            setCurrentView('List')
                            navigate({
                                search: '',
                            })
                            setEditDetails()
                        }}
                        editDetails={editDetails}
                    />
                )}
            </ContentBox>
        </Fragment>
    )
}

export default ProjectView