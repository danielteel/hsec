import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

import {Button} from '@mui/material';
import Paper from '@mui/material/Paper';
import Title from './Title';
import { useAppContext } from '../../contexts/AppContext';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeviceEditDialog from './DeviceEditDialog';
import DeviceAddDialog from './DeviceAddDialog';

export default function ManageDevices() {
    const [devices, setDevices] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editDevice, setEditDevice] = useState(null);

    const {api} = useAppContext();

    useEffect(() => {
        async function getDevices() {
            const [passed, fetchedDevices] = await api.devicesList();
            if (passed) {
                setDevices(fetchedDevices);
            }
        }
        getDevices();
    }, [api]);

    function updateDevice(device){
        if (devices && device?.device_id){
            setDevices([...devices.filter(d=>d.device_id!==device.device_id), device]);
        }
    }

    return (
        <Container maxWidth='sm'>
            <DeviceEditDialog updateDevice={updateDevice} open={editOpen} setOpen={setEditOpen} device={editDevice}/>
            <DeviceAddDialog api={api} devices={devices} setDevices={setDevices} open={addOpen} setOpen={setAddOpen}/>
            <Paper sx={{p:1, m:-2, display: 'flex', flexDirection: 'column'}}>
                <Title>Manage Devices</Title>
                <Grid container alignItems={'center'}>
                    <Grid item xs={3}>
                        <Typography variant='subtitle1'>Name</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography variant='subtitle1'>Encro Key</Typography>
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    {
                        devices?.map?.((d) => (
                            <React.Fragment key={d.device_id+d.encro_key}>
                                <Grid item xs={6}><Typography style={{overflowWrap:'anywhere'}} variant='body2'>{d.name}</Typography></Grid>
                                <Grid item xs={4}><Typography style={{overflowWrap:'anywhere'}} variant='body2'>{d.encro_key}</Typography></Grid>
                                <Grid item xs={2} textAlign='center'>
                                    <IconButton color="primary" onClick={()=>{setEditDevice(d); setEditOpen(true)}}>
                                        <EditIcon />
                                    </IconButton>
                                </Grid>
                            </React.Fragment>
                        ))
                    }
                    {devices?.length?null:<Grid item xs={12} textAlign='center'><Typography variant='body2'>No devices were found</Typography></Grid>}
                    <Grid item xs={12} sx={{ mt: 2 }} textAlign={'center'}><Button color='success' variant='contained' onClick={() => setAddOpen(true)}>Add</Button></Grid>
                </Grid>
            </Paper>
        </Container>
    );
}