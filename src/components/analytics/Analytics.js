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
import { indigo, blue, lightBlue } from '@mui/material/colors';

import Title from '../layout/Title';
import { DataContext } from '../../contexts/DataContext';
import { timeToMinutes, minutesToTime } from '../../utils/minutes';

import {
  ComposedChart,
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

function MyTooltip(props) {
  const { active, payload } = props;
  if (active) {
    return (
      <Box
        margin={1}
        padding={1}
        sx={{ background: 'white', border: '1px solid lightgrey' }}
      ></Box>
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
  const [ladStatistics, setLadStatistics] = useState([startPoint, endPoint]); // FIXME:

  const [ladStatisticsWithDepth, setLadStatisticsWithDepth] = useState([
    [startPoint, endPoint],
  ]);

  const [ladAverage, setLadAverage] = useState([startPoint, endPoint]); // TODO: Check!

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
    const averageData = getAverageAndPercentiles(depthRuntimes);
    setLadStatisticsWithDepth(depthRuntimes);
    setLadAverage(averageData);
  };

  const getAverageAndPercentiles = (
    dataWithDepth = ladStatisticsWithDepth,
    percentileLow = settings.percentile.low / 100,
    percentileHigh = settings.percentile.high / 100
  ) => {
    const numberOfGenerations = dataWithDepth.length;
    if (!numberOfGenerations) {
      return;
    }
    const stepLow =
      numberOfGenerations * percentileLow < 1
        ? 0
        : Math.floor(numberOfGenerations * percentileLow - 1);
    const stepHigh =
      numberOfGenerations * (1 - percentileHigh) < 1
        ? 1
        : Math.floor(numberOfGenerations * (1 - percentileHigh) + 1);

    const averageAndPercentiles = {
      average: [],
      percentileLow: [],
      percentileHigh: [],
    };
    for (let i = 0; i < dataWithDepth[0].length; i++) {
      const generationItems = dataWithDepth.map((generation) => generation[i]);
      generationItems.sort((a, b) => a.y - b.y);
      const sum = generationItems.reduce(
        (acc, cur) => {
          return {
            x: acc.x + cur.x,
            y: acc.y + cur.y,
          };
        },
        { x: 0, y: 0 }
      );
      const average = {
        x: Math.round(sum.x / numberOfGenerations),
        y: Math.round(sum.y / numberOfGenerations),
      };
      averageAndPercentiles.average.push(average);
      averageAndPercentiles.percentileLow.push(generationItems[stepLow]);
      averageAndPercentiles.percentileHigh.push(
        generationItems[numberOfGenerations - stepHigh]
      );
    }
    return averageAndPercentiles;
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
                  setSelected({ name: newValue.label, id: newValue.ladId });
                  setTooltipData({
                    trips: newValue.trips,
                    depth: newValue.depth,
                  });
                  getLadDataWithDepth(newValue.ladId);
                  console.log('LAD data:', ladStatisticsWithDepth); // FIXME:
                  // console.log(); // FIXME:
                }}
                isOptionEqualToValue={(option, value) =>
                  option.ladId === value.ladId
                }
              />
            </MUITooltip>
          </Toolbar>
          <ResponsiveContainer>
            <LineChart
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
                <Line
                  key={index}
                  data={generation}
                  dataKey='y'
                  fill={
                    lightBlue[
                      getColorIndex(ladStatisticsWithDepth.length, index) * 100
                    ]
                  }
                  stroke='null'
                />
              ))}
              <Line
                data={ladAverage.percentileLow}
                dataKey='y'
                stroke={blue[900]}
                strokeWidth={2}
                opacity={1}
                type='natural'
                dot={false}
              />
              <Line
                data={ladAverage.percentileHigh}
                dataKey='y'
                stroke={blue[900]}
                strokeWidth={2}
                opacity={1}
                type='natural'
                dot={false}
              />
              <Line
                data={ladAverage.average}
                dataKey='y'
                stroke='red'
                strokeWidth={5}
                opacity={0.5}
                type='natural'
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
