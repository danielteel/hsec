import { useEffect, useState } from "react";

export default function ImagePlayer({streamFile, videoRef}){

    useEffect(()=>{
        if (!streamFile || !videoRef) return;
        let timeoutId = null;
        let lastUpdateTime=(new Date()).getTime();
        const video=videoRef.current;

        function updateImage(){
            video.src='/api/cam/'+streamFile?.file+'?'+(new Date().getTime());
        }

        function onLoad(){
            const currentTime = (new Date()).getTime();
            const loadOffset = currentTime-lastUpdateTime;
            lastUpdateTime=currentTime;
            timeoutId=setTimeout(updateImage, Math.max(0, 1/streamFile.fps*1000 - loadOffset));
        }
        timeoutId=setTimeout(updateImage, 1/streamFile.fps*1000);

        video.addEventListener('load', onLoad);

        return ()=>{
            video.removeEventListener('load', onLoad);
            if (timeoutId){
                clearTimeout(timeoutId);
            }
        }
    }, [streamFile, videoRef]);

    return <img style={{width:'100%', height:'100%'}} ref={videoRef} src={'/api/cam/'+streamFile?.file} alt=''></img>;
}