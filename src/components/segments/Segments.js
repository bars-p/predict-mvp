import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import { DataContext } from '../../contexts/DataContext';
import EditDialog from './EditDialog';
import { EnhancedTableToolbar, EnhancedTable } from './DataTable';
import Info from '../layout/Info';

const mdTheme = createTheme();

export default function Segments() {
  const getDefaultItem = () => ({
    id: undefined,
    startSiteId: undefined,
    endSiteId: undefined,
    length: 0,
    speed: config.defaultSpeed,
  });
  const getItemById = (id) => {
    let item = segments.find(segment => segment.id == id);
    if (item == undefined) {
      item = getDefaultItem();
    }
    return item;
  };
  const getDefaultTableItem = () => ({
      id: undefined,
      direction: '? –> ?',
      sites: 'Data not found',
      length: 0,
      speed: 0,
      action: null,
  });
 
  const getTableItem = (id) => {
    let item = tableData.find(item => item.id == id); 
    if (item == undefined) {
      item = getDefaultTableItem();
    }
    return item;
  };

  const getSiteCodeById = (id) => {
    return sites.find(site => site.id == id)?.short || '?';
  };
  
  const getSiteNameById = (id) => {
    return sites.find(site => site.id == id)?.name || 'Not found';
  };

  const processClose = (saveItem) => {
    if (saveItem) {
      if (tableItem.id && tableItem.length > 0) {
        updateSegment({
          ...item,
          speed: +tableItem.speed,
          length: +tableItem.length,
        }); 
        showInfo('success', 'Item Updated');
      } else {
        console.error('Errored Object Passed', tableItem);
        showInfo('error', 'Incorrect data provided');
      }
    }
    setOpen(false);
  };

  const showInfo = (severity, text) => {
    setInfoText(text);
    setInfoSeverity(severity);
    setOpenInfo(true);
  };

  const { config, sites, segments, updateSegment } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Dialog Title');
  const [item, setItem] = useState(getDefaultItem());
  const [tableItem, setTableItem] = useState(getDefaultTableItem());
  const [openInfo, setOpenInfo] = useState(false);
  const [infoText, setInfoText] = useState('');
  const [infoSeverity, setInfoSeverity] = useState('info')

  const tableHeaders = [
    {
      id: 'number',
      numeric: true,
      disablePadding: true,
      text: '#',
      sort: false,
    },
    {
      id: 'direction',
      numeric: false,
      disablePadding: false,
      text: 'Direction',
      sort: true,
    },
    {
      id: 'sites',
      numeric: false,
      disablePadding: false,
      text: 'Sites',
      sort: true,
    },
    {
      id: 'length',
      numeric: true,
      disablePadding: false,
      text: 'Length',
      sort: true,
    },
    {
      id: 'speed',
      numeric: true,
      disablePadding: false,
      text: 'Free Speed',
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

  const tableData = segments.map(segment => ({
    id: segment.id,
    direction: `${getSiteCodeById(segment.startSiteId)} –> ${getSiteCodeById(segment.endSiteId)}`,
    sites: `${getSiteNameById(segment.startSiteId)} – ${getSiteNameById(segment.endSiteId)}`,
    length: segment.length,
    speed: segment.speed,
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
              maxHeight: '83vh' 
            }}
          >
            <EnhancedTableToolbar 
            >
              Segments ({segments.length})
            </EnhancedTableToolbar>
            <TableContainer>
              <EnhancedTable
                onEdit={(id) => {
                  setTitle('Edit Segment Data');
                  setItem(getItemById(id));
                  setTableItem(getTableItem(id)); 
                  setOpen(true);
                }}
                headers={tableHeaders}
                items={tableData}
              />
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <EditDialog 
        open={open} 
        title={title} 
        item={tableItem} 
        setItem={setTableItem} 
        onClose={processClose} 
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
