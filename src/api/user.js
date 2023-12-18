export async function userMe(){
    try {
        const response = await fetch('/api/user/me', {credentials: 'include'});
        return [response.status>=200 && response.status<=299, await response.json()];
    }catch(e){
    }
    return [false, 'failed'];
}

export async function userLogin(email, password){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        };
        const response = await fetch('/api/user/login',options);
        return [response.status>=200 && response.status<=299, await response.json()];
    }catch (e){
        return [false, 'failed'];
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
        return [response.status>=200 && response.status<=299, await response.json()];
    }catch (e){
        return [false, 'failed'];
    }
}