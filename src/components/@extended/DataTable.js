import {useState} from 'react';
import PropTypes from 'prop-types';
import {
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Table,
    Box,
    CircularProgress,
} from '@mui/material';

const DataTable = ({columns,
                       rows,
                       rowsPerPageOptions = [10, 25, 100],
                       isLoading,
                       rowClick})=>{

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align ? column.align : 'center'}
                                    style={{ width: column.width }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            !isLoading ? rows && rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover
                                              tabIndex={-1}
                                              key={row.id}
                                              onClick={rowClick ? e=>rowClick(e,row) : ()=>{}}
                                              style= {{cursor: 'pointer'}}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id}
                                                           align={column.align ? column.align : 'center'}>
                                                    {column.render
                                                        ? column.render(row)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            }) :
                            <TableRow>
                                <TableCell align="center" colSpan={6}>
                                    <Box sx={{py: 3, minHeight: 560}}>
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={rows ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    )
}

export default DataTable

DataTable.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    rowsPerPageOptions: PropTypes.array,
    isLoading: PropTypes.bool,
    rowClick: PropTypes.func
};
