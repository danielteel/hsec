import Alert from '@mui/material/Alert';
import VideoSelect from './VideoSelect';
import Hls from 'hls.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useComponentSize } from "react-use-size";


async function attemptLoadVideo(hlsRef, videoRef, fileName){
    try {
        const videoSrc = '/api/cam/'+fileName;
        if (Hls.isSupported()) {
            if (!hlsRef.current) hlsRef.current=new Hls();
            hlsRef.current.loadSource(videoSrc);
            hlsRef.current.attachMedia(videoRef.current);
        }else{
            videoRef.current.src = videoSrc;
        }
        await videoRef.current.play();
        videoRef.current.fastSeek(Number.POSITIVE_INFINITY);
    } catch (e){
    }
}

export default function Home(){
    const videoRef = useRef();
    const hlsRef = useRef(null);
    const [streamFile, setStreamFile] = useState(null);
    const [error, setError] = useState(null);
    const {ref, width, height} = useComponentSize();


    useEffect(()=>{
        if (!streamFile) return;

        attemptLoadVideo(hlsRef, videoRef, streamFile.file);

        return ()=>{
            if (hlsRef.current){
                hlsRef.current.destroy();
                hlsRef.current=null;
            }
        }
    }, [streamFile]);

    useEffect( () => {
        if (!streamFile) return;

        const video = videoRef.current;
       

        let timeoutId = null;
        let lastDuration = video.duration;
        let lastTime = video.currentTime;
        const checkPeriod = 6000;
        
        async function checkForError(){
            if (Hls.isSupported()){
                if (Math.abs(video.duration - video.currentTime) > 4){
                    video.currentTime = video.duration-2;
                    try {
                        await video.play();
                    }catch (e){

                    }
                }
                if (Math.abs(lastDuration-video.duration)<0.1 || !isFinite(video.duration)){
                    setError('Possible network error, trying to reconnect...');
                    attemptLoadVideo(hlsRef, videoRef, streamFile.file);
                }else{
                    setError(null);
                }
                lastDuration=video.duration;
            }else{
                if (Math.abs(lastTime-video.currentTime)<0.1 || !isFinite(video.currentTime)){
                    setError('Possible network error, trying to reconnect...');
                    attemptLoadVideo(hlsRef, videoRef, streamFile.file);
                }else{
                    setError(null);
                }
                lastTime=video.currentTime;
            }
            timeoutId=setTimeout(checkForError, checkPeriod);
        }
        timeoutId=setTimeout(checkForError, checkPeriod);

        let fastForwardTimeoutId = null;
        function fastForward(){
            if (video.fastSeek){
                video.fastSeek(Number.POSITIVE_INFINITY);
            }
            fastForwardTimeoutId=setTimeout(fastForward, 30000);
        }
        fastForwardTimeoutId=setTimeout(fastForward, 30000);

        return ()=>{
            clearTimeout(timeoutId);
            clearTimeout(fastForwardTimeoutId);
            timeoutId=null;
        }
    }, [streamFile]);

    return (<>
        <VideoSelect streamFile={streamFile} setStreamFile={setStreamFile}/>
        <div ref={ref} style={{flexGrow: 1}}>
            {
                error?
                <Alert severity="error">{error}</Alert>
                :
                null
            }
            <video ref={videoRef} playsInline={true} muted={true} autoPlay style={{position:'absolute', width, height}}></video>
        </div>
    </>);
}