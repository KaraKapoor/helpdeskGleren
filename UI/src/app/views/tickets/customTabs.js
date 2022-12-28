import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getTicketComments, getTicketHistory, saveTicketComment } from 'app/services/ticketService';
import Swal from 'sweetalert2';
import { Grid, Icon } from '@mui/material';
import moment from 'moment';
import { MaterialEditor } from 'react-mui-editor';
import { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { Fragment } from 'react';
import {Select, MenuItem, InputLabel } from '@mui/material';
import {  getMasterDropdownData } from 'app/services/adminService';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function CustomTabs({ ticketId }) {
    const [value, setValue] = React.useState(1);
    const [editData, setEditData] = React.useState([]);
    const [commentsData, setCommentsData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [editorContent, setEditorContent] = React.useState(undefined);
    const [selectedRecipient, setSelectedRecipient] = React.useState([]);
    const [agents, setAgents] = React.useState();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            setIsLoading(false);
        } else if (newValue === 1) {
            getTicketCommentsData(ticketId);
        }
        else if (newValue === 2) {
            getTicketHistoryData(ticketId);
        }
    };
    const handleRecipientChange= (event)=>{
        const {target: { value },} = event;
        setSelectedRecipient(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      }
    useEffect(() => {
        setIsLoading(false);
        getTicketCommentsData(ticketId);
    
    getMasterDropdownData().then((resp) => {
        if (resp?.status === false) {
            return Swal.fire({
              icon: 'error',
              title: 'Error',
              text: resp.error,
              showCloseButton: true,
              showConfirmButton: false,
              width: 400,
            })
          } else {
            console.log(resp.data);
            setAgents(resp?.data?.agents);
            //setSelectedAgents(editDetails?.agents?editDetails.agents:[]);
          }

    })
},
     [])
    const getTicketHistoryData = (id) => {
        getTicketHistory({ id: id }).then((resp) => {
            if (resp?.status === false) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.error,
                    showCloseButton: true,
                    showConfirmButton: false,
                    width: 400,
                })
            } else {
                setEditData(resp.data.data);
                setIsLoading(false);
            }

        })
    }
    const getTicketCommentsData = (id) => {
        getTicketComments({ ticketId: id }).then((resp) => {
            if (resp?.status === false) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.error,
                    showCloseButton: true,
                    showConfirmButton: false,
                    width: 400,
                })
            } else {
                setCommentsData(resp.data.data);
                setIsLoading(false);
            }

        })
    }
    const saveComments = () => {
        saveTicketComment({ ticketId: ticketId, htmlComments: editorContent,emailIds: selectedRecipient }).then((resp) => {
            if (resp?.status === false) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resp.error,
                    showCloseButton: true,
                    showConfirmButton: false,
                    width: 400,
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: "Saved Successfully",
                    showCloseButton: true,
                    showConfirmButton: false,
                    width: 400,
                })
                setEditorContent(undefined);
            }

        })
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Add Comment" {...a11yProps(0)} />
                    <Tab label="Comments" {...a11yProps(1)} />
                    <Tab label="Ticket History" {...a11yProps(2)} />
                </Tabs>
            </Box>
            {
                !isLoading && <React.Fragment>
                    <TabPanel value={value} index={0}>
                    <InputLabel  id="recipient">Recipient</InputLabel>
                        <Select
                        fullWidth
                          labelId="recipient"
                          id="recipient"
                          multiple
                          value={selectedRecipient}
                          label="Recipient"
                          onChange={handleRecipientChange}
                          defaultValue={selectedRecipient}
                        >
                          {
                            agents?.map((d, i) => {
                              return <MenuItem key={i} value={d.email}>{d.first_name} {d.last_name}</MenuItem>
                            })
                          }
                        </Select>
                        <br>
                        </br>
                        <br>
                        </br>
                        <MaterialEditor editorContent={editorContent} setEditorContent={setEditorContent} placeholder="Add Comment" />
                        <div className='d-flex justify-content-start'>
                            <LoadingButton color="secondary" variant="contained" onClick={saveComments}
                                sx={{ my: 2, top: "60", marginRight: "10px", marginTop: "5vh" }}>
                                Save
                            </LoadingButton>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {
                            commentsData?.map((f, index) => {
                                return <Fragment>
                                    <Grid container spacing={3}>
                                        <Grid item lg={1} md={1} sm={1} xs={12}>
                                            <Icon>comment</Icon>
                                        </Grid>
                                        <Grid item lg={11} md={11} sm={11} xs={12}>
                                            <div className="triangleMain">
                                                <div className="triangle">
                                                    <p><span style={{ fontWeight: "bold" }}>{f.createdBy.first_name + ' ' + f.createdBy.last_name}</span> commented  on {moment(f.createdAt).format('DD/MM/YYYY hh:mm A')}
                                                    </p>
                                                </div>
                                                <div className="triangleInnerContent">
                                                    <p>{f.plain_text}</p>
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>

                                </Fragment>
                            })
                        }
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        {
                            editData?.map((f, index) => {
                                return <div>
                                    <Icon>subdirectory_arrow_right</Icon>
                                    <label id={index}>{f.plain_text}  <b>{moment(f.createdAt).format('DD-MM-YYYY HH:mm')}</b></label>
                                </div>
                            })
                        }
                    </TabPanel>
                </React.Fragment>
            }

        </Box>
    );
}