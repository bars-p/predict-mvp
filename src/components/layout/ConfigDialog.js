import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';

export default function ConfigDialog(props) {
  const { open, onClose, title, item, setItem } = props;

  const handleClose = () => {
    onClose(false);
  };

  const handleSave = () => {
    onClose(true);
  };

  return (
    <div>
      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{sx: {minWidth: 400}}}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Default Speed: <strong>{item.defaultSpeed}</strong>
            {item.dayPeriodCoefficients.map(coefficient => (
              <div key={coefficient.fromTime}>
                From time: <strong>{coefficient.fromTime}</strong>, Value: <strong>{coefficient.value}</strong>
              </div>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}