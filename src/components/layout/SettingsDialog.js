import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';

export default function SettingsDialog(props) {
  const { open, onClose, title, item, setItem } = props;

  const [local, setLocal] = useState({ fromTime: '00:00', value: 0 });

  const setCoefficient = () => {
    const coef = item.dayPeriodCoefficients.find(
      (cf) => cf.fromTime == local.fromTime
    );
    if (coef) {
      setItem({
        ...item,
        dayPeriodCoefficients: [
          ...item.dayPeriodCoefficients.map((cf) => {
            if (cf.fromTime == local.fromTime) {
              return local;
            } else {
              return cf;
            }
          }),
        ],
      });
    } else {
      const coefs = [...item.dayPeriodCoefficients];
      const index = coefs.findIndex((cf) => cf.fromTime > local.fromTime);
      if (index >= 0) {
        coefs.splice(index, 0, { ...local });
      } else {
        coefs.push({ ...local });
      }
      setItem({
        ...item,
        dayPeriodCoefficients: [...coefs],
      });
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  const handleSave = () => {
    onClose(true);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: 600, width: 600 } }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container columnSpacing={2} rowSpacing={1}>
            <Grid item xs={12}>
              <Typography variant='subtitle2' sx={{ mb: 0 }}>
                Defaults:
              </Typography>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={5}>
              <TextField
                size='small'
                variant='standard'
                fullWidth
                label='Free speed'
                type='number'
                value={item.defaultSpeed}
                onChange={(e) =>
                  setItem({
                    ...item,
                    defaultSpeed: +e.target.value,
                  })
                }
                inputProps={{
                  min: 1,
                  step: 1,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>km/h</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                size='small'
                variant='standard'
                fullWidth
                label='Variation'
                type='number'
                value={item.tripTimeVariationPercent}
                onChange={(e) =>
                  setItem({
                    ...item,
                    tripTimeVariationPercent: +e.target.value,
                  })
                }
                inputProps={{
                  min: 0,
                  step: 1,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>
                Departure scheduled time shifts variation:
              </Typography>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={5}>
              <TextField
                size='small'
                variant='standard'
                fullWidth
                label='Before'
                type='number'
                value={item.departureShift.before}
                onChange={(e) =>
                  setItem({
                    ...item,
                    departureShift: {
                      before: +e.target.value,
                      after: item.departureShift.after,
                    },
                  })
                }
                inputProps={{
                  max: 0,
                  step: 1,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>min</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                size='small'
                variant='standard'
                fullWidth
                label='After'
                type='number'
                value={item.departureShift.after}
                onChange={(e) =>
                  setItem({
                    ...item,
                    departureShift: {
                      before: item.departureShift.before,
                      after: +e.target.value,
                    },
                  })
                }
                inputProps={{
                  min: 0,
                  step: 1,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>min</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Speed coefficients:</Typography>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={4}>
              <TextField
                size='small'
                variant='standard'
                fullWidth
                label='From time'
                type='time'
                value={local.fromTime}
                onChange={(e) =>
                  setLocal({ ...local, fromTime: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                size='small'
                variant='standard'
                fullWidth
                label='Value (0 ÷ 1)'
                type='number'
                value={local.value}
                onChange={(e) => setLocal({ ...local, value: +e.target.value })}
                onKeyUp={(e) => {
                  if (e.key == 'Enter') {
                    setCoefficient();
                  }
                }}
                inputProps={{
                  min: 0,
                  max: 1,
                  step: 0.1,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                sx={{ mt: 2, ml: 1 }}
                variant='outlined'
                color='primary'
                startIcon={<CheckIcon sx={{ ml: 2 }} />}
                onClick={() => setCoefficient()}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Box
                sx={{
                  height: 200,
                  maxHeight: 200,
                  overflow: 'auto',
                  border: 1,
                  borderColor: 'lightgrey',
                  width: 400,
                  margin: 'auto',
                  mt: 2,
                }}
              >
                <List dense>
                  {item.dayPeriodCoefficients.map((coef, index) => (
                    <div key={coef.fromTime}>
                      <ListItem sx={{ py: 0 }}>
                        <ListItemButton onClick={() => setLocal(coef)}>
                          <ListItemText>
                            From time: <strong>{coef.fromTime}</strong>{' '}
                            Coefficient value: <strong>{coef.value}</strong>
                          </ListItemText>
                          <IconButton
                            size='small'
                            onClick={(e) => {
                              e.stopPropagation();
                              const newCoefficients = [
                                ...item.dayPeriodCoefficients,
                              ];
                              newCoefficients.splice(index, 1);
                              setItem({
                                ...item,
                                dayPeriodCoefficients: [...newCoefficients],
                              });
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
            <Grid item xs={1}></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
