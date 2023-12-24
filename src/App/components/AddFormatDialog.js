import {  useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ButtonGroup} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';


function getNumberLiteral(text) {
    if (typeof text !== "string") text = String(text);
    if (text.length < 1) return "";
    let lookIndex = 0;
    let hasDec = false;
    let num = "";

    while (text[lookIndex] === " ") {//Eat whitespace at front
        lookIndex++;
    }

    const isDigit = (char) => (char && char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57);

    if (text[lookIndex] === '-') {//Only allow a minus in front of number
        num = "-";
        lookIndex++;
    }

    while (text[lookIndex] !== undefined) {
        if (isDigit(text[lookIndex])) {
            num += text[lookIndex];
        }
        if (text[lookIndex] === '.' && !hasDec) { //Only allow one decimal point
            hasDec = true;
            num += text[lookIndex];
        }
        lookIndex++;
    }

    return num;
}


export default function AddFormatDialog({ api, formats, setFormats, open, setOpen, defaultValues }) {
    const [error, setError] = useState(null);
    const [type, setType] = useState('hls');
    const [file, setFile] = useState('');
    const [title, setTitle] = useState('');
    const [width, setWidth] = useState('1280');
    const [height, setHeight] = useState('720');
    const [quality, setQuality] = useState('26');
    const [fps, setFps] = useState('2');
    const [block, setBlock] = useState('2');
    const [filter, setFilter] = useState('');

    const [inProgress, setInProgress] = useState(null);

    useEffect(() => {
        console.log(defaultValues);
        if (defaultValues?.type) setType(defaultValues?.type);
        if (defaultValues?.w) setWidth(defaultValues?.w);
        if (defaultValues?.h) setHeight(defaultValues?.h);
        if (defaultValues?.qual) setQuality(defaultValues?.qual);
        if (defaultValues?.fps) setFps(defaultValues?.fps);
        if (defaultValues?.block) setBlock(defaultValues?.block);
        if (defaultValues?.filter) setFilter(defaultValues?.filter);
        setError(null);
    }, [defaultValues]);

    const handleClose = () => {
        if (!inProgress) setOpen(false);
    };


    const handleAdd = async () => {
        try{
            setInProgress('adding');

            let fileUpdate = file;
            let titleUpdate = title;
            if (!fileUpdate) fileUpdate=String(Math.floor(Math.random()*1000000));
            if (!titleUpdate) titleUpdate=String(Math.floor(Math.random()*1000000));
            if (type==='hls' && !fileUpdate.endsWith('.m3u8')) fileUpdate+='.m3u8';
            if (type==='jpg' && !fileUpdate.endsWith('.jpg')) fileUpdate+='.jpg';

            const addRecord = {type, file: fileUpdate, title: titleUpdate, w: Number(width), h: Number(height), qual: Number(quality), fps: Number(fps), block: Number(block), filter: String(filter)};
            
            const [passed, newFormats] = await api.camAdd(addRecord);
            if (passed) {
                setFormats(newFormats);
                setOpen(false);
            }else{
                const existingFile = formats?.find(r=>(fileUpdate.trim().toLowerCase() === r.file.trim().toLowerCase()));
                const existingTitle = formats?.find(r=>(titleUpdate.trim().toLowerCase() === r.title.trim().toLowerCase()));

                if (existingFile){
                    setError('File name already exists, try a different file name');
                }else if (existingTitle){
                    setError('Title already exists, try a different title');
                }else{
                    setError('Failed to add for some reason. Could be possible duplicate title/file or null fields');
                }
            }
        }catch(e){
            setError('Error occurred');
        }
        setInProgress(null);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{py:'12px'}}>Add</DialogTitle>
            <DialogContent>
                <ButtonGroup>
                    <Button disabled={!!inProgress} variant={type === 'hls' ? 'contained' : 'outlined'} onClick={() => setType('hls')}>HLS</Button>
                    <Button disabled={!!inProgress} variant={type === 'jpg' ? 'contained' : 'outlined'} onClick={() => setType('jpg')}>JPG</Button>
                </ButtonGroup>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='File'    value={file}    onChange={e=>setFile(e.target.value)}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='Title'   value={title}   onChange={e=>setTitle(e.target.value)}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='Width'   value={width}   onChange={e=>setWidth(getNumberLiteral(e.target.value))}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='Height'  value={height}  onChange={e=>setHeight(getNumberLiteral(e.target.value))}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label={type==='hls'?'Quality (0-51)':'Quality (2-31)'} value={quality} onChange={e=>setQuality(getNumberLiteral(e.target.value))}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='FPS'     value={fps}     onChange={e=>setFps(getNumberLiteral(e.target.value))}/>
                <TextField disabled={!!inProgress||type!=='hls'}  fullWidth margin='dense' label='Block'   value={block}   onChange={e=>setBlock(getNumberLiteral(e.target.value))}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='Filter'  value={filter}  onChange={e=>setFilter(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                {error}
                <Button        disabled={!!inProgress}           variant='contained' color='primary' onClick={handleClose}>Cancel</Button>
                <LoadingButton disabled={!!inProgress && inProgress!=='adding'} loading={inProgress==='adding'} variant='contained' color='success' onClick={handleAdd}>Add</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}