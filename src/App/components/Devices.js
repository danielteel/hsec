import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

export default function Devices(){
    const [devices, setDevices] = useState(null);
    const {api} = useAppContext();
    const [selectedDevice, setSelectedDevice] = useState(null);
    const imgRef = useRef(null);

    useEffect(() => {
        let timeoutId = null;
        let cancel=false;

        async function getDevices() {
            if (cancel) return;
            let [passed, fetchedDevices] = await api.devicesList();
            if (passed) {
                setDevices(fetchedDevices);
            } else {
                timeoutId = setTimeout(getDevices, 2000);
            }
        }
        getDevices();

        return () => {
            cancel=true;
            if (timeoutId) clearTimeout(timeoutId);
        }
    }, [api]);


    useEffect(()=>{
        if (!imgRef || !imgRef.current) return;
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
                const response = await fetch('/api/devices/image/'+selectedDevice.device_id, options);
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
            const success = await updateImage();
            timeoutId=setTimeout(loadNext, 2000);
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
    }, [selectedDevice]);

    const handleChange = (event, newValue) => {
        setSelectedDevice(newValue);
    };

    return <>
        <Tabs value={selectedDevice} onChange={handleChange}>
            {devices?.map(device => (
                <Tab value={device} label={device.name} disabled={!device.connected}/>
            ))}
        </Tabs>
        {
            selectedDevice===null ?
                null
            :
                selectedDevice?.actions?.map( action => {
                    if (action.type.toLowerCase().trim()==='void'){
                        return <Button variant='contained' onClick={async () => await api.devicesAction(selectedDevice.device_id, action.title, null)}>{action.title}</Button>
                    }else if (action.type.toLowerCase().trim()==='byte'){
                        return <Button onClick={async () => await api.devicesAction(selectedDevice.device_id, action.title, null)}>{action.title}</Button>
                    }
                })
        }
        <img ref={imgRef}/>
    </>
}