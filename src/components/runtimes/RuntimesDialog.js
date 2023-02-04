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
import { grey } from '@mui/material/colors';

export default function RuntimesDialog(props) {
  const {
    open,
    onClose,
    item,
    setItem,
    timetable,
    segmentsData,
    settings,
    speedCoefs,
  } = props;

  const [depth, setDepth] = useState(item.runtimes.length || 1);

  const handleClose = () => {
    onClose(false);
    setDepth(1);
  };

  const handleSave = () => {
    onClose(true);
    setDepth(1);
  };

  const generateDepartureTime = (scheduled) => {
    const scheduledMinutes = timeToMinutes(scheduled);
    const before = settings.departureShift.before;
    const after = settings.departureShift.after;
    // 'before' should always be negative
    const variation = Math.round(Math.random() * (after - before)) + before;
    const resultMinutes = scheduledMinutes + variation;
    return minutesToTime(resultMinutes);
  };

  const getCoefficient = (departureTime) => {
    const departureMinutes = timeToMinutes(departureTime);
    const value = speedCoefs[departureMinutes].y;

    return value;
  };

  const generateSegmentRuntime = (segmentId, coef) => {
    const segment = segmentsData.find((seg) => seg.id == segmentId);
    const variationGap =
      segment.length * (settings.tripTimeVariationPercent / 100);
    const variation = Math.random() * variationGap - variationGap / 2;
    const runtime = segment
      ? Math.round(
          ((segment.length + variation) / 1000 / (coef * segment.speed)) * 60
        )
      : 0;

    return runtime;
  };

  const generateRuntimes = () => {
    if (depth < 1) {
      return;
    }
    const departures = [...timetable.departures];
    const segmentIds = [...timetable.lad.segmentIds];
    const runtimes = [];
    for (let i = 0; i < depth; i++) {
      const trips = [];
      for (let j = 0; j < departures.length; j++) {
        // const tripId = j + 1;
        const departure = generateDepartureTime(departures[j]);
        const coef = getCoefficient(departure);
        const segments = [];
        for (let k = 0; k < segmentIds.length; k++) {
          const segmentData = {
            segmentId: segmentIds[k],
            segmentTime: generateSegmentRuntime(segmentIds[k], coef),
          };
          segments.push({ ...segmentData });
        }

        trips.push({
          tripId: j,
          departure: departure,
          segments: [...segments],
        });
      }
      runtimes.push({
        depth: i + 1,
        trips: [...trips],
      });
    }
    // FIXME:
    console.warn('Generated Runtimes');
    console.log('LadId:', timetable.ladId);
    console.log('Timetable Departures:', timetable.departures);
    console.log('Runtimes:', runtimes);

    setItem({
      id: item.id,
      ladId: timetable.ladId,
      departures: [...timetable.departures],
      runtimes: [...runtimes],
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: 400 } }}
      >
        <DialogTitle>Runtimes – LAD {timetable.lad.code}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography sx={{ mt: 3 }}>
                Trips per day: {item.departures.length}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ mt: 3 }}>Runtimes depth:</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin='dense'
                fullWidth
                id='depth'
                label='Days'
                type='number'
                variant='standard'
                inputProps={{ step: 1, min: 1 }}
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title='Generate'>
                <Button
                  sx={{ mt: 3 }}
                  variant='outlined'
                  color='primary'
                  startIcon={<CachedIcon sx={{ ml: 1 }} />}
                  onClick={() => generateRuntimes()}
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
                  margin: 'auto',
                  overflow: 'auto',
                }}
              >
                {item.runtimes.length > 0 && (
                  <TableContainer
                    sx={{ maxHeight: 200, minHeight: 200, px: 2 }}
                  >
                    <Table size='small' stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align='right'
                            padding='none'
                            sx={{ pl: 1 }}
                          >
                            #
                          </TableCell>
                          <TableCell align='left' sx={{ pl: 1 }}>
                            Scheduled
                          </TableCell>
                          <TableCell align='right' sx={{ pr: 2 }}>
                            HW
                          </TableCell>
                          {item.runtimes.map((rt, idx) => (
                            <React.Fragment key={rt.depth}>
                              <TableCell
                                sx={{
                                  minWidth: 80,
                                  background: idx % 2 ? 'white' : grey[100],
                                }}
                              >
                                {rt.depth} dep.
                              </TableCell>
                              <TableCell
                                sx={{
                                  minWidth: 85,
                                  background: idx % 2 ? 'white' : grey[100],
                                }}
                              >
                                {rt.depth} time
                              </TableCell>
                            </React.Fragment>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.departures.map((time, index) => (
                          <TableRow key={index} hover>
                            <TableCell
                              align='right'
                              padding='none'
                              sx={{ pl: 1 }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell align='left' sx={{ pl: 2 }}>
                              {time}
                            </TableCell>
                            <TableCell align='right' sx={{ pr: 2 }}>
                              {index < item.departures.length - 1
                                ? timeToMinutes(item.departures[index + 1]) -
                                  timeToMinutes(time)
                                : '–'}
                            </TableCell>
                            {item.runtimes.map((rt, idx) => (
                              <React.Fragment key={rt.depth}>
                                <TableCell
                                  sx={{
                                    background: idx % 2 ? 'inherit' : grey[100],
                                  }}
                                >
                                  {rt.trips[index].departure}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    background: idx % 2 ? 'inherit' : grey[100],
                                  }}
                                >
                                  {rt.trips[index].segments.reduce(
                                    (acc, cur) => {
                                      return acc + cur.segmentTime;
                                    },
                                    0
                                  )}
                                </TableCell>
                              </React.Fragment>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
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
