import {
    Box,
    Fab,
    FormControl,
    Grid,
    Icon,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    styled,
    Table,
    TablePagination,
    TextField,
} from "@mui/material";
import MaterialTable from "material-table";
import "./ticketsList.css";
import { useEffect, useState } from "react";
import moment from "moment";
import { Strings } from "config/strings";
import { allTickets } from "app/services/ticketService";
import { getMasterDropdownData } from "app/services/adminService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import RefreshIcon from '@mui/icons-material/Refresh';

const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
}));
const MyTicketsTable = styled(Table)(() => ({
    marginTop: '20px',
    whiteSpace: 'pre',
    '& small': {
        height: 15,
        width: 50,
        borderRadius: 500,
        boxShadow:
            '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
    },
    '& td': {
        borderBottom: 'none',
    },
    '& td:first-of-type': {
        paddingLeft: '16px !important',
    },
    '& th:first-of-type': {
        paddingLeft: '16px !important',
    },
    '& tfoot tr td div:nth-child(1)': {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 'initial',
        margin: '0.5rem 0',
    },
}))

const AllTickets = ({ setCurrentView }) => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedProject, setSelectedProject] = useState([]);
    const [selectedAssignee, setSelectedAssignee] = useState([]);
    const [selectedReviewedBy, setSelectedReviewedBy] = useState([]);
    const [selectedTestedBy, setSelectedTestedBy] = useState([]);
    const [selectedResolvedBy, setSelectedResolvedBy] = useState([]);
    const [selectedReportedBy, setSelectedReportedBy] = useState([]);
    const [selectedFixVersion, setSelectedFixVersion] = useState();
    const [selectedDueDate, setSelectedDueDate] = useState();
    const [selectedOverdue, setSelectedOverdue] = useState();
    const [status, setStatus] = useState([]);
    const [projects, setProjects] = useState([]);
    const [assignees, setAssignee] = useState([]);
    const [reviewedBy, setReviewedBy] = useState([]);
    const navigate = useNavigate()

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const refreshPage=()=> {
        fetchMyTickets();
    }

    useEffect(() => {
        fetchMyTickets()
    }, [page, selectedStatus, selectedProject, selectedAssignee, selectedFixVersion, selectedDueDate, selectedOverdue, selectedReviewedBy, selectedResolvedBy, selectedTestedBy, selectedReportedBy])

    const fetchMyTickets = (search) => {
        let queryParam = `?page=${page}&size=${rowsPerPage}`
        if (search !== undefined) {
            queryParam = queryParam + `&searchParam=${search}`
        }
        if (selectedStatus.length > 0) {
            queryParam = queryParam + `&statusId=${selectedStatus.toString()}`
        }
        if (selectedProject.length > 0) {
            queryParam = queryParam + `&projectId=${selectedProject.toString()}`
        }
        if (selectedAssignee.length > 0) {
            queryParam = queryParam + `&assigneeId=${selectedAssignee.toString()}`
        }
        if (selectedFixVersion) {
            queryParam = queryParam + `&fixVersion=${selectedFixVersion}`
        }
        if (selectedDueDate) {
            let date = new Date(selectedDueDate + ' 00:00:00');
            date = date.toISOString();
            queryParam = queryParam + `&dueDate=${date}`
        }
        if (selectedOverdue != null && selectedOverdue !== undefined) {
            queryParam = queryParam + `&overdue=${selectedOverdue}`
        }
        if (selectedReviewedBy.length > 0) {
            queryParam = queryParam + `&reviewedBy=${selectedReviewedBy.toString()}`
        }
        if (selectedResolvedBy.length > 0) {
            queryParam = queryParam + `&resolvedBy=${selectedResolvedBy.toString()}`
        }
        if (selectedReportedBy.length > 0) {
            queryParam = queryParam + `&reportedBy=${selectedReportedBy.toString()}`
        }
        if (selectedTestedBy.length > 0) {
            queryParam = queryParam + `&testedBy=${selectedTestedBy.toString()}`
        }
        allTickets(queryParam).then((response) => {
            response?.pagingData.map((data, i) => {
                Object.assign(data, { sno: rowsPerPage * page + i + 1 })
            })
            setData(response?.pagingData)
            setTotalRecords(response.totalItems)
        })
    }
    const handleSearchChange = (event) => {
        if (event?.target?.value) {
            fetchMyTickets(event.target.value);
        } else {
            fetchMyTickets();
        }

    }
    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    }
    const handleProjectChange = (event) => {
        if (event.target.value.length <= 0) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Atleast One Project is required",
                showCloseButton: true,
                showConfirmButton: false,
                width: 400,
            })
        }
        setSelectedProject(event.target.value);
    }
    const handleAssigneeChange = (event) => {
        setSelectedAssignee(event.target.value);
    }
    const handleFixVersionChange = (event) => {
        setSelectedFixVersion(event.target.value);
    }
    const handleDueDateChange = (event) => {
        setSelectedDueDate(event.target.value);
    }
    const onChangeOverdue = (event) => {
        setSelectedOverdue(event.target.value);
    }
    const handleReviewedBy = (event) => {
        setSelectedReviewedBy(event.target.value);
    }
    const handleTestedBy = (event) => {
        setSelectedTestedBy(event.target.value);
    }
    const handleResolvedBy = (event) => {
        setSelectedResolvedBy(event.target.value);
    }
    const handleReportedBy = (event) => {
        setSelectedReportedBy(event.target.value);
    }
    useEffect(() => {
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
                setStatus(resp?.data?.activeStatus);
                setProjects(resp?.data?.currentUserProjects);
                let agents = resp?.data?.agents;
                let users = resp?.data?.users;
                let combinedArray = agents.concat(users);
                setAssignee(combinedArray);
                setReviewedBy(resp?.data?.agents)
                if (resp?.data?.currentUserProjects.length > 0) {
                    setSelectedProject([resp?.data?.currentUserProjects[0].id]);
                }

            }
        })
    }, [])

    return (
        <Box width="100%" overflow="auto">
            <form className="p-2" >
                <Grid container spacing={2}>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <TextField id="searchTicket" onChange={handleSearchChange} label="Search Tickets" variant="standard" />
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="status">Status</InputLabel>
                            <Select
                                labelId="status"
                                id="status"
                                multiple
                                value={selectedStatus}
                                label="Status"
                                onChange={handleStatusChange}
                                defaultValue={selectedStatus}
                            >
                                {
                                    status?.map((d, i) => {
                                        return <MenuItem key={i} value={d.id}>{d.name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="project">Project</InputLabel>
                            <Select
                                labelId="project"
                                id="project"
                                multiple
                                value={selectedProject}
                                label="Project"
                                onChange={handleProjectChange}
                                defaultValue={selectedProject}
                            >
                                {
                                    projects?.map((d, i) => {
                                        return <MenuItem key={i} value={d.id}>{d.name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="assignee">Assignee</InputLabel>
                            <Select
                                labelId="assignee"
                                id="assignee"
                                multiple
                                value={selectedAssignee}
                                label="Assignee"
                                onChange={handleAssigneeChange}
                                defaultValue={selectedAssignee}
                            >
                                {
                                    assignees?.map((d, i) => {
                                        return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <TextField fullWidth size="large" name="fixVersion" type="text" label="Fix Version"
                            variant="outlined" value={selectedFixVersion}
                            onChange={handleFixVersionChange} sx={{ mb: 1.5 }} />
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <TextField fullWidth size="large" name="dueDate" type="date" label="Due Date"
                            variant="outlined" value={selectedDueDate}
                            onChange={handleDueDateChange} sx={{ mb: 1.5 }} />
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="overdue">Overdue</InputLabel>
                            <Select
                                labelId="overdue"
                                id="overdue"
                                value={selectedOverdue}
                                label="Overdue"
                                onChange={onChangeOverdue}
                            >
                                <MenuItem value={true}>YES</MenuItem>
                                <MenuItem value={false}>NO</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="reviewedBy">Reviewed By</InputLabel>
                            <Select
                                labelId="reviewedBy"
                                id="reviewedBy"
                                multiple
                                value={selectedReviewedBy}
                                label="Reviewed By"
                                onChange={handleReviewedBy}
                                defaultValue={selectedReviewedBy}
                            >
                                {
                                    reviewedBy?.map((d, i) => {
                                        return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="testedBy">Tested By</InputLabel>
                            <Select
                                labelId="testedBy"
                                id="testedBy"
                                multiple
                                value={selectedTestedBy}
                                label="Tested By"
                                onChange={handleTestedBy}
                            >
                                {
                                    reviewedBy?.map((d, i) => {
                                        return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="resolvedBy">Resolved By</InputLabel>
                            <Select
                                labelId="resolvedBy"
                                id="resolvedBy"
                                multiple
                                value={selectedResolvedBy}
                                label="Resolved By"
                                onChange={handleResolvedBy}
                            >
                                {
                                    reviewedBy?.map((d, i) => {
                                        return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="reportedBy">Reported By</InputLabel>
                            <Select
                                labelId="reportedBy"
                                id="reportedBy"
                                multiple
                                value={selectedReportedBy}
                                label="Reported By"
                                onChange={handleReportedBy}
                            >
                                {
                                    reviewedBy?.map((d, i) => {
                                        return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <InputLabel> Refresh
                        <IconButton onClick={refreshPage}>
                            <RefreshIcon />
                        </IconButton>
                        </InputLabel>
                    </Grid>
                </Grid>
            </form>

            <MyTicketsTable>
                <MaterialTable
                    title="MyTickets"
                    columns={[
                        { title: 'Ticket No', field: 'id' },
                        { title: 'Status', field: 'status' },
                        { title: 'Project', field: 'project' },
                        { title: 'Priority', field: 'priority' },
                        { title: 'Category', field: 'category' },
                        { title: 'Overdue', field: 'overdue' },
                        { title: 'Created At ', field: 'createdAt' },
                    ]}
                    data={data.map((e) => {
                        return {
                            id: e.id,
                            status: e.status.name,
                            priority: e.priority,
                            project: e.project.name,
                            category: e.category,
                            overdue: e.is_overdue == 0 ? 'NO' : 'YES',
                            createdAt: moment(e.createdAt).format(Strings.DATE_TIME_FORMAT),
                        }
                    })}
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'View Ticket',
                            onClick: (event, rowData) => {
                                navigate(`/view-ticket/${rowData.id}`);

                            },
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        emptyRowsWhenPaging: false,
                        showTitle: false,
                        search: false,
                        toolbar: false,
                        pageSizeOptions: [],
                        pageSize: rowsPerPage,
                        tableLayout: 'auto',
                        maxBodyHeight: "400px",
                        sorting: false,
                        headerStyle: {
                            fontSize: '14px',
                            backgroundColor: '#222A45',
                            color: 'white',
                            fontWeight: '700',
                        },



                    }}
                    components={{
                        Pagination: (props) => (
                            <TablePagination
                                {...props}
                                count={totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                labelDisplayedRows={() => ''}
                            />
                        ),
                    }}
                />
            </MyTicketsTable>


        </Box>
    );
};

export default AllTickets;
