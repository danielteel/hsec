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

function Video({videoRef, ...props}){
    useEffect(()=>{
        if (!videoRef) return;
        let cancelled=false;
        setTimeout(()=>{
            if (!cancelled){
                videoRef.current.controls=false;
            }
        }, 250);
        return ()=>{
            cancelled=true;
        }
    }, [videoRef])
    return <video controls={true} ref={videoRef} {...props}></video>
}

export default function VideoPlayer({format, fullscreen}){
    const hlsRef = useRef(null);
    const [error, setError] = useState(null);
    const videoRef = useRef();

    useEffect(()=>{
        if (!videoRef || !videoRef.current || !format || format.type!=='hls') return;

        attemptLoadVideo(hlsRef, videoRef, format.file);

        return ()=>{
            if (hlsRef.current){
                if (hlsRef.current.destroy) hlsRef.current.destroy();
                hlsRef.current=null;
            }
        }
    }, [format]);

    useEffect( () => {
        if (!videoRef || !videoRef.current || !format || format.type!=='hls') return;

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
                    attemptLoadVideo(hlsRef, videoRef, format.file);
                }else{
                    setError({type:'warning', text: 'Not enough bandwidth or network error occured'});
                }
            }else{
                if (isFinite(video.duration) && (video.currentTime < (video.duration-format.block-2))){
                    video.currentTime = video.duration-format.block;
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
    }, [format]);


    useEffect(()=>{
        if (!videoRef || !videoRef.current || !format || format.type!=='hls') return;

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
    }, [format]);


    if (!format || format.type!=='hls') return null;

    return <>
        <Alert variant='standard' severity={error?.type} style={{width:'100%', ...(fullscreen?{position:'fixed', bottom:"0px", left:'0px', width:'100dvw'}:{}), ...(error?{}:{display:'none'})}}>{error?.text}</Alert>
        <Video videoRef={videoRef} playsInline={true} muted={true} type='application/x-mpegURL' autoPlay={true} style={{objectFit:'contain', maxWidth:'100dvw', maxHeight:'100dvh'}}></Video>
    </>;
}