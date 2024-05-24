import React, { useState, useEffect } from 'react';
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

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    return <>
        {devices?.map(device => (
            <Accordion expanded={expanded === device.name} onChange={handleChange(device.name)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{device.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {device.name}
                    </Typography>
                    <img src={'/api/devices/image/'+device.device_id}/>
                </AccordionDetails>
            </Accordion>

        ))}
    </>
}