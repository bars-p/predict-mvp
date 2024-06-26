import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { width } from '@mui/system';

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
        PaperProps={{sx: {minWidth: 700 },}}
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <Typography sx={{ mt: 3}}>
                {item.direction}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ mt: 3}}>
                {item.sites}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <TextField 
                margin="dense"
                id="speed"
                label="Free Speed"
                type="number"
                min="0"
                variant="standard"
                value={item.speed}
                onChange={(e) => setItem({ ...item, speed: e.target.value })}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField 
                margin="dense"
                id="short"
                label="Length (m)"
                type="number"
                min="0"
                variant="standard"
                value={item.length}
                onChange={(e) => setItem({ ...item, length: e.target.value })}
                inputProps={{ min: 0 }}
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