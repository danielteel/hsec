import {Layout, Menu, theme} from 'antd';
import {UploadOutlined, VideoCameraOutlined} from '@ant-design/icons';
import mqtt from 'mqtt';
import { useEffect, useState} from 'react';
import QuadCamera from './components/QuadCamera';
import MQTT from './components/MQTT';
import Header from './components/Header';

const {  Content, Sider } = Layout;

const menuItems = [
    {key: 'camera', icon: <VideoCameraOutlined />},
    {key: 'mqtt', icon: <UploadOutlined />},
];

function App() {
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('camera');
    const [quality, setQuality] = useState('L');

    const {token: { colorBgContainer }} = theme.useToken();

    useEffect(() => {
        setClient(mqtt.connect('ws://192.168.1.14:8888'));
        setConnected(false);
        return () => {
            setClient(c => {
                setConnected(false);
                if (c) c.end();
                return null;
            });
        }
    }, []);

    useEffect(() => {
        const onConnect = (connack) => {
            client.subscribe('#');
            setConnected(true);
            console.log('connected', connack);
        };
        const onError = (err) => {
            console.log('error', err)
        };
        const onClose = () => {
            setConnected(false);
            console.log('close');
        };
        const onMessage = (topic, message) => {
            console.log('message', topic, message.toString());
            setMessages(msgs => [...msgs, { topic, message: message.toString() }]);
        };

        if (client) {
            client.on('connect', onConnect);
            client.on('error', onError);
            client.on('close', onClose);
            client.on('message', onMessage);
        }
    }, [client]);


    return (
        <Layout style={{ height: '100%' }}>
            <Sider trigger={null} collapsible collapsed={true} collapsedWidth={collapsed?0:undefined}>
                <Menu
                    onSelect={({key})=>setSelectedMenu(key)}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[menuItems[0].key]}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header quality={quality} setQuality={setQuality} collapsed={collapsed} setCollapsed={setCollapsed}/>
                <Content style={{display:'flex', flexDirection:'column', margin: '12px 8px', backgroundColor: colorBgContainer}}>
                    {
                        selectedMenu==='camera'?
                            <QuadCamera messages={messages} quality={quality}/>
                        :selectedMenu==='mqtt'?
                            <MQTT connected={connected} messages={messages} client={client}/>
                        :
                            'Undefined'
                    }
                </Content>
            </Layout>
            
        </Layout>
    );
}

export default App;

