import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import App from './App/App';
import Login from './Login/Login';

import UserContext from './contexts/UserContext';
import ApiContext, {buildApiContext} from './contexts/ApiContext';

import { userMe } from './api/user';


export default function Main() {
    const [user, setUser] = useState(null);
    const [startingUp, setStartingUp] = useState(true);


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
                <CircularProgress size={100}/>
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
                        <Login />
                }
            </UserContext.Provider>
            </ApiContext.Provider>
        );
    }
}