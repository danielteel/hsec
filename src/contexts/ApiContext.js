import {createContext} from 'react';
import { userLogin, userMe, userLogout } from '../api/user';
import { manageUsers, manageUserRole } from '../api/manage';
import {camGetDetails} from '../api/cam';

const ApiContext = createContext({
    userMe: async ()=>{},
    userLogin: async ()=>{},
    userLogout: async ()=>{},
    manageUsers: async ()=>{},
    manageUserRole: async ()=>{},
    camGetDetails: async ()=>{}
});
export default ApiContext;


function checkForLogout(passed, message, status, setUser){
    if (status===401 && message.error==='log in'){
        setUser(null);
    }
    return [passed, message];
}

let cachedApiContext = null;
let cachedSetUser = null;
export function buildApiContext(setUser){
    if (cachedSetUser===setUser){
        return cachedApiContext;
    }
    const api = {
        userMe: async () => checkForLogout(...await userMe(), setUser),
        userLogin: async (email, password) => checkForLogout(...await userLogin(email, password), setUser),
        userLogout: async () => checkForLogout(...await userLogout(), setUser),
        manageUsers: async (roleFilter) => checkForLogout(...await manageUsers(roleFilter), setUser),
        manageUserRole: async (userId, newRole) => checkForLogout(...await manageUserRole(userId, newRole), setUser),
        camGetDetails: async () =>  checkForLogout(...await camGetDetails(), setUser)
    };
    cachedSetUser=setUser;
    cachedApiContext=api;
    return api;
}