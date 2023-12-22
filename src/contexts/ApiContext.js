import {createContext} from 'react';
import { userLogin, userMe, userLogout, userPasswordChange, userCreate, userVerifyEmail, userChangeEmail, userGetChangeEmail } from '../api/user';
import { manageUsers, manageUserRole, manageUserEmail } from '../api/manage';
import {camGetDetails, camAdd, camDelete, camUpdate} from '../api/cam';

const ApiContext = createContext({
    userMe: async ()=>{},
    userLogin: async ()=>{},
    userLogout: async ()=>{},        
    userCreate:  async ()=>{},  
    userVerifyEmail: async ()=>{},  
    userChangeEmail:  async ()=>{},  
    userGetChangeEmail: async ()=>{},  
    userPasswordChange: async ()=>{},  

    manageUsers: async ()=>{},
    manageUserRole: async ()=>{},
    manageUserEmail: async()=>{},

    camGetDetails: async ()=>{},
    camAdd: async ()=>{},
    camDelete: async ()=>{},
    camUpdate: async ()=>{}
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
        userCreate: async (email) => await userCreate(email),
        userVerifyEmail: async (email, password, verifyCode) => await userVerifyEmail(email, password, verifyCode),
        userChangeEmail: async (newEmail, verifyCode) => checkForLogout(...await userChangeEmail(newEmail, verifyCode), setUser),
        userGetChangeEmail: async () => checkForLogout(...await userGetChangeEmail(), setUser),
        userPasswordChange: async (email, newPassword, confirmCode) => await userPasswordChange(email, newPassword, confirmCode),

        manageUsers: async (roleFilter) => checkForLogout(...await manageUsers(roleFilter), setUser),
        manageUserRole: async (userId, newRole) => checkForLogout(...await manageUserRole(userId, newRole), setUser),
        manageUserEmail: async (user_id, new_email) => checkForLogout(...await manageUserEmail(user_id, new_email), setUser),


        camGetDetails: async () =>  checkForLogout(...await camGetDetails(), setUser),
        camAdd: async (obj) =>  checkForLogout(...await camAdd(obj), setUser),
        camDelete: async (which) =>  checkForLogout(...await camDelete(which), setUser),
        camUpdate: async (obj) =>  checkForLogout(...await camUpdate(obj), setUser),
    };
    cachedSetUser=setUser;
    cachedApiContext=api;
    return api;
}