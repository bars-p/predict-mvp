import * as React from 'react';
import { useRouter } from 'next/router';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import PolylineIcon from '@mui/icons-material/Polyline';
import PinDropIcon from '@mui/icons-material/PinDrop';
import HubIcon from '@mui/icons-material/Hub';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import { blue } from '@mui/material/colors';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

const configurationItems = [
  {
    text: 'Overview',
    icon: <DashboardIcon />,
    path: '/'
  },
  {
    text: 'Scheme',
    icon: <MapIcon />,
    path: '/scheme'
  },
  {
    text: 'Sites',
    icon: <PinDropIcon />,
    path: '/sites'
  },
  {
    text: 'Segments',
    icon: <PolylineIcon />,
    path: '/segments'
  },
  {
    text: 'LADs by Sites',
    icon: <HubIcon />,
    path: '/ladsbysites'
  },
  {
    text: 'LADs by Segments',
    icon: <CallSplitIcon />,
    path: '/ladsbysegments'
  },
];

const historicalItems = [
  {
    text: 'Runtimes',
    icon: <AccessTimeIcon />,
    path: '/runtimes'
  },
  {
    text: 'Analytics',
    icon: <QueryStatsIcon />,
    path: '/analytics'
  },
];

const predictionItems = [
  {
    text: 'Probabilities',
    icon: <DepartureBoardIcon />,
    path: '/probabilities'
  },
  {
    text: 'Monitor',
    icon: <DisplaySettingsIcon />,
    path: '/monitor'
  },
  {
    text: 'Simulation',
    icon: <AutoModeIcon />,
    path: '/simulation'
  },
];

export default function Layout({ children }) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const router = useRouter();
  console.log(router.pathname); // FIXME:

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Trips Statistics Analysis and Prediction
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListSubheader component="div" inset>
              Configuration
            </ListSubheader>
            {configurationItems.map(item => (
              <ListItemButton 
                key={item.text} 
                onClick={() => router.push(item.path)}
                sx={{
                  backgroundColor: router.pathname == item.path ? blue[50] : null,
                }}
              >
                <ListItemIcon 
                  sx={{
                    pl: '7px'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
              Historical
            </ListSubheader>
            {historicalItems.map(item => (
              <ListItemButton 
                key={item.text} 
                onClick={() => router.push(item.path)}
                sx={{
                  backgroundColor: router.pathname == item.path ? blue[50] : null,
                }}
              >
                <ListItemIcon 
                  sx={{
                    pl: '7px'
                  }}
                >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
              Prediction
            </ListSubheader>
            {predictionItems.map(item => (
              <ListItemButton 
                key={item.text} 
                onClick={() => router.push(item.path)}
                sx={{
                  backgroundColor: router.pathname == item.path ? blue[50] : null,
                }}
              >
                <ListItemIcon 
                  sx={{
                    pl: '7px'
                  }}
                >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
            theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            { children }
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
