import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { getVersionAllById } from "app/services/adminService";
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


const FixedVersionView = () => {
    const [currentView, setCurrentView] = useState('fixedversion');
    const navigate = useNavigate()
    const [query] = useSearchParams()
    const [editDetails, setEditDetails] = useState()

    useEffect(() => {
        if (query?.get('type') === 'create-fixedversion') {
            return setCurrentView('Create')
        } else if (query?.get('type')?.split('/')[0] === 'edit-fixedversion') {
            return onEditClick(query?.get('type')?.split('/')[1])
        } else {
            setCurrentView('fixedversion')
            return setEditDetails();
        }
    }, [query])

    const onEditClick = async(id) => {
        await getVersionAllById({id:id}).then((response) => {
            setEditDetails(response?.data)
        })
        setCurrentView('Edit')
        navigate({
            search:`?type=edit-fixedversion/${id}`,
        })
    }
    const onCreateClick = () => {
        setCurrentView('Create')
        navigate({
            search:`?type=create-fixedversion`,
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