import { FC, ChangeEvent, useState } from 'react';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader, TextField, Grid
} from '@mui/material';

import BulkActions from './BulkActions';
import {YgoPairing} from "@/atoms/ygoRoundsAtom";

interface YgoPairingTableProps {
  ygoPairings?: YgoPairing[];
  myPairing?: YgoPairing;
}

interface Filters {
  name?: string;
}

const applyFilters = (
    cryptoOrders: YgoPairing[],
    filters: Filters
): YgoPairing[] => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;
    if (filters.name){
      const rowNames = cryptoOrder.player1.toUpperCase() + " " + cryptoOrder.player2.toUpperCase();
      switch (true) {
        case
        !rowNames.includes(filters.name.toUpperCase()):
          matches = false;
          break;
        default:
          // If neither condition is true, do nothing
          break;
      }
    }


    return matches;
  });
};

const applyPagination = (
    cryptoOrders: YgoPairing[],
    page: number,
    limit: number
): YgoPairing[] => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

const YgoPairingTable: FC<YgoPairingTableProps> = ({ ygoPairings, myPairing }) => {

  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
      []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(300);
  const [filters, setFilters] = useState<Filters>({
    name: null
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== '') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      name: value
    }));
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  let filteredCryptoOrders = ygoPairings;
  let paginatedCryptoOrders = ygoPairings;
  let selectedSomeCryptoOrders = null;
  let selectedAllCryptoOrders = null;
  const theme = useTheme();

  if (myPairing){

  } else if (ygoPairings && ygoPairings.length > 0) {
    filteredCryptoOrders = applyFilters(ygoPairings, filters);
    paginatedCryptoOrders = applyPagination(
        filteredCryptoOrders,
        page,
        limit
    );
    selectedSomeCryptoOrders =
        selectedCryptoOrders.length > 0 &&
        selectedCryptoOrders.length < ygoPairings.length;
    selectedAllCryptoOrders =
        selectedCryptoOrders.length === ygoPairings.length;
  }

  return (
      <Card>
        {selectedBulkActions && (
            <Box flex={1} p={2}>
              <BulkActions />
            </Box>
        )}
        {!selectedBulkActions && (
            <>
              {
                myPairing ? (
                    <></>
                ) : (
                    <CardHeader
                        action={
                          <Box>
                            <FormControl fullWidth variant="outlined">
                              <Grid item xs={12}>
                                <TextField
                                    value={filters.name || ''}
                                    onChange={handleSearchChange}
                                    id="event-search"
                                    label="Search D00list"
                                    type="search"
                                />
                              </Grid>
                            </FormControl>
                          </Box>
                        }
                        title={`Round Pairings`}
                    />
                )
              }
            </>
        )}
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Table</TableCell>
                <TableCell>D00list 1</TableCell>
                <TableCell>D00list 2</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                myPairing ? (
                    <>
                      <TableRow
                          hover
                          key={myPairing.table}
                          selected={true}
                      >
                        <TableCell>
                          <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="springgreen"
                              gutterBottom
                              noWrap
                          >
                            {myPairing.table}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="springgreen"
                              gutterBottom
                              noWrap
                          >
                            {myPairing.player1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="springgreen"
                              gutterBottom
                              noWrap
                          >
                            {myPairing.player2}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </>
                ) : (
                    <>
                      {paginatedCryptoOrders?.map((cryptoOrder) => {
                        const isCryptoOrderSelected = selectedCryptoOrders.includes(
                            cryptoOrder.table
                        );
                        return (
                            <TableRow
                                hover
                                key={cryptoOrder.table}
                                selected={isCryptoOrderSelected}
                            >
                              <TableCell>
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="text.primary"
                                    gutterBottom
                                    noWrap
                                >
                                  {cryptoOrder.table}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="text.primary"
                                    gutterBottom
                                    noWrap
                                >
                                  {cryptoOrder.player1}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="text.primary"
                                    gutterBottom
                                    noWrap
                                >
                                  {cryptoOrder.player2}
                                </Typography>
                              </TableCell>
                            </TableRow>
                        );
                      })}
                    </>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
        {
          myPairing ? (
              <Box hidden={true}>
                <TablePagination
                    component="div"
                    count={1}
                    rowsPerPageOptions={[1]}
                    onPageChange={()=>{}}
                    rowsPerPage={1}
                    page={page}
                />
              </Box>
          ) : <></>
        }
        {
          ygoPairings ? (
              <Box p={2}>
                <TablePagination
                    component="div"
                    count={filteredCryptoOrders?.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[50, 100, 200, 300, 500, 1000]}
                />
              </Box>
          ) : <></>
        }
      </Card>
  );
};


export default YgoPairingTable;
