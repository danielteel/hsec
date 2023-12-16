//Returns null if failed, array of user objects if passed
export async function manageUsers(roleFilter){
    if (roleFilter){
        roleFilter='/'+roleFilter;
    }else{
        roleFilter='';
    }
    try {
        const response = await fetch('/api/manage/users'+roleFilter, {credentials: 'include'});
        if (response.status===200){
            const users = await response.json();
            return users;
        }
    }catch(e){
    }
    return null;
}

//Returns null if failed, returns new user object if passed
export async function manageUserRole(user_id, new_role){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({new_role, user_id})
        };
        const response = await fetch('/api/manage/user/role',options);
        if (response.status===200){
            return await response.json();
        }
    }catch (e){
    }
    return null;
}