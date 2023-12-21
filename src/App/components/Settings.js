import { useContext, useEffect, useRef, useState } from 'react';
import { Paper, Grid, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

import ApiContext from '../../contexts/ApiContext';

export default function Settings() {
    const {camAdd, camDetails, camDelete} = useContext(ApiContext);
    const [formats, setFormats] = useState(null);

    useEffect(()=>{
        let timeoutId = null;
        async function getFormats(){
            const [passed, fetchedFormats] = await camDetails();
            if (passed){
                setFormats(fetchedFormats);
            }else{
                timeoutId=setTimeout(getFormats, 2000);
            }
        }
        getFormats();

        return ()=>{
            if (timeoutId) clearTimeout(timeoutId);
        }
    }, [camDetails]);

    return (
        <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                <Table>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formats?.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.file}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.w}</TableCell>
                                <TableCell>{row.h}</TableCell>
                                <TableCell>{row.qual}</TableCell>
                                <TableCell>{row.fps}</TableCell>
                                <TableCell>{row.block}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Grid>
    );
}