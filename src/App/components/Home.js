import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';



export default function Home(){
    const videoRef = useRef();
    const hlsRef = useRef(new Hls());
    const [started, setStarted] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [error, setError] = useState(null);

    async function attemptLoadVideo(){
        try {
            const videoSrc = '/api/cam/allcamL.m3u8';
            if (Hls.isSupported()) {
                hlsRef.current.loadSource(videoSrc);
                hlsRef.current.attachMedia(videoRef.current);
            }else{
                videoRef.current.src = '/api/cam/allcamL.m3u8';
            }
            await videoRef.current.play();
            videoRef.current.fastSeek(Number.POSITIVE_INFINITY);
        } catch (e){
        }
    }

    useEffect( () => {
        const video = videoRef.current;
        
        async function loadStart(event){
            if (videoLoaded===false) setVideoLoaded(true);
        }

        let timeoutId = null;
        let lastDuration = video.duration;
        let lastTime = video.currentTime;
        const checkPeriod = 2000;
        
        async function checkForError(){
            
            if (started){
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
                        attemptLoadVideo();
                    }else{
                        setError(null);
                    }
                    lastDuration=video.duration;
                }else{
                    if (Math.abs(lastTime-video.currentTime)<0.1 || !isFinite(video.currentTime)){
                        setError('Possible network error, trying to reconnect...');
                        attemptLoadVideo();
                    }else{
                        setError(null);
                    }
                    lastTime=video.currentTime;
                }
            }
            timeoutId=setTimeout(checkForError, checkPeriod);
        }
        timeoutId=setTimeout(checkForError, checkPeriod);

        let fastForwardTimeoutId = null;
        function fastForward(){
            video.fastSeek(Number.POSITIVE_INFINITY);
            fastForwardTimeoutId=setTimeout(fastForward, 30000);
        }
        fastForwardTimeoutId=setTimeout(fastForward, 30000);

        video.addEventListener('loadstart', loadStart);
        

        return ()=>{
            video.removeEventListener('loadstart', loadStart);
            clearTimeout(timeoutId);
            clearTimeout(fastForwardTimeoutId);
            timeoutId=null;
        }
    }, [started, videoLoaded]);

    return <>
        {
            error?
                <Alert severity="error">{error}</Alert>
            :
                null
        }
        <video hidden={!videoLoaded} controls={true} playsInline={true} muted={true} autoPlay ref={videoRef} style={{width:'100%'}}></video>
        {
            !started?
                <Button onClick={()=>{
                    setStarted(true);
                    attemptLoadVideo();
                }}>Load Live View</Button>
            :
                null
        }

    </>
}