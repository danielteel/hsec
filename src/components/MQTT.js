import { useComponentSize } from "react-use-size";
import ReactPlayer from 'react-player';
import React, {useRef, useState} from 'react';
import { Layout, Menu, Button, theme, List, Typography, Space } from 'antd';
import useMQTT from "../hooks/useMQTT";

export default function QuadCamera() {
    const { ref, height, width } = useComponentSize();
    const [alarm, setAlarm] = useState(false);
    const [messages, setMessages] = useState([]);

    const onMessage = (topic, message) => {
        setMessages([...messages, {topic, message}]);
    }

    const {client, connected} = useMQTT('ws://192.168.1.14:8888', {onMessage});

    return (
        <Space direction="vertical">
            
            {connected?"Connected":'Offline'}
            
            <Button disabled={!connected} onClick={()=>{
                setAlarm((old) => {
                    if (old){
                        client.publish('alarm', 'off',);
                    }else{
                        client.publish('alarm', 'on');
                    }
                    return !old;
                });
            }}>Toggle Alarm</Button>
            <List size="small" style={{fontSize: 12, overflowY:'auto', borderStyle:'solid', borderWidth:'1px', borderColor:'#000'}}>
                {
                    messages.map(i => <List.Item>{i.topic+': '+i.message}</List.Item>).reverse()
                }
            </List>
        </Space>        
    );
}