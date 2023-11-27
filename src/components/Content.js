import React, {useState} from 'react';
import {Layout, theme} from 'antd';

import useMQTT from "../hooks/useMQTT";

import QuadCamera from './QuadCamera';
import MQTT from './MQTT';

const subscriptions = {
    motion: {qos: 1},
    alarm: {qos: 1}
}

export default function Content({selectedMenu, videoQuality}){
    const {token: { colorBgContainer }} = theme.useToken();
    const [messages, setMessages] = useState([]);
    const [alarm, setAlarm] = useState(false);

    const onMessage = (client, topic, message) => {
        setMessages([...messages, {topic, message}]);
        if (topic.trim().toLowerCase()==='alarm'){
            setAlarm(message.toString().trim().toLowerCase()==='on'?1:0);
        }
    }

    const {client, connected} = useMQTT({address: 'ws://192.168.1.14:8888', subscriptions: subscriptions, onMessage});

    return (
        <Layout.Content style={{ display: 'flex', flexDirection: 'column', margin: '8px 6px', backgroundColor: colorBgContainer }}>
            {
                selectedMenu === 'camera' ?
                    <QuadCamera quality={videoQuality} />
                : selectedMenu === 'mqtt' ?
                    <MQTT client={client} messages={messages} connected={connected} alarm={alarm} setAlarm={setAlarm}/>
                :
                    'Undefined'
            }
        </Layout.Content>
    );
}