import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CachedIcon from '@mui/icons-material/Cached';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { timeToMinutes, minutesToTime } from '../../utils/minutes';

export default function TimetableDialog(props) {
  const { open, onClose, item, setItem } = props;

  // const [local, setLocal] = useState({ fromTime: '00:00', value: 0 }); // FIXME:
  const [shift, setShift] = useState(0);

  const handleClose = () => {
    onClose(false);
    setShift(0);
  };

  const handleSave = () => {
    onClose(true);
    setShift(0);
  };

  const generateTimetable = () => {
    // FIXME:
    console.log('Generate TT Started');
    console.log('LAD:', item);
    console.log('Shift:', shift);

    const startMinutes = timeToMinutes(item.lad.serviceTime.start);
    let endMinutes = timeToMinutes(item.lad.serviceTime.end);
    if (startMinutes > endMinutes) {
      endMinutes = 24 * 60 - 1;
    }
    const headways = item.lad.headways.map((hdw) => ({
      fromMinutes: timeToMinutes(hdw.fromTime),
      value: hdw.value,
    }));
    const timetable = [];

    let tripMinutes = startMinutes + +shift;
    console.log('Start Minutes:', tripMinutes);
    while (tripMinutes < endMinutes) {
      timetable.push(minutesToTime(tripMinutes));
      let headway = headways[headways.length - 1].value;
      for (let i = 0; i < headways.length; i++) {
        if (headways[i].fromMinutes <= tripMinutes) {
          headway = headways[i].value;
        } else {
          break;
        }
      }
      tripMinutes += headway;
    }
    console.log('Timetable Generated:', timetable);
    setItem({ ...item, departures: [...timetable] });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: 400 } }}
      >
        <DialogTitle>Time Table – LAD {item.lad.code}</DialogTitle>
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
                value={item.lad.serviceTime.start}
                onChange={(e) =>
                  setItem({
                    ...item,
                    lad: {
                      ...item.lad,
                      serviceTime: {
                        start: e.target.value,
                        end: item.lad.serviceTime.end,
                      },
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
                value={item.lad.serviceTime.end}
                onChange={(e) =>
                  setItem({
                    ...item,
                    lad: {
                      ...item.lad,
                      serviceTime: {
                        start: item.lad.serviceTime.start,
                        end: e.target.value,
                      },
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={4}>
              <Typography sx={{ mt: 3 }}>
                Time Table ({item.departures.length}):
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ mt: 3 }}>Shift First Trip:</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin='dense'
                fullWidth
                id='value'
                label='Minutes'
                type='number'
                variant='standard'
                inputProps={{ step: 1 }}
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title='Generate'>
                <Button
                  sx={{ mt: 3 }}
                  variant='outlined'
                  color='primary'
                  startIcon={<CachedIcon sx={{ ml: 1 }} />}
                  onClick={() => generateTimetable()}
                ></Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: 200,
                  maxHeight: 200,
                  border: 1,
                  borderColor: 'lightgrey',
                  width: 350,
                  margin: 'auto',
                  overflow: 'auto',
                }}
              >
                <TableContainer sx={{ maxHeight: 200, px: 2 }}>
                  <Table size='small' stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell align='right' padding='none' sx={{ pl: 3 }}>
                          #
                        </TableCell>
                        <TableCell align='left' sx={{ pl: 6 }}>
                          Departure
                        </TableCell>
                        <TableCell align='right' sx={{ pr: 6 }}>
                          Headway
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item.departures.map((time, index) => (
                        <TableRow key={index} hover>
                          <TableCell
                            align='right'
                            padding='none'
                            sx={{ pl: 3 }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell align='left' sx={{ pl: 7 }}>
                            {time}
                          </TableCell>
                          <TableCell align='right' sx={{ pr: 7 }}>
                            {index < item.departures.length - 1
                              ? timeToMinutes(item.departures[index + 1]) -
                                timeToMinutes(time)
                              : '–'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
