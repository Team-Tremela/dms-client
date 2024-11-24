import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

// import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { BillTableRow } from '../bill-table-row';
import { BillTableHead } from '../bill-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { BillTableToolbar } from '../bill-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../bill-table-row';

// ----------------------------------------------------------------------
type Dealer = {
  id: string;
  name: string;
  dealer_id: string;
  location: string;
  email: string;
  phone_number: string;
  aadhar_card: string;
  pan: string;
  gst: string;
  createdAt: string;
  updatedAt: string;
};

export function BillView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const [loading, setLoading] = useState(true); // Add loading state
  const [dealer, setDealer] = useState<Dealer[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const dataFiltered: Dealer[] = applyFilter({
    inputData: dealer,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  // Define fetchData function
  const fetchData = async () => {
    setLoading(true);
    const apiUrl = 'https://vlmtrs.onrender.com/v1/dealer/fetch-all';
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json(); // Extract error data
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data = await response.json();
      setDealer(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  },[]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Dealers
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Stock
        </Button>
      </Box>

      <Card>
        <BillTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />
        {loading ? ( // Show loader if data is still being fetched
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            {errorMessage ? (
              <Typography color="error">{errorMessage}</Typography> // Error message
            ) : (
              <CircularProgress /> // Loader
            )}
          </Box>
        ) : (
          <>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <BillTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={dealer.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dealer.map((dealers) => dealers.id)
                      )
                    }
                    headLabel={[
                      { id: 'DealerID', label: 'Dealer Id' },
                      { id: 'Name', label: 'Name' },
                      { id: 'Location', label: 'Location' },
                      { id: 'Email', label: 'Email' },
                      { id: 'PhoneNumber', label: 'Phone Number' },
                      { id: 'AadharCard', label: 'Aadhar Card' },
                      { id: 'PAN', label: 'PAN' },
                      { id: 'GST', label: 'GST' },
                      { id: 'CreatedAt', label: 'Created  At' },
                      { id: 'UpdatedAt', label: 'Updated At' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <BillTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                        />
                      ))}

                    <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dealer.length)}
                    />

                    {notFound && <TableNoData searchQuery={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              component="div"
              page={table.page}
              count={dealer.length}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          </>
        )}
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
