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
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('camera');
    const [quality, setQuality] = useState('L');

    const {token: { colorBgContainer }} = theme.useToken();


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
                <Content style={{display:'flex', flexDirection:'column', margin: '8px 6px', backgroundColor: colorBgContainer}}>
                    {
                        selectedMenu==='camera'?
                            <QuadCamera quality={quality}/>
                        :selectedMenu==='mqtt'?
                            <MQTT/>
                        :
                            'Undefined'
                    }
                </Content>
            </Layout>
            
        </Layout>
    );
}

export default App;

