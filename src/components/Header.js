import {Layout, Button, Space, Typography, Radio, theme} from 'antd';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import Cookies from 'js-cookie';

const qualityOptions = [{label: 'Lo',value: 'L'}, {label: 'Hi', value: 'H'}];

export default function Header({quality, setQuality, collapsed, setCollapsed, setUser}){
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout.Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
                type="text"
                icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '12px',
                    width: 48,
                    height: 48,
                }}
            />
            <Typography.Title level={3} style={{ margin: 0 }}>DAN</Typography.Title>
            
            <Space style={{ marginRight: '10px' }}>
            <Button onClick={()=>{
                fetch('http://localhost:4001/user/logout', {
                    credentials: 'include',
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                    "Content-Type": "application/json",
                    },
                }).then(response => {
                    if (response.status===200) setUser(null);
                }).catch(err => {
                    console.error('error logging out', err);
                }).finally(()=>{
                    Cookies.remove('hashcess');
                    setUser(null);
                });

            }}>Logout</Button>
                <Typography.Text strong style={{ margin: 0 }}>Video</Typography.Text>
                <Radio.Group
                    options={qualityOptions}
                    onChange={({ target: { value } }) => { setQuality(value) }}
                    value={quality}
                    optionType="button"
                    buttonStyle="solid"
                    size='small'
                />
            </Space>
        </Layout.Header>
    );
}