
export async function camGetDetails(){
    try {
        const response = await fetch('/api/cam/details.json', {credentials: 'include'});
        return [response.status>=200 && response.status<=299, await response.json(), response.status];
    }catch(e){
    }
    return [false, 'failed', 400];
}