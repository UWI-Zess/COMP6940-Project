// components/QRCodeButtonModal.tsx

import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@mui/styles';
import QRCodeIcon from '@mui/icons-material/QrCode';
import Button from "@mui/material/Button"; // Import the QR code icon

interface QRCodeButtonModalProps {
  value: string;
}

const useStyles = makeStyles({
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  qrCode: {
    width: '100%', // Make the QR code responsive within its container
    maxWidth: '300px', // Adjust the maximum width of the QR code
  },
  dialogContent: {
    backgroundColor: 'white', // Set the background color to grey or your preferred color
  },
});

const QRCodeButtonModal: React.FC<QRCodeButtonModalProps> = ({ value }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <div>
        {/* Use IconButton with QRCodeIcon */}
        <Button variant="contained" onClick={handleOpen}>
          <QRCodeIcon /> {' '} QR Code
        </Button>
        {/*<IconButton onClick={handleOpen} aria-label="Open QR Code Modal">*/}
        {/*  <QRCodeIcon />*/}
        {/*</IconButton>*/}
        <Dialog
            open={open}
            // onClose={handleClose}
            aria-labelledby="qr-code-dialog"
            fullWidth
            // maxWidth="sm"
        >
          {/*<DialogTitle>QR Code</DialogTitle>*/}
          <DialogContent
              className={classes.dialogContent}
          >
            <div
                className={classes.qrCodeContainer}
            >
              <QRCode
                  value={value}
                  className={classes.qrCode}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
  );
};

export default QRCodeButtonModal;
