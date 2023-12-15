export async function userMe(){
    try {
        const response = await fetch('/api/user/me', {credentials: 'include'});
        if (response.status===200){
            const me = await response.json();
            return me;
        }
    }catch(e){
    }
    return null;
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
        if (response.status===200){
            return null;
        }else{
            return await response.json();
        }
    }catch (e){
        return 'an error occurred logging in';
    }
}