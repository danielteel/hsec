import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Devices(){
    const [devices, setDevices] = useState(null);
    const {api} = useAppContext();
    const [expanded, setExpanded] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const imgRef = useRef(null);

    useEffect(() => {
        let timeoutId = null;
        let cancel=false;

        async function getDevices() {
            if (cancel) return;
            let [passed, fetchedDevices] = await api.devicesList();
            if (passed) {
                fetchedDevices=fetchedDevices.filter(device => {
                    if (device.connected) return true;
                    return false;
                });
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

    useEffect(() => {
        let timeoutId = null;
        let cancel=false;

        async function updateImage() {
            if (cancel) return;

            imgRef.current.src='';
            if (selectedId!=null){
                imgRef.current.src='/api/devices/image/'+selectedId;
            }

            timeoutId = setTimeout(updateImage, 2000);
        }
        updateImage();

        return () => {
            cancel=true;
            if (timeoutId) clearTimeout(timeoutId);
        }
    }, []);

    const handleChange = (name, id) => (event, isExpanded) => {
        setExpanded(isExpanded ? name : null);
        setSelectedId(isExpanded ? id : null);
    };

    return <>
        {devices?.map(device => (
            <Accordion expanded={expanded === device.name} onChange={handleChange(device.name, device.device_id)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{device.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {device.name}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        ))}
        <img ref={imgRef}/>
    </>
}