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



export default function Sites() {
  const getDefaultItem = () => ({
    id: undefined,
    name: '',
    short: '',
    ladsList: [],
    point: [0, 0],
  });
  const getItemById = (id) => {
    let item = sites.find(site => site.id == id);
    if (item == undefined) {
      item = getDefaultItem();
    }
    return item;
  };
  const getNextId = () => {
    const ids = sites.map(site => site.id);
    return Math.max(...ids) + 1;
  };
  const processClose = (saveItem) => {
    if (saveItem) {
      if (item.name && item.short) {
        if (item.id) {
          updateSite(item);
          showInfo('success', 'Item Updated');
        } else {
          const newItem = { ...item, id: getNextId() };
          addSite(newItem);
          showInfo('success', 'Item Added');
        }
      } else {
        console.error('Incomplete Object Passed', item);
        showInfo('error', 'Incomplete data provided');
      }
    }
    setOpen(false);
  };
  const showInfo = (severity, text) => {
    setInfoText(text);
    setInfoSeverity(severity);
    setOpenInfo(true);
  };

  const { sites, addSite, updateSite, deleteSite } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Dialog Title');
  const [item, setItem] = useState(getDefaultItem());
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
    {
      id: 'ladsNumber',
      numeric: false,
      disablePadding: false,
      text: 'LADs Passed',
      sort: true,
    },
    {
      id: 'ladsName',
      numeric: false,
      disablePadding: false,
      text: 'LADs Names',
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
  
  const tableData = sites.map(site => ({
    id: site.id,
    name: site.name,
    code: site.short,
    ladsNumber: site.ladsList.length,
    ladsName: site.ladsList.join(', '),
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
                setTitle('Add Site');
                setItem(getDefaultItem())
                setOpen(true);
              }}
            >
              Sites ({sites.length})
            </EnhancedTableToolbar>
            <TableContainer>
              <EnhancedTable
                onEdit={(id) => {
                  setTitle('Edit Site');
                  setItem(getItemById(id)); 
                  setOpen(true);
                }}
                headers={tableHeaders}
                items={tableData}
                deleteItem={deleteSite}
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
