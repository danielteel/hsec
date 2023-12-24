import { useEffect, useRef, useState } from "react";
import Alert from '@mui/material/Alert';

export default function ImagePlayer({format, fullscreen}){
    const [error, setError] = useState(null);
    const imgRef = useRef();

    useEffect(()=>{
        if (!format || format.type!=='jpg' || !imgRef || !imgRef.current) return;
        let timeoutId = null;
        let lastBlob=null;
        let cancelling = false;


        async function updateImage(){
            try {
                const options={
                    credentials: 'include',
                    method: "GET",
                    cache: "no-cache",
                }
                const response = await fetch('/api/cam/'+format.file, options);
                const blob = await response.blob();
                const newBlob = URL.createObjectURL(blob);
                imgRef.current.src=newBlob;
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
            if (cancelling) return;
            const beforeTime = (new Date()).getTime();
            const success = await updateImage();
            const afterTime = (new Date()).getTime();
            const loadOffset = afterTime-beforeTime;
            const period = Math.max(0, 1/format.fps*1000 - loadOffset);
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
    }, [format]);

    
    if (!format || format.type!=='jpg') return null;

    return <>
        <Alert variant='standard' severity={error?.type} style={{width:'100%', ...(fullscreen?{position:'fixed', bottom:"0px", left:'0px', width:'100dvw'}:{}), ...(error?{}:{display:'none'})}}>{error?.text}</Alert>
        <img ref={imgRef} style={{objectFit:'contain', maxWidth:'100dvw', maxHeight:'100dvh'}} alt=''></img>
    </>
}