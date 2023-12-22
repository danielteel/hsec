import Alert from '@mui/material/Alert';

import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

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
    } catch (e){
    }
}

export default function VideoPlayer({streamFile, videoRef}){
    const hlsRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(()=>{
        if (!streamFile || !videoRef) return;

        attemptLoadVideo(hlsRef, videoRef, streamFile.file);

        return ()=>{
            if (hlsRef.current){
                hlsRef.current.destroy();
                hlsRef.current=null;
            }
        }
    }, [streamFile, videoRef]);

    useEffect( () => {
        if (!streamFile || !videoRef) return;

        const video = videoRef.current;
       
        let timeoutId = null;
        
        let lastTime = video.currentTime;
        let errorCount=0;
        
        async function checkForError(){
            if (Math.abs(lastTime-video.currentTime)<0.25 || !isFinite(video.currentTime)){
                errorCount++;
                if (errorCount>3){
                    setError({type:'error', text: 'Not enough bandwidth or network error occured, reloading...'});
                    errorCount=0;
                    attemptLoadVideo(hlsRef, videoRef, streamFile.file);
                }else{
                    setError({type:'warning', text: 'Not enough bandwidth or network error occured'});
                }
            }else{
                if (isFinite(video.duration) && (video.currentTime < (video.duration-streamFile.block-2))){
                    video.currentTime = video.duration-streamFile.block;
                    if (errorCount===0){
                        setError({type:'warning', text: 'playback falling behind, attempting to fast forward'});
                    }
                }else{
                    setError(null);
                    errorCount=0;
                }
            }

            lastTime=video.currentTime;
            timeoutId=setTimeout(checkForError, 2000);
        }
        timeoutId=setTimeout(checkForError, 2000);


        return ()=>{
            clearTimeout(timeoutId);
            timeoutId=null;
        }
    }, [streamFile, videoRef]);


    useEffect(()=>{
        if (!videoRef) return;

        async function dontPause(){
            try {
                await videoRef.current.play();
            }catch(e){
            }
        }

        videoRef.current.addEventListener('pause', dontPause);
        const video=videoRef.current;
        return ()=>{
            video.removeEventListener('pause', dontPause);
        }
    }, [videoRef]);

    return <div style={{flexGrow:1, position:'relative'}}>
        {
            error?
                <Alert variant='filled' severity={error.type} style={{position:'absolute', width:'100%'}}>{error.text}</Alert>
            :
                null
        }
        <video ref={videoRef} playsInline={true} muted={true} type='application/x-mpegURL' autoPlay={true} style={{width:'100%'}}></video>
    </div>;
}