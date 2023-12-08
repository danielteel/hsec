import { useComponentSize } from "react-use-size";
import ReactPlayer from 'react-player';
import React, {useRef, useState} from 'react';
import { Layout, Menu, Button, theme, List, Typography } from 'antd';




export default function QuadCamera({quality}) {
    const { ref, height, width } = useComponentSize();


    return <>
        <div ref={ref} style={{flex:1, margin: 0, padding: 0, textAlign:'center'}}>
        </div>
        <ReactPlayer 
            url={'https://danteel.dedyn.io/cam/allcam'+quality+'.m3u8'}
            style={{position:'absolute', left: ref.current?.offsetLeft, top: ref.current?.offsetTop}}
            muted={true}
            playing={true}
            playsinline={true}
            playbackRate={1}
            width={width}
            height={height}
        />
    </>
}