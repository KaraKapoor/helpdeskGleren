import { Grid } from "@mui/material"
import { styled } from "@mui/system"
import { getEscalationById } from "app/services/adminService";
import { Fragment, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import AddEditEscalation from "./addEditEscalations";
import EscalationsList from "./escalationList";


const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))


const EscalationView = () => {
    const [currentView, setCurrentView] = useState('Escalation');
    const navigate = useNavigate()
    const [query] = useSearchParams()
    const [editDetails, setEditDetails] = useState()

    useEffect(() => {
        if (query.get('type') === 'create-escalation') {
            setCurrentView('Create')
        } else if (query?.get('type')?.split('/')[0] === 'edit-escalation') {
            onEditClick(query.get('type').split('/')[1])
        } else {
            setCurrentView('Escalation')
            setEditDetails();
        }
    }, [query])

    const onEditClick = async(id) => {
        await getEscalationById({id:id}).then((response) => {
            setEditDetails(response.data)
        })
        setCurrentView('Edit')
        navigate({
            search: `?type=edit-escalation/${id}`,
        })
    }
    const onCreateClick = () => {
        setCurrentView('Create')
        navigate({
            search: `?type=create-escalation`,
        })
    }

    return (
        <Fragment>
            <ContentBox>
            {currentView === 'Escalation' && (
                    <EscalationsList
                        onEditClick={onEditClick}
                        onCreateClick={onCreateClick}
                        setEditDetails={setEditDetails}
                        setCurrentView={setCurrentView}
                    />
                )}
                {currentView === 'Create' && (
                    <AddEditEscalation
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
                    <AddEditEscalation
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

export default EscalationView