import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
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

import Label from '@/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import BulkActions from './BulkActions';
import AppUtil from "@/AppUtil";
import {EventStatus, YgoEvent} from "@/atoms/ygoEventsAtom";

interface EventsTableTableProps {
  className?: string;
  ygoEvents: YgoEvent[];
}

interface Filters {
  status?: EventStatus;
  name?: string;
  // todo add tournament organizer search/ddl
}

const getStatusLabel = (cryptoOrderStatus: EventStatus): JSX.Element => {
  const map = {
    cancelled: {
      text: 'Cancelled',
      color: 'error'
    },
    finished: {
      text: 'Finished',
      color: 'success'
    },
    upcoming: {
      text: 'Upcoming',
      color: 'warning'
    },
    ongoing: {
      text: 'Ongoing',
      color: 'primary'
    }
  };

  if (cryptoOrderStatus){
    const { text, color }: any = map[cryptoOrderStatus];
    return <Label color={color}>{text}</Label>;
  }

};

const applyFilters = (
  cryptoOrders: YgoEvent[],
  filters: Filters
): YgoEvent[] => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;
    switch (true) {
      case filters.status && cryptoOrder.status !== filters.status:
        matches = false;
        break;
      case filters.name && !cryptoOrder.name.toUpperCase().includes(filters.name.toUpperCase()):
        matches = false;
        break;
      default:
        // If neither condition is true, do nothing
        break;
    }

    return matches;
  });
};

const applyPagination = (
  cryptoOrders: YgoEvent[],
  page: number,
  limit: number
): YgoEvent[] => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

const EventsTable: FC<EventsTableTableProps> = ({ ygoEvents }) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
    name: null
  });

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'upcoming',
      name: 'Upcoming'
    },
    {
      id: 'ongoing',
      name: 'Ongoing'
    },
    {
      id: 'finished',
      name: 'Finished'
    },
    {
      id: 'cancelled',
      name: 'Cancelled'
    }
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

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

  const filteredCryptoOrders = applyFilters(ygoEvents, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < ygoEvents.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders.length === ygoEvents.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <>
          <CardHeader
            action={
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Grid item xs={12}>
                    <Select
                      value={filters.status || "all"}
                      onChange={handleStatusChange}
                      label="Status"
                      autoWidth
                    >
                      {statusOptions.map((statusOption) => (
                        <MenuItem key={statusOption.id} value={statusOption.id}>
                          {statusOption.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextField
                      value={filters.name || ''}
                      onChange={handleSearchChange}
                      id="event-search"
                      label="Search Events"
                      type="search"
                    />
                  </Grid>
                </FormControl>
              </Box>
            }
            title="Recent Events"
          />
        </>
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {/*<TableCell>Description</TableCell>*/}
              {/*<TableCell>Organizer</TableCell>*/}
              <TableCell>Venue</TableCell>
              <TableCell>Entry Fee</TableCell>
              <TableCell>Type</TableCell>
              {/*<TableCell align="right">Amount</TableCell>*/}
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders.map((cryptoOrder) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                cryptoOrder.id
              );
              return (
                <TableRow
                  hover
                  key={cryptoOrder.id}
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
                      {cryptoOrder.name}
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
                      {cryptoOrder.venue}
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
                      ${cryptoOrder.cost}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {cryptoOrder.type}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {
                      AppUtil.printDate(cryptoOrder.startDate)
                    }
                  </TableCell>
                  <TableCell align="right">
                    {getStatusLabel(cryptoOrder.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="See Details" arrow>
                      <IconButton
                          href={`/events/${cryptoOrder.id}`}
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {/*<Tooltip title="Delete Order" arrow>*/}
                    {/*  <IconButton*/}
                    {/*    sx={{*/}
                    {/*      '&:hover': { background: theme.colors.error.lighter },*/}
                    {/*      color: theme.palette.error.main*/}
                    {/*    }}*/}
                    {/*    color="inherit"*/}
                    {/*    size="small"*/}
                    {/*  >*/}
                    {/*    <DeleteTwoToneIcon fontSize="small" />*/}
                    {/*  </IconButton>*/}
                    {/*</Tooltip>*/}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredCryptoOrders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

EventsTable.propTypes = {
  ygoEvents: PropTypes.array.isRequired
};

EventsTable.defaultProps = {
  ygoEvents: []
};

export default EventsTable;
