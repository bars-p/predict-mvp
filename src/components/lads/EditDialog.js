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
import { DataContext } from '../../contexts/DataContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Avatar, Divider, IconButton, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { border, Box } from '@mui/system';

export default function EditDialog(props) {
  const { open, onClose, title, item, setItem } = props;

  const { sites } = useContext(DataContext);

  const [query, setQuery] = useState('');

  const sortedFilteredSites = [...sites]
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      else {
        return 1;
      }
    })
    .filter(site => site.name.toLowerCase().includes(query));

  // FIXME: Possibly not needed
  const ladSites = item.siteIds.map(id => sites.find(site => site.id == id));

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

  return (
    <div>
      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{sx: {width: 700}}}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
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
                  borderLeft: 2,
                  borderColor: 'lightgrey'
                }}
                >
                <List 
                  dense
                >
                  <Divider />
                  {item.siteIds
                    .map(id => sites.find(site => site.id == id))
                    .map((site, index) => (
                    <React.Fragment key={site?.id || '0'}>
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
                    </React.Fragment>
                  ))}
                </List>
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
                <List 
                  dense
                >
                  <Divider />
                  {sortedFilteredSites.map(site => (
                    <React.Fragment key={site.id}>
                      <ListItem>
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
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}