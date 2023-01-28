import React, { useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Chart';
import SimpleTable from '../layout/SimpleTable';
import { DataContext } from '../../contexts/DataContext';
import { useRouter } from 'next/router';

const mdTheme = createTheme();

export default function Dashboard() {
  const router = useRouter();
  const sitesRoute = '/sites';
  const segmentsRoute = '/segments';
  const ladsRoute = '/lads';
  const { settings, sites, segments, lads } = useContext(DataContext);

  const getSiteCodeById = (id) => {
    return sites.find((site) => site.id == id)?.short || '?';
  };

  const getSiteNameById = (id) => {
    return sites.find((site) => site.id == id)?.name || 'Not found';
  };

  const siteHeaders = [
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      text: 'Site Name',
      sort: true,
    },
    {
      id: 'code',
      numeric: false,
      disablePadding: false,
      text: 'Site Code',
      sort: true,
    },
  ];
  const siteItems = sites.map((site) => ({
    id: site.id,
    name: site.name,
    code: site.short,
  }));

  const segmentHeaders = [
    {
      id: 'segment',
      numeric: false,
      disablePadding: false,
      text: 'Direction',
      sort: true,
    },
    // {
    //   id: 'sites',
    //   numeric: false,
    //   disablePadding: false,
    //   text: 'Sites',
    //   sort: true,
    // },
    {
      id: 'length',
      numeric: false,
      disablePadding: false,
      text: 'Length (m)',
      sort: true,
    },
  ];
  const segmentItems = segments.map((segment) => ({
    id: segment.id,
    segment: `${getSiteCodeById(segment.startSiteId)} ➙ ${getSiteCodeById(
      segment.endSiteId
    )}`,
    // sites: `${getSiteNameById(segment.startSiteId)} --> ${getSiteNameById(segment.endSiteId)}`,
    length: segment.length,
  }));

  const ladHeaders = [
    {
      id: 'code',
      numeric: false,
      disablePadding: false,
      text: 'Code',
      sort: true,
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      text: 'LAD name',
      sort: true,
    },
    // {
    //   id: 'sites',
    //   numeric: false,
    //   disablePadding: false,
    //   text: 'Sites',
    //   sort: true,
    // },
  ];
  const ladItems = lads.map((lad) => ({
    id: lad.id,
    code: lad.code,
    name: `${getSiteNameById(lad.siteIds[0])} - ${getSiteNameById(
      lad.siteIds[lad.siteIds.length - 1]
    )}`,
    // sites: lad.siteIds.length,
  }));

  return (
    <ThemeProvider theme={mdTheme}>
      <Grid container spacing={3} sx={{ height: '83vh' }}>
        {/* Sites */}
        <Grid item sm={12} md={4}>
          <Paper
            onClick={() => router.push(sitesRoute)}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '35vh',
              cursor: 'pointer',
            }}
          >
            <SimpleTable
              title='Sites'
              headers={siteHeaders}
              items={siteItems}
            />
          </Paper>
        </Grid>
        {/* Segments */}
        <Grid item sm={12} md={4}>
          <Paper
            onClick={() => router.push(segmentsRoute)}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '35vh',
              cursor: 'pointer',
            }}
          >
            <SimpleTable
              title='Segments'
              headers={segmentHeaders}
              items={segmentItems}
            />
          </Paper>
        </Grid>
        {/* LADs */}
        <Grid item sm={12} md={4}>
          <Paper
            onClick={() => router.push(ladsRoute)}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '35vh',
              cursor: 'pointer',
            }}
          >
            <SimpleTable title='LADs' headers={ladHeaders} items={ladItems} />
          </Paper>
        </Grid>
        {/* Chart */}
        <Grid item sm={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '45vh',
            }}
          >
            <Chart coefficients={settings.dayPeriodCoefficients} />
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
