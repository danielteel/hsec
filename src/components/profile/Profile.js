import React, {useRef, useState} from 'react';
import { Button, Divider, List, Typography, Row, Col, Form } from 'antd';




export default function Profile({user}) {

    return <div style={{width: '100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Typography.Title>Profile</Typography.Title>
        <Form labelCol={{span:6}} wrapperCol={{span:18}}>
            <Form.Item label="Email">
                <Typography.Text>{user.email}</Typography.Text>
            </Form.Item>
            <Form.Item label="Role">
                <Typography.Text>{user.role}</Typography.Text>
            </Form.Item>
            <Form.Item>
                <Button>Change Email</Button>
            </Form.Item>
            <Form.Item>
                <Button>Change Password</Button>
            </Form.Item>
            <Form.Item>
                <Button>Delete Account</Button>
            </Form.Item>
        </Form>
    </div>
}