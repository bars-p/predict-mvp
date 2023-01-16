import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WebAssetOffIcon from '@mui/icons-material/WebAssetOff';

const NotFound = () => {
  return (
    <Box
      sx={{
        height: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
      <Paper
        sx={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 1/3,
          height: 1/5
        }}
      >
        <WebAssetOffIcon fontSize='large' sx={{ m: 1 }} color='error' />
        <Typography variant='h6' color='error'>
          Page not found
        </Typography>
      </Paper>
    </Box>
  );
}
 
export default NotFound;