import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import Cookies from "js-cookie";
import { userLogout } from "../../api/user";
import UserContext from "../../contexts/UserContext";

export default function LogoutButton(){
    const {setUser} = useContext(UserContext);
    async function logout(){
        await userLogout();
        Cookies.remove('hashcess', {domain: window.location.hostname});
        setUser(null);
    }

    return <IconButton color="inherit" children={<LogoutIcon />} onClick={logout}/>
}