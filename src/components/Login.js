import React, {useState} from 'react';
import {Layout, theme, Button, Input, Space, Typography} from 'antd';



export default function Login({setUser}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    return (<>
            <Typography.Title level={4}>Login</Typography.Title>
            <Space direction='vertical' size='small' style={{marginBottom:'5px'}}>
                <Input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <Input.Password placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </Space>
            <Button onClick={()=>{
                fetch('http://localhost:4001/user/login', {
                    credentials: 'include',
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email, password})
                    }).then(response => {
                    if (response.status!==200){
                        throw Error('logging in status code different than 200');
                    }
                    return response.json();
                    }).then(json => {
                        fetch('http://localhost:4001/user/me', {credentials: 'include'}).then(response=>{
                            if (response.status!==200) throw Error('not logged in');
                            return response.json();
                        }).then(me => {
                            setUser(me)
                        }).catch(err => {
                            console.error(err);
                        })
                        setError(null);
                    }).catch(err => {
                        setError('error logging in');
                        console.error(err);
                    });
            }}>Login</Button>
            {
                error
                ?
                    <Typography.Text type="danger">{error}</Typography.Text>
                :
                    null
            }
    </>);
}