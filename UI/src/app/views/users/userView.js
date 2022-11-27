import { styled } from "@mui/system"
import { getUserById } from "app/services/userService";
import { Fragment, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import UsersList from "./userList";


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

const StatusView = () => {
    const [currentView, setCurrentView] = useState('Users');
    const navigate = useNavigate()
    const [query] = useSearchParams()
    const [editDetails, setEditDetails] = useState()

    useEffect(() => {
        if (query.get('type') === 'create-user') {
            setCurrentView('Create')
        } else if (query?.get('type')?.split('/')[0] === 'edit-user') {
            onEditClick(query.get('type').split('/')[1])
        } else {
            setCurrentView('Users')
            setEditDetails();
        }
    }, [query])

    const onEditClick = async(userId) => {
        await getUserById({id:userId}).then((response) => {
            setEditDetails(response.data)
        })
        setCurrentView('Edit')
        navigate({
            search: `?type=edit-status/${userId}`,
        })
    }
    const onCreateClick = () => {
        setCurrentView('Create')
        navigate({
            search: `?type=create-status`,
        })
    }

    return (
        <Fragment>
            <ContentBox>
            {currentView === 'Users' && (
                    <UsersList
                        onEditClick={onEditClick}
                        onCreateClick={onCreateClick}
                        setEditDetails={setEditDetails}
                        setCurrentView={setCurrentView}
                    />
                )}
                {/* {currentView === 'Create' && (
                    <AddEditStatus
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
                    <AddEditStatus
                        onClose={() => {
                            setCurrentView('List')
                            navigate({
                                search: '',
                            })
                            setEditDetails()
                        }}
                        editDetails={editDetails}
                    />
                )} */}
            </ContentBox>
        </Fragment>
    )
}

export default StatusView