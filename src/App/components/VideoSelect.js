import { useEffect, useState, useContext } from 'react';
import ApiContext from '../../contexts/ApiContext';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

export default function VideoSelect({streamFile, setStreamFile, videoRef}){
    const {camGetDetails} = useContext(ApiContext);
    const [hlsDetails, setHlsDetails] = useState(null);

    useEffect(()=>{
        if (hlsDetails) return;

        let fetchTimeoutId = null;
        async function fetchFormats(){
            fetchTimeoutId=null;
            const [passed, fetchedDetails] = await camGetDetails();
            if (passed){
                if (Array.isArray(fetchedDetails) && fetchedDetails.length>0){
                    setHlsDetails(fetchedDetails);
                    if (!streamFile || !fetchedDetails.find(f => f.name===streamFile)){
                        setStreamFile(fetchedDetails[0]);
                    }
                    return;
                }
            }
            fetchTimeoutId=setTimeout(fetchFormats, 4000);
        }
        
        fetchFormats();

        return ()=>{
            if (fetchTimeoutId){
                clearTimeout(fetchTimeoutId);
                fetchTimeoutId=null;
            }
        }
    }, [camGetDetails, streamFile, hlsDetails, setStreamFile]);

    return <div style={{display:'flex', marginBottom:3, flexWrap:'wrap'}}>
            <ButtonGroup style={{flexWrap:'wrap'}}>
            {
                hlsDetails?.map?.(details => {
                    return <Button key={streamFile.file} variant={streamFile.title===details.title?'contained':'outlined'} onClick={()=>{
                        setStreamFile(details);
                    }}>{details.title}</Button>
                })
            }
            </ButtonGroup>
            {
                videoRef.current?.requestFullscreen || videoRef.current?.webkitRequestFullscreen || videoRef.current?.msRequestFullscreen
                ?
                <>
                    <Button style={{marginLeft:'auto'}} variant='text' color='info' onClick={()=>{
                        if (videoRef.current.requestFullscreen) {
                            videoRef.current.requestFullscreen();
                        } else if (videoRef.current.webkitRequestFullscreen) { /* Safari */
                            videoRef.current.webkitRequestFullscreen();
                        } else if (videoRef.current.msRequestFullscreen) { /* IE11 */
                            videoRef.current.msRequestFullscreen();
                        }
                    }}>Fullscreen</Button>
                </>
                :
                    null
            }
    </div>

}