import { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import EventForm from '@/components/forms/EventForm';
import { Close } from '@mui/icons-material';
import useAppUser from "@/hooks/useAppUser";
import FullScreenSpinner from "@/components/Spinners/FullScreenSpinner";
import Badge from "@mui/material/Badge";

interface EventModalProps {
}

const EventModal: FC<EventModalProps> = ( ) => {
  const {appUser} = useAppUser();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (appUser){
    if (appUser.verified){
      return (
          <div>
            <Button
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
                onClick={handleClickOpen}
            >
              Create Event
            </Button>
            <Dialog  open={open} maxWidth="md" fullWidth>
              <DialogTitle>Event Creation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Fill out the form below to create the event. The created event can then be shared!
                </DialogContentText>
                <EventForm />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </div>
      );
    } else {
      return <div>
        <Badge badgeContent={"PRO"} color="error">
          <Button
              sx={{ mt: { xs: 2, md: 0 } }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={handleClickOpen}
              // disabled={true}
          >
            Create Event
          </Button>
        </Badge>
        <Dialog  open={open} maxWidth="md" fullWidth>
          <DialogTitle>Event Creation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please upgrade your account to get access to the event creation screen!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Back</Button>
          </DialogActions>
        </Dialog>
      </div>
    }
  } else {
    return <FullScreenSpinner />
  }


};

export default EventModal;
