import { Typography, Grid } from '@mui/material';

function YgoPairingPageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          PAIRINGS
        </Typography>
        <Typography variant="subtitle2">
          Look for your name/cossy id!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default YgoPairingPageHeader;
