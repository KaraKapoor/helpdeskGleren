import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getTicketHistory } from 'app/services/ticketService';
import Swal from 'sweetalert2';
import { Icon } from '@mui/material';
import moment from 'moment';

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
    const [value, setValue] = React.useState(0);
    const [editData, setEditData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 2) {
            getTicketHistoryData(ticketId);
        }
    };

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
                        Item One
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Item Two
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