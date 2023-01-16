import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import Title from './Title';
import { TableContainer } from '@mui/material';

// const tableHeaders = [
//   {
//     id: 'number',
//     numeric: true,
//     disablePadding: true,
//     text: '#',
//     sort: false,
//   },
//   {
//     id: 'name',
//     numeric: false,
//     disablePadding: false,
//     text: 'Site Name',
//     sort: true,
//   },
//   {
//     id: 'code',
//     numeric: false,
//     disablePadding: false,
//     text: 'Site Code',
//     sort: true,
//   },
//   {
//     id: 'ladsNumber',
//     numeric: false,
//     disablePadding: false,
//     text: 'LADs Passed',
//     sort: true,
//   },
//   {
//     id: 'ladsName',
//     numeric: false,
//     disablePadding: false,
//     text: 'LADs Names',
//     sort: false,
//   },
//   {
//     id: 'action',
//     numeric: false,
//     disablePadding: false,
//     text: '',
//     sort: false,
//   },
// ];

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

function SimpleTableHeader(props) {
  const { order, orderBy, onRequestSort, headers } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const firstColumn = {
    id: 'number',
    numeric: true,
    disablePadding: true,
    text: '#',
    sort: false,
  };

  return (
    <TableHead>
      <TableRow>
        {[firstColumn, ...headers].map(headCell => (
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

SimpleTableHeader.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
};

function SimpleTableToolbar(props) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 0 },
        pr: { sm: 1},
      }}
    >
      <Title>{props.children}</Title>
      <div className='spacer'></div>
    </Toolbar>
  );
};

SimpleTableToolbar.propTypes = {
  children: PropTypes.node,
};

export default function SimpleTable(props) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const { title, headers, items } = props;

  // const tableData = items.map( site => ({
  //   id: site.id,
  //   name: site.name,
  //   code: site.short,
  //   ladsNumber: site.ladsList.length,
  //   ladsName: site.ladsList.join(', '),
  //   action: null,
  // }));

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <React.Fragment>
      <SimpleTableToolbar>
        {title} ({items.length})
      </SimpleTableToolbar>
      <TableContainer>
        <Table size="small" stickyHeader>
          <SimpleTableHeader 
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headers={headers}
          />
          <TableBody>
            {items
              .sort(getComparator(order, orderBy))
              .map((row, index) => (
              <TableRow key={row.id} hover>
                <TableCell align='right' padding='none'>{index+1}</TableCell>
                {Object.entries(row).map(cell => (
                  (cell[0] != 'id' && <TableCell key={cell[0]}>{cell[1]}</TableCell>)
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};
