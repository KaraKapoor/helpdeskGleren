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
  
  const ProjectList = () => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage,setRowsPerPage] = useState(10)
  
    const handleChangePage =async (_, newPage) => {
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
        <Fab size="small" color="secondary" aria-label="Add" className="button">
            <Icon>add</Icon>
        </Fab>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Project Name</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{project.name}</TableCell>
                  <TableCell align="center">{project.is_active?"True":"False"}</TableCell>
                  <TableCell align="center">
                    <Fab size="small" color="secondary" aria-label="Edit" className="button">
                        <Icon>edit</Icon>
                    </Fab>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
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
  