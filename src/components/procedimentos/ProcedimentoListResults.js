import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  IconButton
} from '@material-ui/core';
import {Delete, Edit} from '@material-ui/icons';

const ProcedimentoListResults = ({ procedimentos, openHandleEdit, openHandleDelete}) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = ( newPage) => {
    setPage(newPage);
  };

  return (
    <>
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Paciente
                </TableCell>
                <TableCell>
                  Médico
                </TableCell>
                <TableCell>
                  Procedimento
                </TableCell>
                <TableCell>
                  Local
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Valor
                </TableCell>
                <TableCell>
                  Esteira
                </TableCell>
                <TableCell>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {procedimentos.slice(0, limit).map((procedimento) => (
                <TableRow
                  hover
                  key={procedimento.id}
                >
                  <TableCell>
                    {procedimento.nome_paciente}
                  </TableCell>
                  <TableCell>
                    {procedimento.nome_medico}
                  </TableCell>
                  <TableCell>
                    {procedimento.nome_procedimento}
                  </TableCell>
                  <TableCell>
                    {procedimento.nome_local}
                  </TableCell>
                  <TableCell>
                    {procedimento.nome_status}
                  </TableCell>
                  <TableCell>
                    {procedimento.valor}
                  </TableCell>
                  <TableCell>
                    {procedimento.desc_esteira}
                  </TableCell>
                  <TableCell>                  
                    <IconButton aria-label="editar" color="primary" onClick={() => openHandleEdit(procedimento)}>
                      <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" color="secondary" onClick={() => openHandleDelete( procedimento.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={procedimentos.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
    </>
  );
};

ProcedimentoListResults.propTypes = {
  procedimentos: PropTypes.array.isRequired
};

export default ProcedimentoListResults;
