import React, { useState, useEffect, useContext } from 'react';
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Title from './Title';
import ApiContext from '../../contexts/ApiContext';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import UserContext from '../../contexts/UserContext';
import Box from '@mui/material/Box';
import { useLocation, useParams } from 'wouter';
import { laxStringsEqual } from '../../common/common';
import { LoadingButton } from '@mui/lab';

export default function Profile() {
    const {user} = useContext(UserContext);
    const [location, setLocation] = useLocation();
    const params=useParams();
    const paramEmail= params?.email?decodeURIComponent(params?.email):null;
    const paramConfirmCode=laxStringsEqual(paramEmail, user.email) ? params?.confirmCode ? decodeURIComponent(params?.confirmCode) : null : null;
    if (paramEmail && !paramConfirmCode){
        setLocation('/profile');
    }

    const api = useContext(ApiContext);
    const [changePasswordOpen, setChangePasswordOpen] = useState(!!paramConfirmCode);
    const [confirmCode, setConfirmCode] = useState(paramConfirmCode || '');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    const [inProgress, setInProgress] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState(null);

    const handleClose = (overrideInprogress) => {
        if (inProgress && !overrideInprogress) return;
        setInProgress(false);
        setChangePasswordError(null);
        setConfirmCode('');
        setNewPassword('');
        setNewPasswordAgain('');
        setChangePasswordOpen(false);
        setLocation('/profile');
    }

    const handleOpenPasswordReset = async () => {
        setChangePasswordError(null);
        setChangePasswordOpen(true);
        setInProgress(true);
        await api.userPasswordChange(user.email, null, null);
        setInProgress(false);
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
            }else if (!confirmCode.trim()){
                setChangePasswordError('Confirmation code cannot be empty');
            }else{
                const [passed, response] = await api.userPasswordChange(user.email, newPassword, confirmCode);
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
                    <DialogContentText>
                        Check your email for the confirmation code
                    </DialogContentText>
                        <TextField disabled={true} fullWidth margin='dense' label='Email' type='email' value={user?.email}/>
                        <TextField disabled={inProgress} fullWidth margin='dense' label='Confirmation Code' required autoComplete='one-time-code' value={confirmCode} onChange={(e)=>setConfirmCode(e.target.value)}/>
                        <TextField disabled={inProgress} fullWidth margin='dense' label='New password' type='password' autoComplete='new-password' required value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                        <TextField disabled={inProgress} fullWidth margin='dense' label='Confirm password' type='password' autoComplete='new-password' required value={newPasswordAgain} onChange={(e)=>setNewPasswordAgain(e.target.value)}/>
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
                            <Button variant='outlined' fullWidth onClick={handleOpenPasswordReset}>Change Password</Button>
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