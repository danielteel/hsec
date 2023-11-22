import {Layout, Button, Space, Typography, Radio, theme} from 'antd';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';


const qualityOptions = [{label: 'Lo',value: 'L'}, {label: 'Hi', value: 'H'}];

export default function Header({quality, setQuality, collapsed, setCollapsed}){
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
                <Typography.Text strong style={{ margin: 0 }}>Video</Typography.Text>
                <Radio.Group
                    addonBefore="http://"
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