import {
    Box,
    Fab,
    Grid,
    Icon,
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
import { myTickets } from "app/services/ticketService";

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

const MyTickets = ({ setCurrentView }) => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        fetchMyTickets()
    }, [page])

    const fetchMyTickets = (search) => {
        let queryParam = `?page=${page}&size=${rowsPerPage}`
        if (search !== undefined) {
            queryParam = queryParam + `&searchParam=${search}`
        }
        myTickets(queryParam).then((response) => {
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

    return (
        <Box width="100%" overflow="auto">
            <form className="p-2" >
                <Grid container spacing={2}>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <TextField id="searchTicket" onChange={handleSearchChange} label="Search Tickets" variant="standard" />
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>

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
