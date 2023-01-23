import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { border, Box } from '@mui/system';

export default function HeadwaysDialog(props) {
  const { open, onClose, title, item, setItem } = props;

  const [local, setLocal] = useState({ fromTime: '00:00', value: 0 });

  const handleClose = () => {
    onClose(false);
    setLocal({ fromTime: '00:00', value: 0 });
  };

  const handleSave = () => {
    onClose(true);
    setLocal({ fromTime: '00:00', value: 0 });
  };

  const setHeadway = () => {
    const headway = item.headways.find((hdw) => hdw.fromTime == local.fromTime);
    if (headway) {
      setItem({
        ...item,
        headways: [
          ...item.headways.map((hdw) => {
            if (hdw.fromTime == local.fromTime) {
              return local;
            } else {
              return hdw;
            }
          }),
        ],
      });
    } else {
      const headways = [...item.headways];
      const index = headways.findIndex((hdw) => hdw.fromTime > local.fromTime);
      if (index >= 0) {
        headways.splice(index, 0, { ...local });
      } else {
        headways.push({ ...local });
      }
      setItem({
        ...item,
        headways: [...headways],
      });
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: 400 } }}
      >
        <DialogTitle>
          Edit Headways and Service Time – LAD {item.code}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography sx={{ mt: 3 }}>Service time period:</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin='dense'
                fullWidth
                id='start'
                label='Start time'
                type='time'
                variant='standard'
                value={item.serviceTime.start}
                onChange={(e) =>
                  setItem({
                    ...item,
                    serviceTime: {
                      start: e.target.value,
                      end: item.serviceTime.end,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin='dense'
                fullWidth
                id='end'
                label='End time'
                type='time'
                variant='standard'
                value={item.serviceTime.end}
                onChange={(e) =>
                  setItem({
                    ...item,
                    serviceTime: {
                      end: e.target.value,
                      start: item.serviceTime.start,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={2}></Grid>
            <Divider />
            <Grid item xs={4}>
              <Typography sx={{ mt: 3 }}>Headways:</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin='dense'
                fullWidth
                id='fromTime'
                label='From time'
                type='time'
                variant='standard'
                value={local.fromTime}
                onChange={(e) =>
                  setLocal({ ...local, fromTime: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin='dense'
                fullWidth
                id='value'
                label='Value'
                type='number'
                variant='standard'
                value={local.value}
                onChange={(e) => setLocal({ ...local, value: +e.target.value })}
                onKeyUp={(e) => {
                  if (e.key == 'Enter') {
                    setHeadway();
                  }
                }}
                inputProps={{ min: 0, max: 1440 }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                sx={{ mt: 3 }}
                variant='outlined'
                color='primary'
                startIcon={<CheckIcon sx={{ ml: 1 }} />}
                onClick={() => setHeadway()}
              ></Button>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: 200,
                  maxHeight: 200,
                  overflow: 'auto',
                  border: 1,
                  borderColor: 'lightgrey',
                  width: 350,
                  margin: 'auto',
                }}
              >
                <List dense>
                  {item.headways.map((hdw, index) => (
                    <div key={hdw.fromTime}>
                      <ListItem sx={{ py: 0 }}>
                        <ListItemButton onClick={() => setLocal(hdw)}>
                          <ListItemText>
                            From time: <strong>{hdw.fromTime}</strong> Headway
                            value: <strong>{hdw.value}</strong>
                          </ListItemText>
                          <IconButton
                            size='small'
                            onClick={(e) => {
                              e.stopPropagation();
                              const newHeadways = [...item.headways];
                              newHeadways.splice(index, 1);
                              setItem({ ...item, headways: [...newHeadways] });
                            }}
                          >
                            <DeleteIcon fontSize='inherit' />
                          </IconButton>
                        </ListItemButton>
                      </ListItem>
                      <Divider
                        sx={{ width: '90%', margin: 'auto' }}
                        component='li'
                      />
                    </div>
                  ))}
                </List>
              </Box>
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
