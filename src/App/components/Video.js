import VideoSelect from './VideoSelect';
import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { Backdrop, Dialog, Paper } from '@mui/material';
import ImagePlayer from './ImagePlayer';
import Title from './Title';
import {useAppContext} from '../../contexts/AppContext';
import { useParams } from 'wouter';


export default function Video(){
    const [formats, setFormats] = useState([]);
    const [fullscreen, setFullscreen] = useState(false);
    const {api} = useAppContext();
    const params = useParams();
    const title=decodeURIComponent(params?.title);
    const format = formats?.find(f => f.title===title) || formats[0];


    useEffect(()=>{
        let cancel=false;
        let fetchTimeoutId = null;
        async function fetchFormats(){
            fetchTimeoutId=null;
            const [passed, fetchedFormats] = await api.camGetDetails();
            if (passed){
                if (Array.isArray(fetchedFormats) && fetchedFormats.length>0){
                    setFormats(fetchedFormats);
                }
            }
            if (cancel) return;
            fetchTimeoutId=setTimeout(fetchFormats, 5000);
        }

        fetchFormats();

        return ()=>{
            cancel=true;
            if (fetchTimeoutId) clearTimeout(fetchTimeoutId);
        }
    }, [api]);

    if (fullscreen){
        return (
            <Dialog fullScreen open style={{height:'100dvh', width:'100dvw', display: 'flex', flexDirection:'column'}}>
                <div style={{flexGrow:1, display: 'flex', flexDirection:'column', maxWidth:'100dvw', maxHeight:'100dvh', justifyContent:'center', backgroundColor:'black'}}>
                    <VideoSelect formats={formats} fullscreen={fullscreen} toggleFullscreen={()=>setFullscreen(!fullscreen)}/>
                    <VideoPlayer format={format} fullscreen={fullscreen}/>
                    <ImagePlayer format={format} fullscreen={fullscreen}/>
                </div>
            </Dialog>
    );
    }else{
        return (
            <Paper sx={{display: 'flex', m:0, flexDirection: 'column'}}>
                <Title sx={{padding:1}}>Video</Title>
                <div style={{flexGrow:1, display: 'flex', flexDirection:'column', maxWidth:'100dvw', maxHeight:'100dvh', justifyItems:'start'}}>
                    <VideoSelect formats={formats} fullscreen={fullscreen} toggleFullscreen={()=>setFullscreen(!fullscreen)}/>
                    <VideoPlayer format={format} fullscreen={fullscreen}/>
                    <ImagePlayer format={format} fullscreen={fullscreen}/>
                </div>
            </Paper>
    );
    }
}