import { Layout, Menu, Button, theme, List, Typography } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    UploadOutlined,
    AppstoreOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import ReactPlayer from 'react-player';
import mqtt from 'mqtt';
import { useEffect, useState} from 'react';
import { useComponentSize } from "react-use-size";

const { Header, Content, Sider } = Layout;

function Player({x,y,w,h, ...props}){
    return <ReactPlayer 
    style={{position:'absolute', left: x, top: y}} width={w} height={h}
    muted={true} playing={true} playsinline={true} playbackRate={1.05} {...props}
    onPause={(v)=>{
        //alert('pause');
        //v.target.play();
    }}
    onError={(v)=>{
        //alert('error');
        //v.target.play();
    }}
    onEnded={(v)=>{
        //alert('ended');
        //v.target.play();
    }}
    />
}

function App() {
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const {ref, height, width} = useComponentSize();

    let vidWidth = (width)/2;
    let vidHeight = vidWidth*(480/960);
    let vidPad = 0;
    if (height===undefined || width===undefined || height===null || width===null){
        vidWidth=0;
        vidHeight=0;
    }else{
        if (vidHeight*2>height){
            vidHeight=(height)/2;
            vidWidth=vidHeight*2;
        }
        vidPad = vidWidth*2-width;
    }

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
            <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={0}>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <AppstoreOutlined />,
                            label: 'nav 1',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
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
                    <Player x={ref.current?.offsetLeft-vidPad/2} y={ref.current?.offsetTop} w={vidWidth} h={vidHeight} url='http://192.168.1.14:4000/1cam.m3u8'/>
                    <Player x={ref.current?.offsetLeft+vidWidth-vidPad/2} y={ref.current?.offsetTop} w={vidWidth} h={vidHeight} url='http://192.168.1.14:4000/2cam.m3u8'/>
                    <Player x={ref.current?.offsetLeft-vidPad/2} y={ref.current?.offsetTop+vidHeight} w={vidWidth} h={vidHeight} url='http://192.168.1.14:4000/3cam.m3u8'/>
                    <Player x={ref.current?.offsetLeft+vidWidth-vidPad/2} y={ref.current?.offsetTop+vidHeight} w={vidWidth} h={vidHeight} url='http://192.168.1.14:4000/4cam.m3u8'/>
                    <div ref={ref} style={{flex:1}}>
                    </div>
                    <List size="small" style={{fontSize: 12, maxHeight:'15em', overflowY:'auto'}}>
                    {
                            messages.map(i => <List.Item>{i.topic+' '+i.message}</List.Item>).reverse()
                        }
                    </List>
                </Content>
            </Layout>
            
        </Layout>
    );
}

export default App;

