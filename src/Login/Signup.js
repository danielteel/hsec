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
import { Alert } from '@mui/material';
import Copyright from '../common/Copyright';

import { isValidEmail } from '../common/common';


export default function Signup() {
    const api = useContext(ApiContext);
    const [, setLocation] = useLocation();
    const [error, setError] = useState(null);
    const params = useParams();

    const handleSubmit = async (event) => {
        setError(null);
        event.preventDefault();
        try {
            const data = new FormData(event.currentTarget);
            const email = data.get('email');
            if (isValidEmail(email)){
                const [passed, message] = await api.userCreate(email);
                if (passed) {
                    setLocation('/verifysignup/'+email);
                }else{
                    setError(message.error || 'Error occured');
                }
            }else{
                setError('Invalid email address');
            }
        }catch (e){
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
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="off"
                        type="email"
                        defaultValue={params?.email || ''}
                        autoFocus
                    />                    
                    {
                        error?
                            <Alert severity='error' style={{width:'100%'}}>{error}</Alert>
                        :
                            null
                    }
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Send Email</Button>
                    <Grid container>   
                        <Grid item xs>
                            <WouterLink href="/verifysignup" variant="body2">I already have a confirmation code</WouterLink>
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