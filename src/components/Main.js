import {Layout, Menu} from 'antd';
import {UserOutlined, VideoCameraOutlined, SettingOutlined} from '@ant-design/icons';
import { LiaUsersCogSolid } from "react-icons/lia";
import { HiOutlineCommandLine } from "react-icons/hi2";
import {useState} from 'react';
import Header from './Header';
import Content from './Content';


const unverifiedMenu=[
    {key: 'profile', icon :<UserOutlined />}
];

const memberMenu=[
    {key: 'camera', icon: <VideoCameraOutlined />},
    {key: 'profile', icon :<UserOutlined />}
];

const managerMenu = [
    {key: 'camera', icon: <VideoCameraOutlined />},
    {key: 'accounts', icon: <LiaUsersCogSolid/>},
    {key: 'profile', icon :<UserOutlined />}
];

const adminMenu = [
    {key: 'camera', icon: <VideoCameraOutlined />},
    {key: 'accounts', icon: <LiaUsersCogSolid/>},
    {key: 'settings', icon: <SettingOutlined />},
    {key: 'profile', icon :<UserOutlined />},
];

const superMenu = [
    {key: 'camera', icon: <VideoCameraOutlined />},
    {key: 'accounts', icon: <LiaUsersCogSolid/>},
    {key: 'settings', icon: <SettingOutlined />},
    {key: 'super', icon:<HiOutlineCommandLine />},
    {key: 'profile', icon :<UserOutlined />}
];

export default function Main({setUser, user}) {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('camera');
    
    let menuItems = unverifiedMenu;
    if (user.role==='member') menuItems=memberMenu;
    if (user.role==='manager') menuItems=managerMenu;
    if (user.role==='admin') menuItems=adminMenu;
    if (user.role==='super') menuItems=superMenu;

    return (
        <Layout style={{ height: '100%' }}>
            <Layout.Sider trigger={null} collapsible collapsed={true} collapsedWidth={collapsed ? 0 : undefined}>
                <Menu
                    onSelect={({key})=>setSelectedMenu(key)}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[menuItems[0].key]}
                    items={menuItems}
                />
            </Layout.Sider>
            <Layout>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} setUser={setUser}/>
                <Content selectedMenu={selectedMenu} user={user}/>
            </Layout>
            
        </Layout>
    );
}