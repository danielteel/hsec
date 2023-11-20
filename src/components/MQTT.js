import { useComponentSize } from "react-use-size";
import ReactPlayer from 'react-player';
import React, {useRef, useState} from 'react';
import { Layout, Menu, Button, theme, List, Typography } from 'antd';

export default function QuadCamera({messages, connected}) {
    const { ref, height, width } = useComponentSize();

    return <>
        <div ref={ref} style={{flex:1, margin: 0, padding: 0}}>
            {connected?"Connected":'Offline'}
        <List size="small" style={{fontSize: 12, overflowY:'auto', borderStyle:'solid', borderWidth:'1px', borderColor:'#000'}}>
            {
                messages.map(i => <List.Item>{i.topic+': '+i.message}</List.Item>).reverse()
            }
        </List>
        </div>        
    </>
}