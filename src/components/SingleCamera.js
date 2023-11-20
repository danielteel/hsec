import { useComponentSize } from "react-use-size";
import ReactPlayer from 'react-player';
import React, {useEffect, useRef, useState} from 'react';
import { Layout, Menu, Button, theme, List, Typography } from 'antd';

export default function QuadCamera({messages}) {
    const { ref, height, width } = useComponentSize();
    const [update, setUpdate] = useState({});

    useEffect(()=>{
        let timeoutId = null;
        function update(){
            setUpdate({});
            timeoutId=setTimeout(update, 1000);
        }
        timeoutId=setTimeout(update, 1000);

        return () =>{
            if (timeoutId) clearTimeout(timeoutId);
        }
    }, []);

    return <>
        <div ref={ref} style={{flex:1, margin: 0, padding: 0, textAlign:'center'}}>
        </div>        
        <ReactPlayer 
            url={'http://192.168.1.14:4000/allcamL.m3u8'}
            style={{position:'absolute', left: ref.current?.offsetLeft, top: ref.current?.offsetTop}}
            muted={true}
            playing={true}
            playsinline={true}
            playbackRate={1}
            width={width}
            height={height}
        />
        <div style={{position:'absolute', left: ref.current?.offsetLeft, top: ref.current?.offsetTop, color: '#F00', textAlign:'right', width: width}}>{new Date().toLocaleTimeString()}</div>
    </>
}