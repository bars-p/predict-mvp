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

export default function Lads() {
  const getDefaultItem = () => ({
    id: undefined,
    code: '',
    siteIds: [],
    segmentIds: [],
  });
  const getItemById = (id) => {
    let item = lads.find(site => site.id == id);
    if (item == undefined) {
      item = getDefaultItem();
    }
    return item;
  };
  const getNextId = () => {
    const ids = lads.map(site => site.id);
    return Math.max(...ids) + 1;
  };
  // TODO:
  // FIXME: Check Segments, create new, make inactive not used
  const processClose = (saveItem) => { 
    if (saveItem) {
      if (item.code && item.siteIds.length >= 2) {
        if (item.id) {
          // TODO: Create SegmentIDS from SiteIds
          // TODO: Create new Segments when needed
          // TODO: Update Site's LadIds
          // updateLad(item);
          console.log('Update LAD:', item);
          showInfo('success', 'Item Updated');
        } else {
          const newItem = { ...item, id: getNextId() };
          // TODO: Create SegmentIDS from SiteIds
          // TODO: Create new Segments when needed
          // TODO: Update Site's LadIds
          // addLad(newItem);
          console.log('Add LAD:', newItem);
          showInfo('success', 'Item Added');
        }
      } else {
        console.error('Incomplete Object Passed', item);
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

  const { sites, segments, lads, addLad, updateLad, deleteLad } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Dialog Title');
  const [item, setItem] = useState(getDefaultItem());
  const [openInfo, setOpenInfo] = useState(false);
  const [infoText, setInfoText] = useState('');
  const [infoSeverity, setInfoSeverity] = useState('info')

  const getSiteNameById = (id) => {
    return sites.find(site => site.id == id)?.name || 'Not found';
  };

  const getLadLength = (ladSegmentIds) => {
    // console.log('Segments:', ladSegmentIds);
    const length = ladSegmentIds.reduce((acc, cur) => {
      const segmentLength = segments.find(seg => seg.id == cur)?.length;
      // console.log(cur, segmentLength);
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
      id: 'action',
      numeric: false,
      disablePadding: false,
      text: '',
      sort: false,
    },
  ];
  
  const tableData = lads.map(lad => ({
    id: lad.id,
    code: lad.code,
    fromSite: getSiteNameById(lad.siteIds[0]),
    toSite: getSiteNameById(lad.siteIds[lad.siteIds.length - 1]),
    sitesNumber: lad.siteIds.length,
    length: getLadLength(lad.segmentIds),
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
              onAdd={() => {
                setTitle('Add LAD');
                setItem(getDefaultItem())
                setOpen(true);
              }}
            >
              LADs ({lads.length})
            </EnhancedTableToolbar>
            <TableContainer>
              <EnhancedTable
                onEdit={(id) => {
                  setTitle('Edit LAD');
                  setItem(getItemById(id)); 
                  setOpen(true);
                }}
                headers={tableHeaders}
                items={tableData}
                deleteItem={deleteLad}
              />
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <EditDialog 
        open={open} 
        title={title} 
        item={item} 
        setItem={setItem} 
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
