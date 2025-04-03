import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { ExerciseTableHead } from '../exercise-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { ExerciseTableToolbar } from '../exercise-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import { ExerciseTableRow, ExerciseProps } from '../exercise-table-row';
import { getExercises } from 'src/components/api';
import { useAuth } from 'src/components/context/authStore';
import { useLocation } from 'react-router-dom';
import { ROLES } from 'src/components/Restrected';

// ----------------------------------------------------------------------

export function ExerciseView() {
  const table = useTable();
  const { user } = useAuth();

  const [filterName, setFilterName] = useState('');
  const [exercises, setExercises] = useState<ExerciseProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dataFiltered: ExerciseProps[] = applyFilter({
    inputData: exercises,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    setError('');

    const fitchExercises = async () => {
      try {
        const response = await getExercises(user?.id);
        setExercises(response as ExerciseProps[]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    try {
      fitchExercises();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [location.state?.refresh]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Exercises
        </Typography>
        {user?.role === ROLES.prof && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New exercise
          </Button>
        )}
      </Box>

      <Card>
        <ExerciseTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ExerciseTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={exercises.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    exercises.map((exercise) => exercise.id + '')
                  )
                }
                headLabel={[
                  { id: 'code', label: 'Code' },
                  { id: 'category', label: 'Concepts' },
                  { id: '', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ExerciseTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id + '')}
                      onSelectRow={() => table.onSelectRow(row.id + '')}
                      forTeacher={user?.role === ROLES.prof}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, exercises.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={exercises.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
