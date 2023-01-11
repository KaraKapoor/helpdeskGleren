import {
    Box,
    Fab,
    Icon,
    styled,
    Table,
    TablePagination,
  } from "@mui/material";
  import MaterialTable from "material-table";
  import "./escalationList.css";
  import { useEffect, useState } from "react";
import { getAllEscalations } from "app/services/adminService";
import { Strings } from "config/strings";
import moment from "moment";
  
  const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
  }));
  const EscalationsTable = styled(Table)(() => ({
    marginTop: '20px',
    whiteSpace: 'pre',
    "thead":{
        backgroundColor:"rgb(34, 42, 69)"
      },
      "thead > tr":{
        backgroundColor:"rgb(34, 42, 69)"
      },
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
    '& th:nth-of-type(5)': {
        width: '90px !important',
    },
    '& tfoot tr td div:nth-child(1)': {
        justifyContent: 'center',
        alignItems:'center',
        flex: 'initial',
        margin: '0.5rem 0',
    },
  }))
  
  const EscalationsList = ({ onEditClick, onCreateClick, setCurrentView }) => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
  
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };
  
    useEffect(() => {
        fetchEscalationList()
    }, [page])
  
    const fetchEscalationList = () => {
        getAllEscalations(page, rowsPerPage).then((response) => {
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
            <EscalationsTable>
            <MaterialTable
                        title="Escalations"
                        columns={[
                            { title: 'Department Name', field: 'departmentName'},
                            { title: 'Active', field: 'status'},
                            { title: 'Created At', field: 'createdAt'},
                            { title: 'Updated At', field: 'updatedAt'},
                        ]}
                        data={data.map((e) => {
                            return {
                                id: e.id,
                                departmentName: e?.department?.name,
                                l1Id: e.l1_id,
                                status: e.is_active,
                                createdAt: moment(e.createdAt).format(Strings.DATE_FORMAT),
                                updatedAt: moment(e.updatedAt).format(Strings.DATE_FORMAT)
                            }
                        })}
                        actions={[
                            {
                                icon: 'edit',
                                tooltip: 'Edit Escalations',
                                onClick: (event, rowData) => {
                                    onEditClick &&
                                        onEditClick(rowData.id)
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
            </EscalationsTable>
  
  
        </Box>
    );
  };
  
  export default EscalationsList;
  