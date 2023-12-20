
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
        videoRef.current.fastSeek(Number.POSITIVE_INFINITY);
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
        let fastForwardTimeoutId = null;
        
        let lastTime = video.currentTime;
        let errorCount=0;
        
        async function checkForError(){
            if (Math.abs(lastTime-video.currentTime)<0.1 || !isFinite(video.currentTime)){
                setError('Possible network error, trying to reconnect...');
                errorCount++;
                if (errorCount>3){
                    attemptLoadVideo(hlsRef, videoRef, streamFile.file);
                }
            }else{
                setError(null);
                errorCount=0;
            }
            lastTime=video.currentTime;
            timeoutId=setTimeout(checkForError, 2000);
        }
        timeoutId=setTimeout(checkForError, 2000);

        async function fastForward(){
            if (!isFinite(video.duration)){
            }else{
                if (video.currentTime<video.duration-1){
                    video.currentTime=video.duration-1;
                }
            }
            fastForwardTimeoutId=setTimeout(fastForward, 5000);
        }
        fastForwardTimeoutId=setTimeout(fastForward, 5000);

        return ()=>{
            clearTimeout(timeoutId);
            clearTimeout(fastForwardTimeoutId);
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

    return (<>
        <video ref={videoRef} playsInline={true} muted={true} type='application/x-mpegURL' autoPlay style={{flexGrow:1}}></video>
        {error}
    </>);
}