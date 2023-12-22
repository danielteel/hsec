import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, ButtonGroup} from '@mui/material';
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


export default function EditFormatDialog({ api, formats, setFormats, editItem, setEditItem, deleteItem }) {
    const [error, setError] = useState(null);
    const [type, setType] = useState('');
    const [file, setFile] = useState('');
    const [title, setTitle] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [quality, setQuality] = useState('');
    const [fps, setFps] = useState('');
    const [block, setBlock] = useState('');

    const [inProgress, setInProgress] = useState(null);

    useEffect(() => {
        setType(editItem?.item?.type || '');
        setFile(editItem?.item?.file || '');
        setTitle(editItem?.item?.title || '');
        setWidth(editItem?.item?.w || '');
        setHeight(editItem?.item?.h || '');
        setQuality(editItem?.item?.qual || '');
        setFps(editItem?.item?.fps || '');
        setBlock(editItem?.item?.block || '');
        setError(null);
    }, [editItem]);


    const handleClose = () => {
        if (!inProgress) setEditItem({ open: false, item: null });
    };

    const handleDelete = async () => {
        if (!editItem?.item?.id) return;
        try{
            setInProgress('delete');
            
            const [passed, newFormats] = await api.camDelete(editItem?.item?.id);
            if (passed){
                setFormats(newFormats);
                setEditItem({open: false, item: null});
                setError(null);
            }else{
                setError('Error occured trying to delete the item');
            }
        }catch(e){
            setError('Error occurred');
        }
        setInProgress(null);
    }

    const handleUpdate = async () => {
        if (!editItem?.item?.id) return;
        try{
            setInProgress('update');

            let fileUpdate = file;
            let titleUpdate = title;
            if (!fileUpdate) fileUpdate=String(Math.floor(Math.random()*100000));
            if (!titleUpdate) titleUpdate=String(Math.floor(Math.random()*100000));
            if (type==='hls' && !fileUpdate.endsWith('.m3u8')) fileUpdate+='.m3u8';
            if (type==='jpg' && !fileUpdate.endsWith('.jpg')) fileUpdate+='.jpg';

            const updateRecord = {id: editItem?.item?.id, type, file: fileUpdate, title: titleUpdate, w: Number(width), h: Number(height), qual: Number(quality), fps: Number(fps), block: Number(block)};
            
            const [passed, newFormats] = await api.camUpdate(updateRecord);
            if (passed) {
                setFormats(newFormats);
                setEditItem({ open: false, item: null });
            }else{
                const existingFile = formats?.find(r=>(r.id!==editItem?.item?.id && fileUpdate.trim().toLowerCase() === r.file.trim().toLowerCase()));
                const existingTitle = formats?.find(r=>(r.id!==editItem?.item?.id && titleUpdate.trim().toLowerCase() === r.title.trim().toLowerCase()));

                if (existingFile){
                    setError('File name already exists, try a different file name');
                }else if (existingTitle){
                    setError('Title already exists, try a different title');
                }else{
                    setError('Failed to update for some reason. Could be possible duplicate title/file or null fields');
                }
            }
        }catch(e){
            setError('Error occurred');
        }
        setInProgress(null);
    }

    return (
        <Dialog open={editItem.open} onClose={handleClose}>
            <DialogTitle sx={{py:'12px'}}>Edit</DialogTitle>
            <DialogContent>
                <ButtonGroup disabled={!!inProgress}>
                    <Button variant={type === 'hls' ? 'contained' : 'outlined'} onClick={() => setType('hls')}>HLS</Button>
                    <Button variant={type === 'jpg' ? 'contained' : 'outlined'} onClick={() => setType('jpg')}>JPG</Button>
                </ButtonGroup>
                <TextField disabled                             fullWidth margin='dense' label='Id'      value={editItem?.item?.id || ''}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='File'    value={file}    onChange={e=>setFile(e.target.value)}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='Title'   value={title}   onChange={e=>setTitle(e.target.value)}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='Width'   value={width}   onChange={e=>setWidth(getNumberLiteral(e.target.value))}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='Height'  value={height}  onChange={e=>setHeight(getNumberLiteral(e.target.value))}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='Quality' value={quality} onChange={e=>setQuality(getNumberLiteral(e.target.value))}/>
                <TextField disabled={!!inProgress}                fullWidth margin='dense' label='FPS'     value={fps}     onChange={e=>setFps(getNumberLiteral(e.target.value))}/>
                <TextField disabled={!!inProgress||type!=='hls'}  fullWidth margin='dense' label='Block'   value={block}   onChange={e=>setBlock(getNumberLiteral(e.target.value))}/>
            </DialogContent>
            <DialogActions disableSpacing>
                <Alert style={error?{width:'100%'}:{display: 'none'}} variant='filled' severity={'error'}>{error}</Alert>
            </DialogActions>
            <DialogActions >
                <LoadingButton disabled={!!inProgress && inProgress!=='delete'} loading={inProgress==='delete'}   variant='contained' color='error'   onClick={handleDelete} style={{marginRight:'auto'}}>Delete</LoadingButton>
                <Button        disabled={!!inProgress}                                                            variant='contained' color='primary' onClick={handleClose}>Cancel</Button>
                <LoadingButton disabled={!!inProgress && inProgress!=='update'} loading={inProgress==='update'}   variant='contained' color='success' onClick={handleUpdate}>Update</LoadingButton>
            </DialogActions>
        </Dialog>
    );
}