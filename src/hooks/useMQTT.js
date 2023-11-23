import React, {useEffect, useState, useRef} from 'react';
import mqtt from 'mqtt';



//figure out how to handle subscriptions
export default function useMQTT({address, options, subscriptions, onConnect, onError, onClose, onMessage}){
    const [connected, setConnected] = useState(false);
    const [client, setClient] = useState(null);

    useEffect(() => {
        setClient(mqtt.connect(address, options));
        
        return () => {
            setClient(c => {
                if (c) c.end()
            });
            setClient(null);
            setConnected(false);
        }
    }, [address, options]);

    useEffect(() => {
        const connect = (connack) => {
            setConnected(true);
            client.subscribe(subscriptions);
            if (onConnect) onConnect(client, connack);
        };
        const error = (err) => {
            if (onError) onError(client, err);
        };
        const close = () => {
            setConnected(false);
            if (onClose) onClose(client);
        };
        const message = (topic, message) => {
            if (onMessage) onMessage(client, topic, message);
        };

        if (client) {
            client.on('connect', connect);
            client.on('error', error);
            client.on('close', close);
            client.on('message', message);
        }

        return () => {
            if (client){
                client.removeListener('connect', connect);
                client.removeListener('error', error);
                client.removeListener('close', close);
                client.removeListener('message', message);
            }
        };
    }, [client, subscriptions, onConnect, onClose, onError, onMessage]);

    return {client, connected};
}