import React, { useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../old/Chart';
// import Deposits from './Deposits';
import Orders from '../old/Orders';
import SimpleTable from '../layout/SimpleTable';
import { DataContext } from '../../contexts/DataContext';
import { useRouter } from 'next/router';

const mdTheme = createTheme();

export default function Dashboard() {
  const router = useRouter();
  const sitesRoute = '/sites';
  const { sites } = useContext(DataContext);
  const sitesHeaders = [
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
  const siteItems = sites.map(site => ({
    id: site.id,
    name: site.name,
    code: site.short,
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
              headers={sitesHeaders}
              items={siteItems}
            />
          </Paper>
        </Grid>
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
              headers={sitesHeaders}
              items={siteItems}
            />
          </Paper>
        </Grid>
        {/* Sites */}
        <Grid item sm={12} md={4}>
          <Paper
            onClick={() => console.log('Sites Clicked')}
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
              headers={sitesHeaders}
              items={siteItems}
            />
          </Paper>
        </Grid>
        {/* Chart */}
        <Grid item sm={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '35vh',
            }}
          >
            <Chart />
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
