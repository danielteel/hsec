import React, {useState} from 'react';
import {Layout, theme, Button, Input, Space, Typography} from 'antd';



export default function CreateAccount({setAccessToken}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [error, setError] = useState(null);
    const [state, setState] = useState('create');

    return (<>
                    <Typography.Title level={4}>Create Account</Typography.Title>
                    
                    {
                        state==='create'
                        ?
                            <>
                            <Space direction='vertical' size='small' style={{marginBottom:'5px'}}>
                                <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                                <Input.Password placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                            </Space>
                            <Button onClick={()=>{
                                fetch('https://danteel.dedyn.io/api/user/create', {
                                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                                    mode: "cors", // no-cors, *cors, same-origin
                                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                    "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({email, password})
                                }).then(response => {
                                    setError(null);
                                    if (response.status!==201){
                                        throw Error('create account status code different than 200');
                                    }
                                    return response.json();
                                }).then(json => {
                                    setState('verify');
                                }).catch(err => {
                                    setError('error creating account');
                                    console.error(err);
                                });
                            }}>Create Account</Button>
                            {
                                error
                                ?
                                    <Typography.Text type="danger">{error}</Typography.Text>
                                :
                                    null
                            }
                            </>
                        :
                            <>
                            <Space direction='vertical' size='small' style={{marginBottom:'5px'}}>
                                <Input placeholder="email" value={email} disabled/>
                                <Input placeholder="verify code" value={verifyCode} onChange={(e)=>setVerifyCode(e.target.value)}/>
                            </Space>
                            <Button onClick={()=>{
                                fetch('https://danteel.dedyn.io/api/user/verifyemail', {
                                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                                    mode: "cors", // no-cors, *cors, same-origin
                                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                    "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({email, verifyCode})
                                }).then(response => {
                                    setError(null);
                                    if (response.status!==200){
                                        throw Error('verify email status code different than 200');
                                    }
                                    return response.json();
                                }).then(json => {
                                    setAccessToken(json.accessToken);
                                }).catch(err => {
                                    setError('error verifying email');
                                    console.error(err);
                                });
                            }}>Verify Email</Button>
                            {
                                error
                                ?
                                    <Typography.Text type="danger">{error}</Typography.Text>
                                :
                                    null
                            }
                            </>
                    }
    </>);
}