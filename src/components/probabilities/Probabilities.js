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
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Icon from '@mui/material/Icon';
import CircleIcon from '@mui/icons-material/Circle';
import { indigo, blue, lightBlue } from '@mui/material/colors';

import Title from '../layout/Title';
import { DataContext } from '../../contexts/DataContext';
import { timeToMinutes, minutesToTime } from '../../utils/minutes';

import Chart from './Chart';

const defaultLayover = 6;
const defaultMinLayover = 2;

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

export default function Probabilities() {
  const theme = useTheme();

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

  const [ladData, setLadData] = useState(null);

  const [sitesStatistics, setSiteStatistics] = useState(null);
  const [selectedSite, setSelectedSite] = useState(0);
  const [siteTimeMarks, setSiteTimeMarks] = useState([{ value: 0, label: '' }]);

  const [siteServiceTime, setSiteServiceTime] = useState({
    startMinutes: 0,
    endMinutes: 1440,
  });
  const [selectedMinutes, setSelectedMinutes] = useState(
    Math.round((siteServiceTime.endMinutes - siteServiceTime.startMinutes) / 2)
  );
  const [gap, setGap] = useState(30);
  const [statistics, setStatistics] = useState([]);

  const [timeLeft, setTimeLeft] = useState(0);
  const [layover, setLayover] = useState(defaultLayover);
  const [minLayover, setMinLayover] = useState(defaultMinLayover);

  const [arriveProbability, setArriveProbability] = useState(0.2);
  const [departProbability, setDepartProbability] = useState(0.7);

  const getLadInfo = (ladId) => {
    const rtData = runtimes.find((rt) => rt.ladId == ladId);

    const lad = lads.find((lad) => lad.id == ladId);
    const data = {
      ...lad,
      serviceTime: {
        start: rtData.departures[0],
        end: rtData.departures.at(-1),
      },
      siteList: lad.siteIds.map((id) => sites.find((st) => st.id == id)),
    };

    setLadData(data);
    generateSitesStatistics(data, rtData);
  };

  const generateSitesStatistics = (lad, rtData) => {
    const sitesRT = [];
    for (let i = 0; i < lad.siteIds.length; i++) {
      sitesRT.push([]);
    }
    for (let i = 0; i < rtData.runtimes.length; i++) {
      for (let j = 0; j < rtData.runtimes[i].trips.length; j++) {
        const startTime = rtData.runtimes[i].trips[j].departure;
        const startMinutes = timeToMinutes(startTime);
        const tripSegments = rtData.runtimes[i].trips[j].segments;
        const segmentTimes = tripSegments.map((seg) => seg.segmentTime);
        for (let k = 1; k < segmentTimes.length; k++) {
          segmentTimes[segmentTimes.length - k - 1] =
            segmentTimes[segmentTimes.length - k - 1] +
            segmentTimes[segmentTimes.length - k];
        }
        let siteDepartureMinutes = startMinutes;
        for (let k = 0; k < lad.siteIds.length; k++) {
          sitesRT[k].push({
            tripId: rtData.runtimes[i].trips[j].tripId,
            departureMinutes: siteDepartureMinutes,
            departureTime: minutesToTime(siteDepartureMinutes),
            tripTime: k < lad.siteIds.length - 1 ? segmentTimes[k] : 0,
          });
          siteDepartureMinutes += tripSegments[k]?.segmentTime || 0;
        }
        for (let siteSet of sitesRT) {
          siteSet.sort((a, b) => a.departureMinutes - b.departureMinutes);
        }
      }
    }
    setSiteStatistics(sitesRT);
    setSelectedSite(0);
    setSiteServiceTime({
      startMinutes: sitesRT[0].at(0).departureMinutes,
      endMinutes: sitesRT[0].at(-1).departureMinutes,
    });
    createTimeMarks(
      sitesRT[0].at(0).departureTime,
      sitesRT[0].at(-1).departureTime
    );
    const shift = Math.round(
      (sitesRT[0].at(-1).departureMinutes - sitesRT[0].at(0).departureMinutes) /
        2
    );
    const middleMinutes = sitesRT[0].at(0).departureMinutes + shift;
    setSelectedMinutes(middleMinutes);
    collectStatistics(middleMinutes, gap, sitesRT[0]);
  };

  const selectSite = (siteOrder) => {
    setSelectedSite(siteOrder);
    const firstTripTime = sitesStatistics[siteOrder].at(0).departureTime;
    const lastTripTime = sitesStatistics[siteOrder].at(-1).departureTime;
    const firstTripMinutes = sitesStatistics[siteOrder].at(0).departureMinutes;
    const lastTripMinutes = sitesStatistics[siteOrder].at(-1).departureMinutes;
    setSiteServiceTime({
      startMinutes: firstTripMinutes,
      endMinutes: lastTripMinutes,
    });
    const minutesToShift = Math.round((lastTripMinutes - firstTripMinutes) / 2);
    const middleTime = firstTripMinutes + minutesToShift;
    setSelectedMinutes(middleTime);
    collectStatistics(middleTime, gap, sitesStatistics[siteOrder]);
    createTimeMarks(firstTripTime, lastTripTime);
  };

  const createTimeMarks = (startTime, endTime) => {
    const startHour = Math.ceil(timeToMinutes(startTime) / 60);
    const endHour = Math.floor(timeToMinutes(endTime) / 60);
    const marks = [];
    for (let i = 0; i <= endHour - startHour; i++) {
      marks.push({
        value: (startHour + i) * 60,
        label: minutesToTime((startHour + i) * 60).slice(0, 2),
      });
    }
    setSiteTimeMarks([...marks]);
  };

  const selectTime = (e) => {
    const value = e.target.value;
    setSelectedMinutes(value);
    collectStatistics(value, gap, sitesStatistics[selectedSite]);
  };

  const collectStatistics = (minutes, gap, data) => {
    const selectedData = data.filter(
      (item) =>
        item.departureMinutes >= minutes - gap / 2 &&
        item.departureMinutes <= minutes + gap / 2
    );
    if (!selectedData.length) {
      console.warn('No Data Found!');
      setStatistics([]);
      return;
    }
    const tripTimesSelected = selectedData.map((item) => item.tripTime).sort();

    const low = tripTimesSelected.at(0);
    const high = tripTimesSelected.at(-1);
    const average = Math.round(
      tripTimesSelected.reduce((a, b) => a + b) / tripTimesSelected.length
    );
    const p20 = tripTimesSelected[Math.floor(tripTimesSelected.length * 0.2)];
    const p80 = tripTimesSelected[Math.floor(tripTimesSelected.length * 0.8)];

    const dataToPlot = [
      {
        x: low,
        y: 0,
      },
      {
        x: p20,
        y: 0.2,
      },
      {
        x: average,
        y: 0.5,
      },
      {
        x: p80,
        y: 0.8,
      },
      {
        x: high,
        y: 1,
      },
    ];

    setStatistics(dataToPlot);
    setTimeLeft(average);
    setLayover(defaultLayover);
    setMinLayover(defaultMinLayover);
  };

  const verifyLayover = (e) => {
    const value = +e.target.value;
    if (value < minLayover) {
      setMinLayover(value);
    }
    setLayover(value);
  };

  const verifyMinLayover = (e) => {
    const value = +e.target.value;
    if (value > layover) {
      setLayover(value);
    }
    setMinLayover(value);
  };

  const valueToPercent = (value) => {
    let percent = value * 100;
    if (percent >= 100) {
      percent = 99;
    }
    if (percent <= 0) {
      percent = 1;
    }
    return percent.toFixed() + '%';
  };

  const valueToColor = (value) => {
    if (value >= 0.8) {
      return 'green';
    }
    if (value >= 0.5) {
      return 'gold';
    }
    return 'red';
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
            <Title>On-time Arrival and Next-trip Departure Prediction</Title>
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
                  getLadInfo(newValue.ladId);
                  setSelectedSite(0);
                  // selectSite(0);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.ladId === value.ladId
                }
              />
            </MUITooltip>
          </Toolbar>
          {false &&
            ladData.siteList.map((site, index) => (
              <Typography key={index}>
                {site?.short || '?'} - {site?.name || 'Not Found'}
              </Typography>
            ))}
          {ladData && (
            <Grid container spacing={0}>
              <Grid item md={2} lg={3}></Grid>
              <Grid item md={8} lg={6}>
                <Slider
                  max={ladData.siteList.length - 1}
                  step={null}
                  marks={ladData.siteList.map((site, index) => ({
                    value: index,
                    label: site?.short || '?',
                    name: site?.name || 'Not Found',
                  }))}
                  valueLabelFormat={(value) =>
                    ladData.siteList[value]?.name || 'Not Found'
                  }
                  valueLabelDisplay='on'
                  value={selectedSite}
                  onChange={(e) => selectSite(e.target.value)}
                  sx={{ mt: 3 }}
                />
              </Grid>
              <Grid item md={2} lg={3} />
              <Grid item md={2} lg={3}></Grid>
              <Grid item md={8} lg={6}>
                <Slider
                  min={siteServiceTime.startMinutes}
                  max={siteServiceTime.endMinutes}
                  step={1}
                  valueLabelFormat={(value) => minutesToTime(value)}
                  valueLabelDisplay='on'
                  marks={siteTimeMarks}
                  value={selectedMinutes}
                  onChange={selectTime}
                  sx={{ mt: 3 }}
                />
              </Grid>
              <Grid item md={2} lg={3}></Grid>
              <Grid item md={2} lg={3}></Grid>
              <Grid
                item
                md={8}
                lg={6}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <TextField
                  variant='standard'
                  label='Time Left'
                  type='number'
                  sx={{ mx: 2, maxWidth: '20%' }}
                  value={timeLeft}
                  onChange={(e) => setTimeLeft(+e.target.value)}
                  inputProps={{ step: 1, min: 0 }}
                />
                <TextField
                  variant='standard'
                  label='Layover'
                  type='number'
                  sx={{ mx: 2, maxWidth: '20%' }}
                  value={layover}
                  onChange={verifyLayover}
                  inputProps={{ step: 1, min: 0 }}
                />
                <TextField
                  variant='standard'
                  label='Minimum LO'
                  type='number'
                  sx={{ mx: 2, maxWidth: '20%' }}
                  value={minLayover}
                  onChange={verifyMinLayover}
                  inputProps={{ step: 1, min: 0 }}
                />
              </Grid>
              <Grid item md={2} lg={3}></Grid>
              <Grid item md={1} lg={2}></Grid>
              <Grid item md={9} lg={7} minHeight={'30vh'} sx={{ mt: 6 }}>
                {statistics.length > 0 && (
                  <Chart
                    data={statistics}
                    timeLeft={timeLeft}
                    layover={layover}
                    minLayover={minLayover}
                    setArrive={setArriveProbability}
                    setDepart={setDepartProbability}
                  />
                )}
                {statistics.length == 0 && (
                  <Typography sx={{ textAlign: 'center', pl: '20%' }}>
                    No Data Found in Range
                  </Typography>
                )}
              </Grid>
              <Grid item md={2} lg={3}></Grid>
              <Grid item md={2} lg={3}></Grid>
              <Grid
                item
                md={8}
                lg={6}
                sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}
              >
                <CircleIcon sx={{ color: valueToColor(arriveProbability) }} />
                <Typography sx={{ pl: 1, pr: 5 }}>
                  Arrive On-time:{' '}
                  <strong>{valueToPercent(arriveProbability)}</strong>
                </Typography>
                <CircleIcon sx={{ color: valueToColor(departProbability) }} />
                <Typography sx={{ pl: 1, pr: 5 }}>
                  Depart Next Trip On-time:{' '}
                  <strong>{valueToPercent(departProbability)}</strong>
                </Typography>
              </Grid>
              <Grid item md={2} lg={3}></Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
