import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useLocation, useParams } from 'wouter';
import { laxStringsEqual } from '../../common/common';
import SettingsOverscanIcon from '@mui/icons-material/SettingsOverscan';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export default function VideoSelect({formats, fullscreen, toggleFullscreen}){
    const [, setLocation] = useLocation();
    const params = useParams();
    const title = decodeURI(params?.title);

    return <div style={{display:'flex', padding:'2px', flexWrap:'wrap', ...(fullscreen?{position:'fixed', top:'0px', left:'0px', width:'100dvw', zIndex:99999}:{})}}>
            <ButtonGroup style={{flexWrap:'wrap', ...(fullscreen?{backgroundColor:'#FFF9'}:{})}}>
            {
                formats?.map?.(format => {
                    return <Button key={format.file} variant={laxStringsEqual(format.title, title)?'contained':'outlined'} onClick={()=>{
                        setLocation('/video/'+format.title+'/'+format.type);
                    }}>{format.title}</Button>
                })
            }
            </ButtonGroup>
            <ButtonGroup style={{marginLeft:'auto', ...(fullscreen?{backgroundColor:'white'}:{})}}>
                <IconButton variant={fullscreen?'contained':'text'} color={fullscreen?'error':'primary'} onClick={()=>{
                    toggleFullscreen();
                }}>{fullscreen?<CloseIcon/>:<SettingsOverscanIcon/>}</IconButton>
            </ButtonGroup>
    </div>

}