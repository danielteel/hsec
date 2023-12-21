import { useContext, useEffect, useRef, useState } from 'react';
import { Paper, Grid, Table, TableHead, TableRow, TableCell, TableBody, Button, Select, FormControl, InputLabel, MenuItem, Input, TextField } from '@mui/material';

import ApiContext from '../../contexts/ApiContext';

export default function Settings() {
    const { camAdd, camGetDetails, camDelete } = useContext(ApiContext);
    const [formats, setFormats] = useState(null);

    const [type, setType] = useState('hls');
    const [file, setFile] = useState('');
    const [title, setTitle] = useState('');
    const [width, setWidth] = useState('1280');
    const [height, setHeight] = useState('720');
    const [qual, setQual] = useState(24);
    const [fps, setFps] = useState(1);
    const [block, setBlock] = useState(2);

    useEffect(() => {
        let timeoutId = null;
        async function getFormats() {
            const [passed, fetchedFormats] = await camGetDetails();
            if (passed) {
                setFormats(fetchedFormats);
            } else {
                timeoutId = setTimeout(getFormats, 2000);
            }
        }
        getFormats();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        }
    }, [camGetDetails]);

    async function deleteFormat(row) {
        await camDelete(row.id);
        const [passed, fetchedFormats] = await camGetDetails();
        if (passed) {
            setFormats(fetchedFormats);
        }
    }
    async function addFormat() {
        await camAdd({type, file, title, w:Number(width), h:Number(height), qual: Number(qual), fps:Number(fps), block:Number(block)});
        const [passed, fetchedFormats] = await camGetDetails();
        if (passed) {
            setFormats(fetchedFormats);
        }
    }

    return (
        <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                <Table dense={true}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>File</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>W</TableCell>
                            <TableCell>H</TableCell>
                            <TableCell>Quality</TableCell>
                            <TableCell>FPS</TableCell>
                            <TableCell>Block</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formats?.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.file}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.w}</TableCell>
                                <TableCell>{row.h}</TableCell>
                                <TableCell>{row.qual}</TableCell>
                                <TableCell>{row.fps}</TableCell>
                                <TableCell>{row.block}</TableCell>
                                <TableCell><Button onClick={deleteFormat.bind(null, row)}>Delete</Button></TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                                    <Select value={type} onChange={(e)=>setType(e.target.value)}>
                                        <MenuItem value={'hls'}>HLS</MenuItem>
                                        <MenuItem value={'jpg'}>JPG</MenuItem>
                                    </Select>
                            </TableCell>
                            <TableCell><TextField value={file} onChange={(e)=>setFile(e.target.value)}/></TableCell>
                            <TableCell><TextField value={title} onChange={(e)=>setTitle(e.target.value)}/></TableCell>
                            <TableCell><TextField value={width} onChange={(e)=>setWidth(e.target.value)}/></TableCell>
                            <TableCell><TextField value={height} onChange={(e)=>setHeight(e.target.value)}/></TableCell>
                            <TableCell><TextField value={qual} onChange={(e)=>setQual(e.target.value)}/></TableCell>
                            <TableCell><TextField value={fps} onChange={(e)=>setFps(e.target.value)}/></TableCell>
                            <TableCell><TextField value={block} onChange={(e)=>setBlock(e.target.value)}/></TableCell>
                            <TableCell><Button onClick={addFormat}>Add</Button></TableCell>

                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Grid>
    );
}