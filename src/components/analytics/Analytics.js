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
import { Box } from '@mui/material';
import { indigo } from '@mui/material/colors';

import Title from '../layout/Title';
import { DataContext } from '../../contexts/DataContext';
import { timeToMinutes, minutesToTime } from '../../utils/minutes';

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

function MyTooltip(props) {
  const { active, payload } = props;
  if (active) {
    console.log('Tooltip Data (active, payload):', active, payload);
    return (
      <Box
        margin={1}
        padding={1}
        sx={{ background: 'white', border: '1px solid lightgrey' }}
      >
        <Typography variant='body2'>
          {payload[0].name}: {minutesToTime(payload[0].value)}
        </Typography>
        <Typography variant='body2'>
          {payload[1].name}: {minutesToTime(payload[1].value)}
        </Typography>
      </Box>
    );
  }
}

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

  const [selected, setSelected] = useState({ name: 'none', id: undefined });
  const [tooltipData, setTooltipData] = useState({
    trips: undefined,
    depth: undefined,
  });
  const [ladStatistics, setLadStatistics] = useState([startPoint, endPoint]);

  const [ladStatisticsWithDepth, setLadStatisticsWithDepth] = useState([
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

  const getLadDataWithDepth = (ladId) => {
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
    setLadStatisticsWithDepth(depthRuntimes);
  };

  const getGenerationFill = (index) => {
    switch (index) {
      case 0:
      case 1:
      case 2:
        return indigo[900];
      case 3:
      case 4:
      case 5:
        return indigo[800];
      case 6:
      case 7:
      case 8:
        return indigo[700];
      case 9:
      case 10:
      case 11:
        return indigo[600];
      case 12:
      case 13:
      case 14:
        return indigo[500];
      case 15:
      case 16:
      case 17:
        return indigo[400];
      default:
        return indigo[300];
    }
  };

  function getColorIndex(total, index) {
    if (total - index > 24) {
      return 1;
    } else {
      return Math.ceil((24 - total + index + 1) / 3) + 1;
    }
  }

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
                  console.log(newValue); // FIXME:
                  setSelected({ name: newValue.label, id: newValue.ladId });
                  setTooltipData({
                    trips: newValue.trips,
                    depth: newValue.depth,
                  });
                  getLadData(newValue.ladId);
                  getLadDataWithDepth(newValue.ladId);
                  // console.log('LADs:', lads); // FIXME:
                  // console.log('Runtimes:', runtimes);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.ladId === value.ladId
                }
              />
            </MUITooltip>
          </Toolbar>
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
                domain={[0, 1440]}
                tickCount={25}
                tickFormatter={(number) => {
                  if (number % 120 == 0) {
                    return `${number / 60}:00`;
                  } else {
                    return '';
                  }
                }}
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
              {ladStatisticsWithDepth.map((generation, index) => (
                <Scatter
                  key={index}
                  data={generation}
                  fill={
                    indigo[
                      getColorIndex(ladStatisticsWithDepth.length, index) * 100
                    ]
                  }
                />
              ))}
              <Tooltip content={<MyTooltip />} />
            </ScatterChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
