import {Layout, Menu} from 'antd';
import {UploadOutlined, VideoCameraOutlined} from '@ant-design/icons';
import { LiaUsersCogSolid } from "react-icons/lia";
import {useState, useEffect} from 'react';
import Header from './components/Header';
import Content from './components/Content';
import Login from './components/Accounts';

const menuItems = [
    {key: 'camera', icon: <VideoCameraOutlined />},
    {key: 'mqtt', icon: <UploadOutlined />},
    {key: 'accounts', icon: <LiaUsersCogSolid/>}
];

function App() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('camera');
    const [quality, setQuality] = useState('L');
    const [user, setUser] = useState(null);

    useEffect(()=>{
        fetch('/api/user/me', {credentials: 'include'}).then(response=>{
            if (response.status!==200) throw Error('not logged in');
            return response.json();
        }).then(me => {
            setUser(me)
        }).catch(err => {
            console.error(err);
        })
    }, []);

    if (!user){
        return (
            <Login setUser={setUser}/>
        );
    }

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
                <Header quality={quality} setQuality={setQuality} collapsed={collapsed} setCollapsed={setCollapsed} setUser={setUser}/>
                <Content videoQuality={quality} selectedMenu={selectedMenu}/>
            </Layout>
            
        </Layout>
    );
}

export default App;

