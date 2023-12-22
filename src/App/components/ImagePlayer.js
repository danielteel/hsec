import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';

export default function ImagePlayer({streamFile, videoRef}){
    const [error, setError] = useState(null);

    useEffect(()=>{
        if (!streamFile || !videoRef || !videoRef.current) return;
        let timeoutId = null;
        const video=videoRef.current;
        let lastBlob=null;
        let cancelling = false;

        async function updateImage(){
            try {
                const options={
                    credentials: 'include',
                    method: "GET",
                    cache: "no-cache",
                }
                const response = await fetch('/api/cam/'+streamFile?.file, options);
                const blob = await response.blob();
                const newBlob = URL.createObjectURL(blob);
                video.src=newBlob;
                try{
                    if (lastBlob) URL.revokeObjectURL(lastBlob);
                }catch(e){
                    console.error(e);
                }
                lastBlob=newBlob;
                return true;
            }catch(e){
                console.error(e);
                return false;
            }
        }

        async function loadNext(){
            const beforeTime = (new Date()).getTime();
            const success = await updateImage();
            const afterTime = (new Date()).getTime();
            const loadOffset = afterTime-beforeTime;
            if (cancelling) return;
            const period = Math.max(0, 1/streamFile.fps*1000 - loadOffset);
            if (period<=0){
                setError({type: 'warning', text: 'network is slower than the servers frame rate'});
            }else if (!success){
                setError({type: 'error', text: 'failed to fetch latest image'});
            }else{
                setError(null);
            }
            timeoutId=setTimeout(loadNext, period);
        }

        loadNext();

        return ()=>{
            cancelling=true;
            try{
                if (lastBlob) URL.revokeObjectURL(lastBlob);
            }catch{}
            if (timeoutId){
                clearTimeout(timeoutId);
            }
        }
    }, [streamFile, videoRef]);

    return <>
        {
            error?
                <Alert variant='filled' severity={error.type}>{error.text}</Alert>
            :
                null
        }
        <img style={{width:'100%', height:'100%'}} ref={videoRef} alt=''></img>
    </>
}