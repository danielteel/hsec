import { useComponentSize } from "react-use-size";
import ReactPlayer from 'react-player';
import React, {useRef, useState} from 'react';
import { Layout, Menu, Button, theme, List, Typography, Space } from 'antd';


export default function MQTT({messages, connected, client, alarm, setAlarm}) {

    return (
        <Space direction="vertical">
            
            {connected?"Connected":'Offline'}
            {alarm?'Alarm On':'Alarm Off'}
            <Button disabled={!connected} onClick={()=>{
                if (alarm){
                    client?.publish('alarm', 'off', {qos: 1, retain: true});
                }else{
                    client?.publish('alarm', 'on', {qos: 1, retain: true});
                }
                setAlarm(!alarm);
            }}>Toggle Alarm</Button>
            <List size="small" style={{fontSize: 12, overflowY:'auto', borderStyle:'solid', borderWidth:'1px', borderColor:'#000'}}>
                {
                    messages.map(i => <List.Item>{i.topic+': '+i.message}</List.Item>).reverse()
                }
            </List>
        </Space>        
    );
}