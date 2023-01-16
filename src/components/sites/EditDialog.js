import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';

export default function EditDialog(props) {
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
        PaperProps={{sx: {width: 700}}}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={9}>
              <TextField
                autoFocus
                margin="dense"
                id="site"
                label="Site Name"
                type="text"
                variant="standard"
                fullWidth
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField 
                margin="dense"
                id="short"
                label="Site Code"
                type="text"
                variant="standard"
                value={item.short}
                onChange={(e) => setItem({ ...item, short: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}