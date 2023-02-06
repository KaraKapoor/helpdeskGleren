import {
    Box,
    Fab,
    Icon,
    styled,
    Table,
    TablePagination,
  } from "@mui/material";
  import MaterialTable from "material-table";
  import "./holidayList.css";
  import moment from "moment";
  import { Strings } from "config/strings";
  import { useEffect, useState } from "react";
  import { getAllHolidays } from "app/services/adminService";

  const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
  }));
  const HolidaysTable = styled(Table)(() => ({
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
    '& th:nth-of-type(3)': {
        width: '90px !important',
    },
    '& tfoot tr td div:nth-child(1)': {
        justifyContent: 'center',
        alignItems:'center',
        flex: 'initial',
        margin: '0.5rem 0',
    },
  }))
  
  const HolidaysList = ({ onEditClick, onCreateClick, setCurrentView }) => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
  
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };
  
    useEffect(() => {
        fetchHolidayList()
    }, [page])
  
    const fetchHolidayList = () => {
        getAllHolidays(page, rowsPerPage).then((response) => {
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
            <HolidaysTable>
            <MaterialTable
                        title="Holidays"
                        columns={[
                            { title: 'Holiday Name', field: 'holidayName'},
                            { title: 'Holiday Date', field: 'holidayDate'},
                            { title: 'Active', field: 'status'},
                            { title: 'Project', field:'project'}

                        ]}
                        data={data.map((e) => {
                            console.log(e)
                            return {
                                holidayName: e.holiday_name,
                                holidayDate : e.holiday_date!==null?moment(e.holiday_date).format(Strings.DATE_HOLIDAYS_FORMAT):"-",
                                status: e.is_active,
                                holidayId: e.id,
                                projectId: e.project_id,
                                project: e.project?.name
                            }
                        })}
                        actions={[
                            {
                                icon: 'edit',
                                tooltip: 'Edit Holiday',
                                onClick: (event, rowData) => {
                                    onEditClick &&
                                        onEditClick(rowData.holidayId)
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
            </HolidaysTable>
        </Box>
    );
  };
  
  export default HolidaysList;
  