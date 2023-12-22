export async function manageUsers(roleFilter){
    if (roleFilter){
        roleFilter='/'+roleFilter;
    }else{
        roleFilter='';
    }
    try {
        const response = await fetch('/api/manage/users'+roleFilter, {credentials: 'include'});
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch(e){
    }
    return [false, 'failed', 400];
}

export async function manageUserRole(user_id, new_role){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({new_role, user_id})
        };
        const response = await fetch('/api/manage/user/role', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
    }
    return [false, 'failed', 400];
}

export async function manageUserEmail(user_id, new_email){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({new_email, user_id})
        };
        const response = await fetch('/api/manage/user/email', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
    }
    return [false, 'failed', 400];
}