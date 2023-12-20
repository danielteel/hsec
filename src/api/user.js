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
        const response = await fetch('/api/user/login',options);
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
        const response = await fetch('/api/user/logout',options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
        return [false, 'failed', 400];
    }
}