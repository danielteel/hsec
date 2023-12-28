import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import App from './App/App';
import Authenticate from './Login/Authenticate';

import {AppProvider, useAppContext} from './contexts/AppContext';

function Render(){
    const {user, startingUp} = useAppContext();

    if (startingUp){
        return (
            <Box sx={{ display: 'flex', width:'100dvw', height:'100dvh', alignItems:'center', justifyContent:'center' }}>
                <CircularProgress size={80}/>
            </Box>
        );
    }

    return (
            user ?
                <App />
            :
                <Authenticate />
    );
}

export default function Main() {
    return (
        <AppProvider>
            <Render/>
        </AppProvider>
    );
}