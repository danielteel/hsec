import {useState, useEffect, useContext} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Title from './Title';
import ApiContext from '../../contexts/ApiContext';

export default function User() {
    const [users, setUsers] = useState(null);

    const {manageUsers} = useContext(ApiContext);

    useEffect(()=>{
        async function getUsers(){
            const [passed, fetchedUsers] = await manageUsers();
            if (passed){
                setUsers(fetchedUsers);
            }
        }
        getUsers();
    }, [manageUsers]);

    return <>
        <Paper sx={{p: 1, display: 'flex', flexDirection: 'column'}}>
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
                {users?.map?.((u) => (
                    <TableRow key={u.user_id}>
                        <TableCell>{u.user_id}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.role}</TableCell>
                        <TableCell><Button variant="outlined" size="small" disableElevation>Edit</Button></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </Paper>
    </>;
}