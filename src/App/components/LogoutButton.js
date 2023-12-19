import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import Cookies from "js-cookie";
import UserContext from "../../contexts/UserContext";
import ApiContext from "../../contexts/ApiContext";

export default function LogoutButton(){
    const {setUser} = useContext(UserContext);
    const {userLogout} = useContext(ApiContext);
    async function logout(){
        await userLogout();
        Cookies.remove('hashcess', {domain: window.location.hostname});
        setUser(null);
    }

    return <IconButton color="inherit" children={<LogoutIcon />} onClick={logout}/>
}