import VideoSelect from './VideoSelect';
import { useRef, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { Paper, Grid } from '@mui/material';
import ImagePlayer from './ImagePlayer';



export default function Home(){
    const [streamFile, setStreamFile] = useState(null);
    const videoRef = useRef();

    return (
        <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{p: 1, display: 'flex', flexDirection: 'column'}}>
                <VideoSelect streamFile={streamFile} setStreamFile={setStreamFile} videoRef={videoRef}/>
                {
                    streamFile?.type==='hls'?
                        <VideoPlayer streamFile={streamFile} videoRef={videoRef}/>
                    :
                        <ImagePlayer streamFile={streamFile} videoRef={videoRef}/>
                }
            </Paper>
        </Grid>
    );
}