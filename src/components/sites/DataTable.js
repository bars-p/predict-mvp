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
import Title from '../layout/Title';

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
  const { order, orderBy, onRequestSort, headers } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map(headCell => (
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
  headers: PropTypes.array.isRequired,
};

export function EnhancedTableToolbar(props) {
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

export function EnhancedTable(props) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const { onEdit, headers, items, deleteItem } = props;

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
        headers={headers}
      />
      <TableBody>
        {items
          .sort(getComparator(order, orderBy))
          .map((row, index) => (
          <TableRow key={row.id} hover>
            <TableCell align='right' padding='none'>{index+1}</TableCell>
            <TableCell sx={{ py: 1 }}>{row.name}</TableCell>
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
                  disabled={row.ladsNumber}
                  size='small' 
                  sx={{ ml: 1 }}
                  onClick={() => deleteItem(row.id)}
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
