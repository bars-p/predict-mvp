import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import { DataContext } from '../../contexts/DataContext';
import { EnhancedTableToolbar, EnhancedTable } from './DataTable';
import TimetableDialog from './TimetableDialog';
import Info from '../layout/Info';

const mdTheme = createTheme();

export default function Runtimes() {
  const getDefaultLadItem = () => ({
    id: undefined,
    code: '',
    siteIds: [],
    segmentIds: [],
    serviceTime: { start: '', end: '' },
    headways: [],
  });
  const getLadById = (id) => {
    let lad = lads.find((ld) => ld.id == id);
    if (lad == undefined) {
      lad = getDefaultLadItem();
    }
    return lad;
  };

  const getDefaultTimetableItem = () => ({
    id: undefined,
    ladId: undefined,
    lad: getLadById(undefined),
    departures: [],
  });

  const getTimetableByLadId = (id) => {
    const [timetable] = [...timetables.filter((tt) => tt.ladId == id)];
    console.log('LAD id:', id); // FIXME:
    console.log('TT Found:', timetable);
    return {
      id: timetable?.id || undefined,
      ladId: id,
      lad: getLadById(id),
      departures: timetable?.departures || [],
    };
  };

  const getRuntimesByLadId = (id) => {
    return [];
  };

  const processTimetable = (saveItem) => {
    if (saveItem) {
      // TODO: Store TT
    }
    setOpenTimetable(false);
  };

  const showInfo = (severity, text) => {
    setInfoText(text);
    setInfoSeverity(severity);
    setOpenInfo(true);
  };

  const {
    // FIXME:
    config,
    sites,
    segments,
    lads,
    timetables,
    renewTimetables,
    runtimes,
    renewRuntimes,
  } = useContext(DataContext);

  // const [item, setItem] = useState(getDefaultItem()); // FIXME:
  const [timetable, setTimetable] = useState(getDefaultTimetableItem());
  const [openTimetable, setOpenTimetable] = useState(false);
  const [openRuntimes, setOpenRuntimes] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [infoText, setInfoText] = useState('');
  const [infoSeverity, setInfoSeverity] = useState('info');

  const getSiteNameById = (id) => {
    return sites.find((site) => site.id == id)?.name || 'Not found';
  };

  const getLadLength = (ladSegmentIds) => {
    const length = ladSegmentIds.reduce((acc, cur) => {
      const segmentLength = segments.find((seg) => seg.id == cur)?.length;
      return acc + segmentLength;
    }, 0);
    return length;
  };

  const tableHeaders = [
    {
      id: 'number',
      numeric: true,
      disablePadding: true,
      text: '#',
      sort: false,
    },
    {
      id: 'code',
      numeric: false,
      disablePadding: false,
      text: 'LAD',
      sort: true,
    },
    {
      id: 'fromSite',
      numeric: false,
      disablePadding: false,
      text: 'From Site',
      sort: true,
    },
    {
      id: 'toSite',
      numeric: false,
      disablePadding: false,
      text: 'To Site',
      sort: true,
    },
    {
      id: 'sitesNumber',
      numeric: false,
      disablePadding: false,
      text: 'Sites',
      sort: true,
    },
    {
      id: 'length',
      numeric: true,
      disablePadding: false,
      text: 'LAD Length',
      sort: false,
    },
    {
      id: 'timetable',
      numeric: false,
      disablePadding: false,
      text: 'Time Table',
      sort: true,
    },
    {
      id: 'runtimes',
      numeric: false,
      disablePadding: false,
      text: 'Runtimes',
      sort: true,
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: false,
      text: '',
      sort: false,
    },
  ];

  const tableData = lads
    .filter(
      (lad) =>
        lad.headways.length > 0 && lad.serviceTime.start && lad.serviceTime.end
    )
    .map((lad) => ({
      id: lad.id,
      code: lad.code,
      fromSite: getSiteNameById(lad.siteIds[0]),
      toSite: getSiteNameById(lad.siteIds[lad.siteIds.length - 1]),
      sitesNumber: lad.siteIds.length,
      length: getLadLength(lad.segmentIds),
      headways: lad.headways.length > 0,
      timetable: timetables.filter((item) => item.ladId == lad.id),
      runtimes: runtimes.filter((item) => item.ladId == lad.id),
      action: null,
    }));

  return (
    <ThemeProvider theme={mdTheme}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '83vh',
            }}
          >
            <EnhancedTableToolbar
              onRegenerate={() => {
                console.log('Regenerate Runtimes');
              }}
            >
              Runtimes and Time Table for LADs (ready: {tableData.length})
            </EnhancedTableToolbar>
            <TableContainer>
              <EnhancedTable
                onTimetable={(id) => {
                  setTimetable(getTimetableByLadId(id));
                  console.log('Time Table', timetable);
                  setOpenTimetable(true);
                }}
                onRuntimes={(id) => {
                  setRuntimes(getRuntimesByLadId(id));
                  setOpenRuntimes(true);
                }}
                headers={tableHeaders}
                items={tableData}
              />
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <TimetableDialog
        open={openTimetable}
        title='Headways title'
        item={timetable}
        setItem={setTimetable}
        onClose={processTimetable}
      />
      <Info
        open={openInfo}
        setOpen={setOpenInfo}
        text={infoText}
        severity={infoSeverity}
      />
    </ThemeProvider>
  );
}