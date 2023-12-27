import React, { useState, useEffect, useContext } from 'react';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Title from './Title';
import ApiContext from '../../contexts/ApiContext';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import UserContext from '../../contexts/UserContext';
import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';

export default function Profile() {
    const {user} = useContext(UserContext);

    const api = useContext(ApiContext);
    const [changePasswordOpen, setChangePasswordOpen] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    const [inProgress, setInProgress] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState(null);

    const handleClose = (overrideInprogress) => {
        if (inProgress && !overrideInprogress) return;
        setInProgress(false);
        setChangePasswordError(null);
        setOldPassword('');
        setNewPassword('');
        setNewPasswordAgain('');
        setChangePasswordOpen(false);
    }

    const handleChangePasswordOpen = async () => {
        setChangePasswordError(null);
        setChangePasswordOpen(true);
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setChangePasswordError(null);
        setInProgress(true);
        try {
            if (newPassword !== newPasswordAgain){        
                setChangePasswordError('Passwords dont match, double check that they are the same');
            }else if (!newPassword.trim()){
                setChangePasswordError('Password cant be empty or just spaces');
            }else if (!oldPassword.trim()){
                setChangePasswordError('Current password cant be empty or just spaces');
            }else if (oldPassword===newPassword){
                setChangePasswordError('New password cannot be the same as the current password');
            }else{
                const [passed, response] = await api.userChangePassword(oldPassword, newPassword);
                if (!passed){
                    setChangePasswordError('Error: '+response.error);
                }else{
                    handleClose(true);
                }
            }
        }catch(e){
            setChangePasswordError('Error occured');
        }
        setInProgress(false);
    }

    return (
        <Container maxWidth='xs'>
            <Dialog open={changePasswordOpen} onClose={()=>handleClose()}>
                <form onSubmit={handleChangePassword}>
                    <DialogTitle>
                        Change Password
                    </DialogTitle>
                    <DialogContent>
                        <TextField disabled={true} fullWidth margin='dense' label='Email' type='email' value={user?.email}/>
                        <TextField disabled={inProgress} fullWidth margin='dense' label='Old password' type="password" required autoComplete="one-time-code" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
                        <TextField disabled={inProgress} fullWidth margin='dense' label='New password' type='password' autoComplete='new-password' required value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                        <TextField disabled={inProgress} fullWidth margin='dense' label='Confirm new password' type='password' autoComplete='new-password' required value={newPasswordAgain} onChange={(e)=>setNewPasswordAgain(e.target.value)}/>
                    </DialogContent>
                    <DialogActions disableSpacing>
                        <Alert severity='error' sx={{width:'100%', ...(changePasswordError?{}:{display:'none'})}}>{changePasswordError}</Alert>
                    </DialogActions>
                    <DialogActions>
                        <Button disabled={inProgress} onClick={()=>handleClose()}>Cancel</Button>
                        <LoadingButton loading={inProgress} type='submit'>Change Password</LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
            <Paper sx={{p: 1}}>
                <Title>Profile</Title>
                <Box >
                    <Grid container alignItems={'center'} spacing={1} rowSpacing={2} padding={1}>
                        <Grid item xs={8}>
                            <Typography variant='subtitle1'>Email</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant='subtitle1'>Role</Typography>
                        </Grid>                        
                        <Grid item xs={8}>
                            <Typography variant='body2'>{user.email}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant='body2'>{user.role}</Typography>
                        </Grid>
                        <Grid item sm={12} lg={4}>
                            <Button variant='outlined' fullWidth disabled>Change Email</Button>
                        </Grid>
                        <Grid item sm={12} lg={4}>
                            <Button variant='outlined' fullWidth onClick={handleChangePasswordOpen}>Change Password</Button>
                        </Grid>
                        <Grid item sm={12} lg={4}>
                            <Button variant='outlined' fullWidth disabled>Sign out everywhere</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}