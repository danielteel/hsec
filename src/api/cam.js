
export async function camGetDetails(){
    try {
        const response = await fetch('/api/cam/details', {credentials: 'include'});
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch(e){
    }
    return [false, 'failed', 400];
}

export async function camAdd(obj){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(obj)
        };
        const response = await fetch('/api/cam/add', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
    }
    return [false, 'failed', 400];
}


export async function camDelete(which){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({which})
        };
        const response = await fetch('/api/cam/delete', options);
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch (e){
    }
    return [false, 'failed', 400];
}