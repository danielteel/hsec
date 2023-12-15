import React, {useState} from 'react';
import {Layout, theme, Button, Input, Space, Typography, Spin} from 'antd';
import { userLogin, userMe } from '../api/user';



export default function Login({setUser}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loggingIn, setLoggingIn] = useState(false);

    return (<>
            <Typography.Title level={4}>Login</Typography.Title>
            <Space direction='vertical' size='small' style={{marginBottom:'5px'}}>
                <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <Input.Password placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </Space>
            <Button disabled={loggingIn} onClick={async ()=>{
                setLoggingIn(true);
                setError(null);
                const failedMessage = await userLogin(email, password);
                if (failedMessage){
                    setError(failedMessage);
                }else{
                    const me = await userMe();
                    setUser(me);
                }
                setLoggingIn(false);
            }}>{
                loggingIn
                ?
                    <Spin/>
                :
                    'Login'
            }</Button>
            {
                error
                ?
                    <Typography.Text type="danger">{error}</Typography.Text>
                :
                    null
            }
    </>);
}