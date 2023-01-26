import React, { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import MUITooltip from '@mui/material/Tooltip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { indigo } from '@mui/material/colors';

import { DataContext } from '../../contexts/DataContext';
import Title from '../layout/Title';
import { timeToMinutes } from '../../utils/minutes';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';

const mdTheme = createTheme();

// FIXME: Delete below later
const demoLads = [
  {
    label: '1-0-1',
    id: 1,
    trips: 57,
    depth: 99,
  },
  {
    label: '2-0-1',
    id: 2,
    trips: 31,
    depth: 10,
  },
  {
    label: '2-0-2',
    id: 3,
    trips: 43,
    depth: 3,
  },
];

const onAdd = () => {
  console.log('Add button pressed');
};

// FIXME: Delete above later

export default function Analytics() {
  const theme = useTheme();

  const startPoint = { x: 0, y: undefined };
  const endPoint = { x: 1440, y: undefined };

  const {
    // FIXME:
    settings,
    sites,
    segments,
    lads,
    timetables,
    renewTimetables,
    addTimetable,
    updateTimetable,
    runtimes,
    renewRuntimes,
    addRuntimes,
    updateRuntimes,
  } = useContext(DataContext);

  const ladsReady = runtimes.map((rt) => ({
    label: lads.find((lad) => lad.id == rt.ladId).code,
    ladId: rt.ladId,
    depth: rt.runtimes.length,
    trips: rt.departures.length,
  }));

  // FIXME: Delete Later
  const [selected, setSelected] = useState({ name: 'none', id: undefined });
  const [tooltipData, setTooltipData] = useState({
    trips: undefined,
    depth: undefined,
  });
  const [ladStatistics, setLadStatistics] = useState([
    startPoint,
    // { x: 720, y: 100 },
    endPoint,
  ]);

  const [ladStatisticsDepth, setLadStatisticsDepth] = useState([
    [startPoint, endPoint],
  ]);

  const getLadData = (ladId) => {
    const data = runtimes
      .find((rt) => rt.ladId == ladId)
      .runtimes.reduce((acc, cur) => {
        const tripsData = cur.trips.map((tr) => ({
          x: timeToMinutes(tr.departure),
          y: tr.segments.reduce((sum, seg) => {
            return sum + seg.segmentTime;
          }, 0),
        }));
        return [...acc, ...tripsData];
      }, []);
    // data.push(endPoint);
    console.log('LAD data ready:', data);
    setLadStatistics(data);
  };

  const getLadDataDepth = (ladId) => {
    const depthRuntimes = runtimes
      .find((rt) => rt.ladId == ladId)
      .runtimes.map((item) => {
        const tripsData = item.trips.map((tr) => ({
          x: timeToMinutes(tr.departure),
          y: tr.segments.reduce((sum, seg) => {
            return sum + seg.segmentTime;
          }, 0),
        }));
        return tripsData;
      });
    console.log('LAD data with Depth:', depthRuntimes);
    setLadStatisticsDepth(depthRuntimes);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '80vh',
          }}
        >
          <Toolbar
            sx={{
              pl: { sm: 0 },
              pr: { sm: 1 },
            }}
          >
            <Title>Historical Data Analytics</Title>
            <div className='spacer'></div>
            <MUITooltip
              title={
                selected.id ? (
                  <Typography variant='caption'>
                    Trips per day: <strong>{tooltipData.trips}</strong>
                    <br />
                    Depth, days: <strong>{tooltipData.depth}</strong>
                  </Typography>
                ) : (
                  <Typography variant='caption'>Select LAD</Typography>
                )
              }
              placement='left'
            >
              <Autocomplete
                disablePortal
                disableClearable
                size='small'
                id='lad-select'
                options={ladsReady}
                renderInput={(params) => <TextField {...params} label='LAD' />}
                sx={{ width: 150 }}
                onChange={(e, newValue) => {
                  console.log(newValue);
                  setSelected({ name: newValue.label, id: newValue.ladId });
                  setTooltipData({
                    trips: newValue.trips,
                    depth: newValue.depth,
                  });
                  getLadData(newValue.ladId);
                  getLadDataDepth(newValue.ladId);
                  console.log('LADs:', lads);
                  console.log('Runtimes:', runtimes);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.ladId === value.ladId
                }
              />
            </MUITooltip>
          </Toolbar>
          {false && (
            <Typography sx={{ mb: 1 }}>
              Selected LAD: {selected.name}, id: {selected.id}
            </Typography>
          )}
          <ResponsiveContainer>
            <ScatterChart
              margin={{
                top: 16,
                right: 16,
                bottom: 0,
                left: 24,
              }}
            >
              <XAxis
                type='number'
                dataKey='x'
                name='Day time'
                stroke={theme.palette.text.secondary}
                style={theme.typography.body2}
              />
              <YAxis
                type='number'
                dataKey='y'
                name='Trip time'
                stroke={theme.palette.text.secondary}
                style={theme.typography.body2}
              >
                <Label
                  angle={270}
                  position='left'
                  style={{
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                >
                  Trip time (minutes)
                </Label>
              </YAxis>
              <Tooltip />
              <Scatter data={ladStatistics} fill={indigo[900]} />
            </ScatterChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
