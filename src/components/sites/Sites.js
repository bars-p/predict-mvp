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
        } else {
          const newItem = { ...item, id: getNextId() };
          addSite(newItem);
        }
      } else {
        console.error('Incomplete Object Passed', item);
      }
    }
    setOpen(false);
  };

  const { sites, addSite, updateSite, deleteSite } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Dialog Title');
  const [item, setItem] = useState(getDefaultItem());


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
                items={sites}
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
    </ThemeProvider>
  );
}
