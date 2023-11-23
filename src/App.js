import {Layout, Menu} from 'antd';
import {UploadOutlined, VideoCameraOutlined} from '@ant-design/icons';
import { useState} from 'react';
import Header from './components/Header';
import Content from './components/Content';

const menuItems = [
    {key: 'camera', icon: <VideoCameraOutlined />},
    {key: 'mqtt', icon: <UploadOutlined />},
];

function App() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('camera');
    const [quality, setQuality] = useState('L');

    return (
        <Layout style={{ height: '100%' }}>
            <Layout.Sider trigger={null} collapsible collapsed={true} collapsedWidth={collapsed?0:undefined}>
                <Menu
                    onSelect={({key})=>setSelectedMenu(key)}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[menuItems[0].key]}
                    items={menuItems}
                />
            </Layout.Sider>
            <Layout>
                <Header quality={quality} setQuality={setQuality} collapsed={collapsed} setCollapsed={setCollapsed}/>
                <Content videoQuality={quality} selectedMenu={selectedMenu}/>
            </Layout>
            
        </Layout>
    );
}

export default App;

