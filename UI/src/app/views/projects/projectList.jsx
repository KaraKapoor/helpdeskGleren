import {
    Box,
    Fab,
    Icon,
    IconButton,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
  } from "@mui/material";
import { getAllProjects } from "app/services/projectService";
import MaterialTable from "material-table";
import "./projectList.css";
  import { useEffect, useState } from "react";
  
  const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
      "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
      "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
  }));
  const ProjectsTable = styled(Table)(() => ({
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
  
  const ProjectList = () => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage,setRowsPerPage] = useState(10)
  
    const handleChangePage =async (_, newPage) => {
      setPage(newPage);
    };
    const onEditClick=async()=>{
      console.log("Edit Clicked");
    }
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
      fetchProjectList()
    };
    useEffect(() => {
        fetchProjectList()
    }, [page])

    const fetchProjectList = async() => {
        await getAllProjects(page,rowsPerPage).then(async(response) => {
            response?.data?.pagingData.map((data, i) => {
                Object.assign(data, { sno: rowsPerPage * page + i + 1 })
            })
            setData(response?.data?.pagingData)
            setTotalRecords(response.data.totalItems)
        })
    }   
  
    return (
      <Box width="100%" overflow="auto">
        <Fab size="small" color="secondary" aria-label="Add" className="button addBtn">
            <Icon>add</Icon>
        </Fab>
        <StyledTable>
          <ProjectsTable>
          <MaterialTable
                            title="Projects"
                            columns={[
                                { title: 'Project Name', field: 'projectName', cellStyle: { wordBreak: "break-word" } },
                                { title: 'Status', field: 'status', cellStyle: { wordBreak: "break-word" } }
                            ]}
                            data={data.map((e) => {
                                return {
                                    projectName: e.name,
                                    status: e.is_active
                                }
                            })}
                            actions={[
                                {
                                    icon: 'edit',
                                    tooltip: 'Edit Project',
                                    onClick: (event, rowData) => {
                                        onEditClick &&
                                            onEditClick(rowData.propertyId)
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
                                headerStyle: {
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    textAlign: 'left',
                                },
                                cellStyle: {
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    textAlign: 'left',
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
          </ProjectsTable>

        </StyledTable>
  
        <TablePagination
          sx={{ px: 2 }}
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={totalRecords}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
        />
      </Box>
    );
  };
  
  export default ProjectList;
  