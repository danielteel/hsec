import {Spin} from 'antd';
import {useState, useEffect} from 'react';

import { userMe } from './api/user';

import Login from './components/Accounts';
import Main from './components/Main';


export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function checkLogin(){
            setUser(await userMe());
            setLoading(false);
        }
        checkLogin();
    }, []);

    if (loading){
        return <div style={{height: '100%', width: '100%', display:'flex', alignContent:'center', alignItems:'center', justifyContent:'center', justifyItems:'center'}}><Spin tip="Loading" size="large"><div style={{padding: 50, borderRadius: 4}}></div></Spin></div>
    }else{
        if (!user){
            return <Login setUser={setUser}/>
        }else{
            return <Main user={user} setUser={setUser}/>
        }
    }
}