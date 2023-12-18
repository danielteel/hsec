import {useState, useEffect, useContext} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Title from './Title';
import { manageUsers } from '../../api/manage';
import UserContext from '../../contexts/UserContext';

export default function User() {
    const [users, setUsers] = useState(null);

    const {user, setUser} = useContext(UserContext);

    useEffect(()=>{
        async function getUsers(){
            const fetchedUsers = await manageUsers();
            if (fetchedUsers){
                setUsers(fetchedUsers);
            }
        }
        getUsers();
    }, []);

    return <>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>Users</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>User ID</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((u) => (
                        <TableRow key={u.user_id}>
                            <TableCell>{u.user_i}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.role}</TableCell>
                            <TableCell><button type="button">Edit</button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    </>;
}