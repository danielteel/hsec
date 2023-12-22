export async function userMe(){
    try {
        const response = await fetch('/api/user/me', {credentials: 'include'});
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch(e){
    }
    return [false, 'failed', 400];
}

export async function userLogin(email, password, remember){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password, remember})
        };
        const response = await fetch('/api/user/login', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
        return [false, 'failed', 400];
    }
}

export async function userLogout(){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache"
        };
        const response = await fetch('/api/user/logout', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
        return [false, 'failed', 400];
    }
}


export async function userPasswordChange(email, newPassword, confirmCode){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, newPassword, confirmCode})
        };
        const response = await fetch('/api/user/passwordchange', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
        return [false, 'failed', 400];
    }
}

export async function userGetChangeEmail(){
    try{
        const response = await fetch('/api/user/getchangeemail', {credentials: 'include'});
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
        return [false, 'failed', 400];
    }
}

export async function userChangeEmail(newEmail, verifyCode){
    try{
        const body={};
        if (newEmail) body.newEmail=newEmail;
        if (verifyCode) body.verifyCode=verifyCode;
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        };
        const response = await fetch('/api/user/changeemail', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
        return [false, 'failed', 400];
    }
}

export async function userVerifyEmail(email, password, verifyCode){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password, verifyCode})
        };
        const response = await fetch('/api/user/verifyemail', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
        return [false, 'failed', 400];
    }
}

export async function userCreate(email){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email})
        };
        const response = await fetch('/api/user/create', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
        return [false, 'failed', 400];
    }
}

