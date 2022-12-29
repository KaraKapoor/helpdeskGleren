import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { getById } from "app/services/adminService";
import { Fragment, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import AddEditVersion from "./AddEditVersion";
import FixedVersionList from "./FixedVersionList";

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

const FixedVersionView = () => {
    const [currentView, setCurrentView] = useState('fixedversion');
    const navigate = useNavigate()
    const [query] = useSearchParams()
    const [editDetails, setEditDetails] = useState()

    useEffect(() => {
        if (query.get('type') === 'create-fix') {
            setCurrentView('Create')
        } else if (query?.get('type')?.split('/')[0] === 'edit-fix') {
            onEditClick(query.get('type').split('/')[1])
        } else {
            setCurrentView('fixedversion')
            setEditDetails();
        }
    }, [query])

    const onEditClick = async(statusId) => {
        await getById({id:statusId}).then((response) => {
            setEditDetails(response.data)
        })
        setCurrentView('Edit')
        navigate({
            search: `?type=edit-fixedversion/${statusId}`,
        })
    }
    const onCreateClick = () => {
        setCurrentView('Create')
        navigate({
            search: `?type=create-fixedversion`,
        })
    }

    return (
        <Fragment>
            <ContentBox>
            {currentView === 'fixedversion' && (
                    <FixedVersionList
                        onEditClick={onEditClick}
                        onCreateClick={onCreateClick}
                        setEditDetails={setEditDetails}
                        setCurrentView={setCurrentView}
                    />
                )}
                {currentView === 'Create' && (
                    <AddEditVersion
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
                    <AddEditVersion
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

export default FixedVersionView