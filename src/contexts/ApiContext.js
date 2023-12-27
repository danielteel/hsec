import {createContext} from 'react';
import { userLogin, userMe, userLogout, userChangePassword, userForgotStart, userForgotEnd, userChangeEmailEnd, userChangeEmailStart, userChangeEmailStatus, userCreate, userVerifyEmail } from '../api/user';
import { manageUsers, manageUserRole, manageUserEmail } from '../api/manage';
import {camGetDetails, camAdd, camDelete, camUpdate} from '../api/cam';


const setUserRef={current: null};

const api={
    userMe: async ()=>checkForLogout(...await userMe(), setUserRef.current),
    userLogin: async (email, password, remember)=>await userLogin(email, password, remember),
    userLogout: async ()=>await userLogout(),
    userChangePassword:  async (oldPassword, newPassword)=>checkForLogout(...await userChangePassword(oldPassword, newPassword), setUserRef.current),  
    userForgotStart: async (email)=>await userForgotStart(email),
    userForgotEnd:  async (email, newPassword, confirmCode)=>await userForgotEnd(email, newPassword, confirmCode),
    userChangeEmailEnd: async (confirmCode)=>checkForLogout(...await userChangeEmailEnd(confirmCode), setUserRef.current),
    userChangeEmailStart: async (newEmail, password)=>checkForLogout(...await userChangeEmailStart(newEmail, password), setUserRef.current),
    userChangeEmailStatus: async ()=> checkForLogout(...await userChangeEmailStatus(), setUserRef.current),
    userCreate: async (email) => await userCreate(email),
    userVerifyEmail: async (email, password, confirmCode) => await userVerifyEmail(email, password, confirmCode),

    manageUsers: async (roleFilter) => checkForLogout(...await manageUsers(roleFilter), setUserRef.current),
    manageUserRole: async (userId, newRole) => checkForLogout(...await manageUserRole(userId, newRole), setUserRef.current),
    manageUserEmail: async (userId, newEmail) => checkForLogout(...await manageUserEmail(userId, newEmail), setUserRef.current),

    camGetDetails: async () =>  checkForLogout(...await camGetDetails(), setUserRef.current),
    camAdd: async (obj) =>  checkForLogout(...await camAdd(obj), setUserRef.current),
    camDelete: async (which) =>  checkForLogout(...await camDelete(which), setUserRef.current),
    camUpdate: async (obj) =>  checkForLogout(...await camUpdate(obj), setUserRef.current),
};

const ApiContext = createContext(api);
export default ApiContext;


function checkForLogout(passed, message, status, setUser){
    if (status===401 && message.error==='log in'){
        setUser(null);
    }
    return [passed, message];
}

export function setSetUser(setUser){
    setUserRef.current = setUser;
    return api;
}