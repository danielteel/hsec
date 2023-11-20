import { Layout, Menu, Button, theme, List, Typography } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    UploadOutlined,
    AppstoreOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import mqtt from 'mqtt';
import { useEffect, useState} from 'react';
import QuadCamera from './components/QuadCamera';
import SingleCamera from './components/SingleCamera';
import MQTT from './components/MQTT';

const { Header, Content, Sider } = Layout;



function App() {
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('quad');

    const {
        token: { colorBgContainer },
    } = theme.useToken();

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
                    onSelect={({key})=>{console.log(key);setSelectedMenu(key);}}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['quad']}
                    items={[
                        {
                            key: 'quad',
                            icon: <AppstoreOutlined />
                        },
                        {
                            key: 'single',
                            icon: <VideoCameraOutlined />
                        },
                        {
                            key: 'mqtt',
                            icon: <UploadOutlined />
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    TeelTech
                </Header>
                <Content
                    style={{
                        display:'flex',
                        flexDirection:'column',
                        marginLeft: 8,
                        marginRight: 8,
                        marginTop: 12,
                        marginBottom: 12,
                        backgroundColor: colorBgContainer
                    }}
                >
                    {
                        selectedMenu==='quad'?
                            <QuadCamera messages={messages}/>
                        :selectedMenu==='single'?
                            <SingleCamera/>
                        :selectedMenu==='mqtt'?
                            <MQTT connected={connected} messages={messages}/>
                        :
                            'Undefined'
                    }
                </Content>
            </Layout>
            
        </Layout>
    );
}

export default App;

