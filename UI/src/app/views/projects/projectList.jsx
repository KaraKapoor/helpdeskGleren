import {
  Box,
  Fab,
  Icon,
  styled,
  Table,
  TablePagination,
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
      borderBottom: "1px solid rgba(224, 224, 224, 1)",
  },
  '& td:first-of-type': {
      paddingLeft: '16px !important',
  },
  '& th:nth-of-type(3)': {
      width: '90px !important',
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

const ProjectList = ({ onEditClick, onCreateClick, setCurrentView }) => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (_, newPage) => {
      setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
      fetchProjectList()
  };
  useEffect(() => {
      fetchProjectList()
  }, [page])

  const fetchProjectList = () => {
      getAllProjects(page, rowsPerPage).then((response) => {
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
          <ProjectsTable>
          <MaterialTable
                      title="Projects"
                      columns={[
                          { title: 'Project Name', field: 'projectName'},
                          { title: 'Active', field: 'status'}
                      ]}
                      data={data.map((e) => {
                          return {
                              projectName: e.name,
                              status: e.is_active,
                              projectId: e.id
                          }
                      })}
                      actions={[
                          {
                              icon: 'edit',
                              tooltip: 'Edit Project',
                              onClick: (event, rowData) => {
                                  onEditClick &&
                                      onEditClick(rowData.projectId)
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
          </ProjectsTable>


      </Box>
  );
};

export default ProjectList;
