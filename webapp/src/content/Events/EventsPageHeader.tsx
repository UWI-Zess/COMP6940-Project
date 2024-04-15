import { Typography, Button, Grid } from '@mui/material';
import EventModal from '@/components/Modals/EventModal';


function EventsPageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          EVENTS
        </Typography>
        <Typography variant="subtitle2">
          Table with all events.
        </Typography>
      </Grid>
      <Grid item>
        <EventModal />
      </Grid>
    </Grid>
  );
}

export default EventsPageHeader;
