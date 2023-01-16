import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';

export default function Info(props) {

  const { open, setOpen, severity, text } = props;
  
  const handleClose = () => {
    setOpen(false);
  };

  const getTitle = (severity) => {
    switch (severity) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning`';
      default:
        return 'Info';
    }
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={2000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        variant='filled'
      >
        <AlertTitle>
          {getTitle(severity)}
        </AlertTitle>
        {text}
      </Alert>
    </Snackbar>
  );
}