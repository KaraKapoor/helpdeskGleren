import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { getDepartmentById } from "app/services/adminService";
import { Fragment, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import AddEditDepartment from "./addEditDepartment";
import DepartmentList from "./departmentList";


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

const DepartmentView = () => {
    const [currentView, setCurrentView] = useState('Department');
    const navigate = useNavigate()
    const [query] = useSearchParams()
    const [editDetails, setEditDetails] = useState()

    useEffect(() => {
        if (query.get('type') === 'create-department') {
            setCurrentView('Create')
        } else if (query?.get('type')?.split('/')[0] === 'edit-department') {
            onEditClick(query.get('type').split('/')[1])
        } else {
            setCurrentView('Department')
            setEditDetails();
        }
    }, [query])

    const onEditClick = async(departmentId) => {
        await getDepartmentById({id:departmentId}).then((response) => {
            setEditDetails(response.data)
        })
        setCurrentView('Edit')
        navigate({
            search: `?type=edit-department/${departmentId}`,
        })
    }
    const onCreateClick = () => {
        setCurrentView('Create')
        navigate({
            search: `?type=create-department`,
        })
    }

    return (
        <Fragment>
            <ContentBox>
            {currentView === 'Department' && (
                    <DepartmentList
                        onEditClick={onEditClick}
                        onCreateClick={onCreateClick}
                        setEditDetails={setEditDetails}
                        setCurrentView={setCurrentView}
                    />
                )}
                {currentView === 'Create' && (
                    <AddEditDepartment
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
                    <AddEditDepartment
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

export default DepartmentView