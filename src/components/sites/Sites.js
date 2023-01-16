import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import Title from '../layout/Title';
import { DataContext } from '../../contexts/DataContext';
import EditDialog from './EditDialog';

const mdTheme = createTheme();

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

const sitesListOld = [
  {
    id: 1,
    name: 'Factory',
    short: 'A',
    ladsList: ['Lad-1-0-1'],
  },
  {
    id: 2,
    name: 'Main Street',
    short: 'B',
    ladsList: ['Lad-1-0-1', 'Lad-2-0-1', 'Lad-1-0-2'],
  },
  {
    id: 3,
    name: 'Central Park',
    short: 'C',
    ladsList: ['Lad-1-0-1', 'Lad-1-0-2'],
  },
  {
    id: 4,
    name: 'City Library',
    short: 'D',
    ladsList: ['Lad-1-0-1', 'Lad-2-0-1', 'Lad-1-0-2', 'Lad-2-0-2'],
  },
  {
    id: 5,
    name: 'City Hall',
    short: 'E',
    ladsList: ['Lad-2-0-2'],
  },
  {
    id: 11,
    name: 'Factory',
    short: 'A',
    ladsList: ['Lad-1-0-1'],
  },
  {
    id: 12,
    name: 'Main Street',
    short: 'B',
    ladsList: ['Lad-1-0-1', 'Lad-2-0-1', 'Lad-1-0-2'],
  },
  {
    id: 13,
    name: 'Central Park',
    short: 'C',
    ladsList: ['Lad-1-0-1', 'Lad-1-0-2'],
  },
  {
    id: 14,
    name: 'City Library',
    short: 'D',
    ladsList: ['Lad-1-0-1', 'Lad-2-0-1', 'Lad-1-0-2', 'Lad-2-0-2'],
  },
  {
    id: 15,
    name: 'City Hall',
    short: 'E',
    ladsList: ['Lad-2-0-2'],
  },
  {
    id: 21,
    name: 'Factory',
    short: 'A',
    ladsList: ['Lad-1-0-1'],
  },
  {
    id: 22,
    name: 'Main Street',
    short: 'B',
    ladsList: ['Lad-1-0-1', 'Lad-2-0-1', 'Lad-1-0-2'],
  },
  {
    id: 23,
    name: 'Central Park',
    short: 'C',
    ladsList: ['Lad-1-0-1', 'Lad-1-0-2'],
  },
  {
    id: 24,
    name: 'City Library',
    short: 'D',
    ladsList: ['Lad-1-0-1', 'Lad-2-0-1', 'Lad-1-0-2', 'Lad-2-0-2'],
  },
  {
    id: 25,
    name: 'City Hall',
    short: 'E',
    ladsList: ['Lad-2-0-2'],
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHeader(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {tableHeaders.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sort 
            ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.text}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted ascending' : 'sorted descending'}
                  </Box>
                ) : null}
              </TableSortLabel>)
            : headCell.text
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHeader.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar(props) {
  const { onAdd } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 0 },
        pr: { sm: 1},
      }}
    >
      <Title>{props.children}</Title>
      <div className='spacer'></div>
      <Tooltip title="Add">
        <IconButton size='large' onClick={onAdd}>
          <AddCircleIcon fontSize='inherit' />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  children: PropTypes.node,
  onAdd: PropTypes.func,
};

function EnhancedTable(props) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const { onEdit } = props;

  const { sites, deleteSite } = useContext(DataContext);
  const tableData = sites.map( site => ({
    id: site.id,
    name: site.name,
    code: site.short,
    ladsNumber: site.ladsList.length,
    ladsName: site.ladsList.join(', '),
    action: null,
  }));

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Table size="medium" stickyHeader>
      <EnhancedTableHeader 
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
      />
      <TableBody>
        {tableData
          .sort(getComparator(order, orderBy))
          .map((row, index) => (
          <TableRow key={row.id} hover>
            <TableCell align='right' padding='none'>{index+1}</TableCell>
            <TableCell  sx={{ py: 1 }}>{row.name}</TableCell>
            <TableCell sx={{ py: 1 }}>{row.code}</TableCell>
            <TableCell sx={{ py: 1 }}>{row.ladsNumber}</TableCell>
            <TableCell sx={{ py: 1 }}>{row.ladsName}</TableCell>
            <TableCell align='right' sx={{ py: 1 }}>
              <Tooltip title='Edit'>
                <IconButton 
                  size='small'
                  sx={{ ml: 1 }}
                  onClick={() => onEdit(row.id)}
                >
                  <EditIcon 
                    fontSize='inherit' 
                    />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete'>
                <IconButton 
                  size='small' 
                  sx={{ ml: 1 }}
                  onClick={() => deleteSite(row.id)}
                >
                  <DeleteIcon 
                    fontSize='inherit' 
                    />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

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

  const { sites, addSite, updateSite } = useContext(DataContext);
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
