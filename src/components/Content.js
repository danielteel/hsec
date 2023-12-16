import React, {Profiler, useState} from 'react';
import {Layout, theme} from 'antd';

import Profile from './profile/Profile';
import QuadCamera from './QuadCamera';
import VerifyAccounts from './verifyaccounts/VerifyAccounts';


export default function Content({selectedMenu, user}){
    const {token: { colorBgContainer }} = theme.useToken();

 
    return (
        <Layout.Content style={{ display: 'flex', flexDirection: 'column', margin: '8px 6px', backgroundColor: colorBgContainer }}>
            {
                selectedMenu === 'camera' ?
                    <QuadCamera/>
                : selectedMenu === 'profile' ?
                    <Profile user={user}/>
                : selectedMenu === 'accounts' ?
                    <VerifyAccounts/>
                :
                    'yolso'
            }
        </Layout.Content>
    );
}