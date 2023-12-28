import React, { useEffect, useState } from 'react';
import { Paper, Button, IconButton, Typography, Container } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Grid from '@mui/material/Grid';

import { useAppContext } from '../../contexts/AppContext';
import Title from './Title';
import EditFormatDialog from './EditFormatDialog';
import AddFormatDialog from './AddFormatDialog';



export default function Settings() {
    const {api} = useAppContext();
    const [formats, setFormats] = useState(null);

    const [editItem, setEditItem] = useState({ open: false, item: null });
    const [addOpen, setAddOpen] = useState(false);
    const [addDefaults, setAddDefaults] = useState(null);


    useEffect(() => {
        let timeoutId = null;
        let cancel=false;
        async function getFormats() {
            if (cancel) return;
            const [passed, fetchedFormats] = await api.camGetDetails();
            if (passed) {
                setFormats(fetchedFormats);
            } else {
                timeoutId = setTimeout(getFormats, 2000);
            }
        }
        getFormats();

        return () => {
            cancel=true;
            if (timeoutId) clearTimeout(timeoutId);
        }
    }, [api]);


    return (
        <Container maxWidth='sm'>
            <Paper sx={{ p: 1, m:-2, display: 'flex', flexDirection: 'column' }}>
                <EditFormatDialog api={api} formats={formats} setFormats={setFormats} editItem={editItem} setEditItem={() => setEditItem({ open: false, item: null })} />
                <AddFormatDialog api={api} formats={formats} setFormats={setFormats} open={addOpen} setOpen={setAddOpen} defaultValues={addDefaults} />
                <Title>Camera Formats</Title>
                <Grid container alignItems={'center'}>
                    <Grid item xs={2}>
                        <Typography variant='subtitle1'>Type</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant='subtitle1'>Title</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant='subtitle1'>Size</Typography>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                    {formats?.map((row, i) => (<React.Fragment key={row.file + row.title}>
                        <Grid item xs={2}>{row.type === 'hls' ? <CameraAltIcon /> : <ImageIcon />}</Grid>
                        <Grid item xs={3}><Typography variant='body2'>{row.title}</Typography></Grid>
                        <Grid item xs={3}><Typography variant='body2'>{row.w + 'x' + row.h}</Typography></Grid>
                        <Grid item textAlign='end' xs={4}><IconButton color="primary" onClick={() => {
                            setAddOpen(true);
                            setAddDefaults(row);
                        }}><ContentCopyIcon /></IconButton><IconButton color="primary" onClick={() => setEditItem({ open: true, item: row })}><EditIcon /></IconButton></Grid>
                    </React.Fragment>))}
                    {
                        !formats?.length ?
                            <Grid item xs={12} textAlign='center'><Typography variant='body2'>No formats found</Typography></Grid>
                            :
                            null
                    }
                    <Grid item xs={12} sx={{ mt: 2 }} textAlign={'center'}><Button color='success' variant='contained' onClick={() => setAddOpen(true)}>Add</Button></Grid>
                </Grid>
            </Paper>
        </Container>
    );
}