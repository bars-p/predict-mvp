import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { blue, grey } from '@mui/material/colors'
import { border, Box } from '@mui/system';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DataContext } from '../../contexts/DataContext';


export default function EditDialog(props) {
  const { open, onClose, title, item, setItem } = props;

  const { sites } = useContext(DataContext);

  const [query, setQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const sortedFilteredSites = [...sites]
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      else {
        return 1;
      }
    })
    .map(item => ({...item, id: item.id.toString()}))
    .filter(site => site.name.toLowerCase().includes(query));

  const deleteSite = (index) => {
    let ids = [...item.siteIds];
    ids.splice(index, 1);
    setItem({
      ...item,
      siteIds: [...ids],
    });
  };
  
  const handleClose = () => {
    setQuery('');
    onClose(false);
  };
  
  const handleSave = () => {
    setQuery('');
    onClose(true);
  };

  const onDragStart = () => {
    setIsDragging(true);
  }

  const onDragEnd = (result) => {
    setIsDragging(false);
    console.log('Drag Ended:', result);
    const { source, destination, draggableId} = result;
    if (!destination) {
      return;
    }
    if (source.droppableId == destination.droppableId && source.index == destination.index) {
      return;
    }
    if (source.droppableId == destination.droppableId) {
      let ids = [...item.siteIds];
      ids.splice(destination.index, 0, ids.splice(source.index, 1));
      setItem({
        ...item,
        siteIds: [...ids],
      });
    }
    if (source.droppableId == 'allSites' && destination.droppableId == 'ladSites') {
      let ids = [...item.siteIds];
      ids.splice(destination.index, 0, +draggableId);
      setItem({
        ...item,
        siteIds: [...ids],
      });
    }
  };

  return (
    <div>
      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{sx: {minWidth: 700}}}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DragDropContext
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField 
                  margin="none"
                  id="code"
                  label="LAD Name"
                  type="text"
                  variant="standard"
                  value={item.code}
                  onChange={(e) => setItem({ ...item, code: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{ pt: 2, pb: 1 }}
                >
                  LAD Sites:
                </Typography>
                  <Box
                    sx={{
                      maxHeight: 300,
                      height: 300,
                      overflow: 'auto',
                      borderLeft: 3,
                      borderColor: isDragging ? blue[500] : 'lightgrey',
                      background: isDragging ? grey[50] : 'inherit'
                    }}
                  >
                    <Droppable
                      droppableId='ladSites'
                    >
                      {provided => (
                        <List 
                          dense
                          ref={provided.innerRef} 
                          {...provided.droppableProps}
                          sx={{
                            minHeight: 300,
                          }}
                        >
                          <Divider />
                          {item.siteIds
                            .map(id => sites.find(site => site.id == id))
                            .map((item, idx) => ({ ...item, id: 'site-' + idx}))
                            .map((site, index) => (
                              <Draggable 
                                draggableId={site?.id.toString() || '0'}
                                index={index}
                                key={site?.id.toString() || '0'}
                              >
                                {(provided, snapshot) =>(
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <ListItem
                                      secondaryAction={
                                        <IconButton 
                                          disabled={item.siteIds.length <= 2}
                                          edge="end" 
                                          size='small'
                                          onClick={() => deleteSite(index)}
                                        >
                                          <DeleteIcon fontSize='inherit' />
                                        </IconButton>
                                      }
                                      sx={{
                                        background: snapshot.isDragging ? blue[100] : 'inherit',
                                        transition: 'background-color 0.2sec ease',
                                      }}
                                    >
                                      <ListItemAvatar>
                                        <Avatar 
                                          variant='circular'
                                          sx={{
                                            width: '2rem', 
                                            height: '2rem', 
                                          }}
                                        >
                                          {site?.short || '?'}
                                        </Avatar>
                                      </ListItemAvatar>
                                      <ListItemText 
                                        primary={site?.name || 'Not found'}
                                      />
                                    </ListItem>
                                    <Divider />
                                  </div>
                                )}
                              </Draggable>
                          ))}
                          {provided.placeholder}
                        </List>
                      )}
                    </Droppable>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{ display: 'flex' }}
                >
                  <Typography
                    sx={{ pt: 2, pb: 1 }}
                  >
                    Sites:
                  </Typography>
                  <div className='spacer'></div>
                  <TextField 
                    label='Search'
                    id='search'
                    size='small'
                    variant="standard"
                    width={30}
                    value={query}
                    onChange={(e) => setQuery(e.target.value.toLowerCase())}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!query  && <SearchIcon />}
                          {query  && 
                            <ClearIcon 
                              sx={{ cursor: 'pointer' }}
                              onClick={() => setQuery('')}
                            />
                          }
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    maxHeight: 300,
                    height: 300,
                    overflow: 'auto',
                    borderLeft: 2,
                    borderColor: 'lightgrey'
                  }}
                >
                  <Droppable droppableId='allSites' isDropDisabled>
                    {(provided) => (
                      <List 
                        dense
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <Divider />
                        {sortedFilteredSites.map((site, index) => (
                          <Draggable
                            key={site.id}
                            draggableId={site.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ListItem
                                  sx={{
                                    background: snapshot.isDragging ? blue[100] : 'inherit',
                                    transition: 'background-color 0.2sec ease',
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar 
                                      variant='circular'
                                      sx={{
                                        width: '2rem', 
                                        height: '2rem', 
                                      }}
                                    >
                                      {site.short}
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText 
                                    primary={site.name}
                                  />
                                </ListItem>
                                <Divider />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </List>
                    )}
                  </Droppable>
                </Box>
              </Grid>
            </Grid>
          </DragDropContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}