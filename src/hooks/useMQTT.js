import React, {useEffect, useState, useRef} from 'react';
import mqtt from 'mqtt';

let sharedClients = {};


//figure out how to handle subscriptions
export default function useMQTT(address, {onConnect, onError, onClose, onMessage}){
    const [connected, setConnected] = useState(false);
    const [client, setClient] = useState(null);

    useEffect(() => {
        if (!sharedClients[address]){
            sharedClients[address]={address, refs: 1, client: mqtt.connect(address)};
        }else{
            sharedClients[address].refs++;
            setConnected(sharedClients.client.connected);
        }
        setClient(sharedClients[address].client);
        
        return () => {
            sharedClients[address].refs--;
            setClient(null);
            setConnected(false);
            if (sharedClients[address].client && sharedClients[address].refs===0){
                sharedClients[address].client.end();
                delete sharedClients[address];
            }
        }
    }, [address]);

    useEffect(() => {
        const connect = (connack) => {
            setConnected(true);
            if (onConnect) onConnect(connack);
        };
        const error = (err) => {
            if (onError) onError(err);
        };
        const close = () => {
            setConnected(false);
            if (onClose) onClose();
        };
        const message = (topic, message) => {
            if (onMessage) onMessage(topic, message);
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
    }, [client, onConnect, onClose, onError, onMessage]);

    return {client, connected};
}