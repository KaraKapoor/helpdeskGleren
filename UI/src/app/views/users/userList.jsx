import {
    Box,
    Fab,
    Icon,
    styled,
    Table,
    TablePagination,
  } from "@mui/material";
  import MaterialTable from "material-table";
  import "./userList.css";
  import { useEffect, useState } from "react";
import { getAllUsers } from "app/services/userService";
import moment from "moment";
import { Strings } from "config/strings";
  
  const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
  }));
  const UsersTable = styled(Table)(() => ({
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
        alignItems:'center',
        flex: 'initial',
        margin: '0.5rem 0',
    },
  }))
  
  const UsersList = ({ onEditClick, onCreateClick, setCurrentView }) => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
  
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };
  
    useEffect(() => {
        fetchUsersList()
    }, [page])
  
    const fetchUsersList = () => {
        getAllUsers(page, rowsPerPage).then((response) => {
            response?.data?.pagingData.map((data, i) => {
                Object.assign(data, { sno: rowsPerPage * page + i + 1 })
            })
            setData(response?.data?.pagingData)
            setTotalRecords(response.data.totalItems)
        })
    }
  
    return (
        <Box width="100%" overflow="auto">
            <Fab size="small" color="secondary" aria-label="Add" className="button addBtn" onClick={(event, rowData) => {
                onCreateClick && onCreateClick(rowData)
            }}>
                <Icon>add</Icon>
            </Fab>
            <UsersTable>
            <MaterialTable
                        title="Users"
                        columns={[
                            { title: 'User Email', field: 'email'},
                            { title: 'First Name', field: 'firstName'},
                            { title: 'Last Name', field: 'lastName'},
                            { title: 'Active', field: 'status'},
                            { title: 'Last Login Date', field: 'loginDate'}
                        ]}
                        data={data.map((e) => {
                            return {
                                userId: e.id,
                                email: e.email,
                                firstName: e.first_name,
                                lastName: e.last_name,
                                status: e.is_active,
                                projectId: e.id,
                                loginDate: moment(e.last_login_dt).format(Strings.DATE_FORMAT)
                            }
                        })}
                        actions={[
                            {
                                icon: 'edit',
                                tooltip: 'Edit User',
                                onClick: (event, rowData) => {
                                    onEditClick &&
                                        onEditClick(rowData.userId)
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
                          maxBodyHeight:"400px",
                          headerStyle: {
                              fontSize: '14px',
                              backgroundColor: '#222A45',
                              color:'white',
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
            </UsersTable>
  
  
        </Box>
    );
  };
  
  export default UsersList;
  