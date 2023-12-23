import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import App from './App/App';
import Authenticate from './Login/Authenticate';

import UserContext from './contexts/UserContext';
import ApiContext, {buildApiContext} from './contexts/ApiContext';

import { userMe } from './api/user';


export default function Main() {
    const [user, setUser] = useState(null);
    const [startingUp, setStartingUp] = useState(true);

    console.log(user);

    useEffect(() => {
        async function loadUser() {
            const [passed, me] = await userMe();
            if (passed) {
                setUser(me);
            }
            setStartingUp(false);
        }
        loadUser();
    }, []);

    if (startingUp) {
        return (
            <Box sx={{ display: 'flex', width:'100vw', height:'100vh', alignItems:'center', justifyContent:'center' }}>
                <CircularProgress size={80}/>
            </Box>
        );
    } else {
        return (
            <ApiContext.Provider value={buildApiContext(setUser)}>
            <UserContext.Provider value={{ user, setUser }}>
                {
                    user ?
                        <App />
                    :
                        <Authenticate />
                }
            </UserContext.Provider>
            </ApiContext.Provider>
        );
    }
}