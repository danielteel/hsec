import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CameraIndoorIcon from '@mui/icons-material/CameraIndoor';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

import AppRouter from './AppRouter';
import { Link } from 'wouter';
import LogoutButton from './components/LogoutButton';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © Dan Teel ' + new Date().getFullYear()}
        </Typography>
    );
}

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

const MenuItemLink = ({ text, icon, href }) => {
    return (
        <Link href={href}>
            <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </Link>
    );
}

export default function Dashboard() {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex'}}>
            <AppBar  position="absolute" open={open}>
                <Toolbar variant='dense' sx={{ pr: '24px' }}>
                    <IconButton children={<MenuIcon/>} edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{mr: '36px', ...(open && {display: 'none'})}}/>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1}}>
                        DAN
                    </Typography>
                    <LogoutButton/>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar variant='dense' sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 1}}>
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <MenuItemLink text="Home" href='/' icon={<CameraIndoorIcon/>}/>
                    <Divider sx={{my: 1}} />
                    <MenuItemLink text="Users" href='/users' icon={<PeopleIcon/>}/>
                    <MenuItemLink text="Settings" href='/settings' icon={<DisplaySettingsIcon/>}/>
                    <Divider sx={{my: 1}} />
                    <MenuItemLink text="Profile" href='/profile' icon={<AccountCircleIcon/>} />
                </List>
            </Drawer>
            <Box component="main" sx={{backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900], flexGrow: 1, height:'100vh', display: 'flex', flexDirection:'column', overflow: 'auto'}}>
                <Toolbar variant='dense' />{/*use this to align content correctly*/}
                <Container maxWidth="lg" sx={{my: 3, flexGrow: 1, display: 'flex', flexDirection:'column'}}>
                            <AppRouter/>
                </Container>
                    <Copyright sx={{ py: 1 }} />
            </Box>
        </Box>
    );
}