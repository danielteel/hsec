import { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


import { Link as WouterLink, useLocation, useParams } from 'wouter';
import ApiContext from '../contexts/ApiContext';
import UserContext from '../contexts/UserContext';
import { Alert } from '@mui/material';
import Copyright from '../common/Copyright';

import { isValidEmail, isLegalPassword } from '../common/common';


export default function VerifyForgot() {
    const {setUser} = useContext(UserContext);
    const api = useContext(ApiContext);
    const [, setLocation] = useLocation();
    const params = useParams();
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        setError(null);
        event.preventDefault();
        try {
            const data = new FormData(event.currentTarget);
            const email = data.get('email');
            const confirmationCode = data.get('confirmationCode');
            const newPassword = data.get('newPassword')

            if (!isValidEmail(email)){
                setError('Invalid email address');
                return;
            }
            const passFailFor = isLegalPassword(newPassword);
            if (passFailFor){
                setError('Bad password: '+passFailFor);
                return;
            }

            const [passed, message] = await api.userPasswordChange(email, newPassword, confirmationCode);
            if (passed) {
                const [loggedIn, fetchedUser] = await api.userLogin(email, newPassword);
                if (loggedIn){            
                    setUser(fetchedUser);
                }else{
                    setLocation('/login');
                }
            }else{
                setError(message.error || 'Error occured');
            }
        }catch(e){
            setError('error occured');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Choose New Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        autoFocus={!params?.email}
                        defaultValue={params?.email || ''}
                    />                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="confirmationCode"
                        label="Confirmation Code"
                        name="confirmationCode"
                        autoFocus={!!params?.email && !params?.confirmCode}
                        autoComplete='one-time-code'
                        defaultValue={params?.confirmCode || ''}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="newPassword"
                        label="New Password"
                        type="password"
                        id="newPassword"
                        autoFocus={!!params?.email && !!params?.confirmCode}
                        autoComplete='new-password'
                        defaultValue={''}
                    />                         
                    {
                        error?
                            <Alert severity='error' style={{width:'100%'}}>{error}</Alert>
                        :
                            null
                    }
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Set New Password</Button>
                    <Grid container>
                        <Grid item xs>
                            <WouterLink href={"/forgotpassword/"+(params?.email || '')} variant="body2">Didnt get a code?</WouterLink>
                        </Grid>  
                        <Grid item>
                            <WouterLink href="/login" variant="body2">Back to login page</WouterLink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}