import {
    Box,
    Fab,
    Button,
    FormControl,
    Grid,
    Icon,
    InputLabel,
    MenuItem,
    Select,
    styled,
    Tooltip,
    Table,
    TablePagination,
    TextField,
} from "@mui/material";
import MaterialTable from "material-table";
import "./ticketsList.css";
import { useEffect, useState } from "react";
import moment from "moment";
import { Strings } from "config/strings";
import { getFixVersionByProject, myTickets } from "app/services/ticketService";
import { getMasterDropdownData } from "app/services/adminService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
    '& td:first-of-type': {
        paddingLeft: '16px !important',
    },
    // '& th:nth-of-type(8)': {
    //     width: '90px !important',
    // },
    '& th:first-of-type': {
        paddingLeft: '16px !important',
    },
    '& tfoot tr td div:nth-child(1)': {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 'initial',
        margin: '0.5rem 0',
    },
    "th:last-child": {
        width: "55px !important",
      }
}))

const MyTickets = ({ setCurrentView }) => {
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
    const [selectedFixVersion, setSelectedFixVersion] = useState();
    const [selectedDueDate, setSelectedDueDate] = useState();
    const [selectedOverdue, setSelectedOverdue] = useState();
    const [status, setStatus] = useState([]);
    const [projects, setProjects] = useState([]);
    const [assignees, setAssignee] = useState([]);
    const [reviewedBy, setReviewedBy] = useState([]);
    const [fixverions, setFixverions] = useState([]);
    const [handfixverions, sethandFixverions] = useState([]);

    const navigate = useNavigate();

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const refreshPage = () => {
        fetchMyTickets();
      };
    const newWindow = (id) => {
        window.open(`/view-ticket/${id}`)     
    }

    useEffect(() => {
        fetchMyTickets()
    }, [page, selectedStatus, selectedProject, selectedAssignee, selectedFixVersion,handfixverions, selectedDueDate, selectedOverdue, selectedReviewedBy, selectedResolvedBy, selectedTestedBy])

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
            queryParam = queryParam + `&dueDate=${selectedDueDate}`
        }
        if (handfixverions) {
            queryParam = queryParam + `&fixVersion=${handfixverions}`;
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
        if (selectedTestedBy.length > 0) {
            queryParam = queryParam + `&testedBy=${selectedTestedBy.toString()}`
        }
        myTickets(queryParam).then((response) => {
            response?.pagingData.map((data, i) => {
                Object.assign(data, { sno: rowsPerPage * page + i + 1 })
            })
            setData(response?.pagingData)
            setTotalRecords(response.totalItems)
            if (totalRecords !== response.totalItems) {
                setPage(0);
            }
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
        setSelectedProject(event.target.value);
    }
    const handleAssigneeChange = (event) => {
        setSelectedAssignee(event.target.value);
    }
    const handleDueDateChange = (event) => {
        setSelectedDueDate(event.target.value);
    }
    const handleFixVersionChange = (event) => {
        sethandFixverions(event.target.value);
      };
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
            }
        })
    }, [])
    useEffect(()=>{
            if(selectedProject){
                getFixVersionByProject({project_id:selectedProject}).then((data)=>{
                  setFixverions(data?.data)
                })
              }
      },[selectedProject])
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
                                    status?.filter((data)=>data.is_active).map((d, i) => {
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
                                    projects?.filter((data)=>data.is_active).map((d, i) => {
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
                                    assignees?.filter((data)=>data.is_active).map((d, i) => {
                                        return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                    <FormControl fullWidth>
                    <InputLabel  id="fixVersion">
                          Fix version
                        </InputLabel>

                      <Select
                        fullWidth
                        size="large"
                        name="fixVersion"
                        type="text"
                        multiple
                        label="Fix Version"
                        variant="outlined"
                        value={handfixverions}
                        onChange={(e)=>handleFixVersionChange(e)}
                        sx={{ mb: 1.5 }}
                      >
                        {fixverions?.filter(data=>data.is_active)?.map((d, i) => {
                            return (
                              <MenuItem key={i} value={d.id}>
                                {d.fix_version}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      </Grid>
                    {/* <Grid item lg={2} md={2} sm={12} xs={12}>
                        <TextField fullWidth size="large" name="fixVersion" type="text" label="Fix Version"
                            variant="outlined" value={selectedFixVersion}
                            onChange={handleFixVersionChange} sx={{ mb: 1.5 }} />

                            
                    // </Grid> */}
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <TextField fullWidth size="large" name="dueDate" type="date" label="Due Date"
                            variant="outlined" value={selectedDueDate}
                            onChange={handleDueDateChange} sx={{ mb: 1.5 }} InputLabelProps={{ shrink: true }}  />
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
                                    reviewedBy?.filter((data)=>data.is_active).map((d, i) => {
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
                                    reviewedBy?.filter((data)=>data.is_active).map((d, i) => {
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
                                    reviewedBy?.filter((data)=>data.is_active).map((d, i) => {
                                        return <MenuItem key={i} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <Button
                            variant="contained"
                            style={{ height: "100%", width: "100%" }}
                            onClick={refreshPage}
                        >
                            Refresh <Icon sx={{ ml: 1.5 }}>refresh</Icon>
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <MyTicketsTable>
                <MaterialTable
                    title="MyTickets"
                    columns={[
                        { title: "Ticket No", field: "id", cellStyle: { width: "9%" } },
                        { title: "Status", field: "status", cellStyle: { width: "8%", wordBreak: "break-word" } },
                        { title: "Summary", field: "summary", cellStyle: { width: "30%", wordBreak: "break-word" } },
                        { title: "Project", field: "project", cellStyle: { width: "13%", wordBreak: "break-word" } },
                        { title: "Priority", field: "priority", cellStyle: { width: "7%" } },
                        { title: "Category", field: "category", cellStyle: { width: "11%" } },
                        { title: "Overdue", field: "overdue", cellStyle: { width: "7%" } },
                        { title: "Created At ", field: "createdAt", cellStyle: { width: "15%" } },
                    ]}
                    data={data.map((e) => {
                        return {
                            id: <a href="#" onClick={()=>newWindow(e.id)} style={{cursor:"pointer"}}>{e.id}</a>,
                            status:  <Tooltip title={e.status.name}><p className="status">{e.status.name}</p></Tooltip> ,
                            summary: e.issue_details,
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
                                navigate(`/view-ticket/${rowData?.id?.props?.children}`);
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

export default MyTickets;
