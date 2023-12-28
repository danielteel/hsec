const equal = require('fast-deep-equal');

let lastFormats = [];



export async function camGetDetails(){
    try {
        const response = await fetch('/api/cam/details', {credentials: 'include'});
        const formats = await response.json();
        if (response.status>=200 && response.status<=299){
            formats.sort((a, b) => {
                if (a.file.toLowerCase()>b.file.toLowerCase()){
                    return 1;
                }
                if  (a.file.toLowerCase()<b.file.toLowerCase()){
                    return -1;
                }
                return 0;
            })
            if (equal(lastFormats, formats)){
                return [true, lastFormats, response.status];
            }
            lastFormats=formats;
            return [true, formats, response.status];
        }else{
            return [false, formats, response.status];
        }
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
        const formats = await response.json();
        if (response.status>=200 && response.status<=299){
            formats.sort((a, b) => {
                if (a.file.toLowerCase()>b.file.toLowerCase()){
                    return 1;
                }
                if  (a.file.toLowerCase()<b.file.toLowerCase()){
                    return -1;
                }
                return 0;
            })
            if (equal(lastFormats, formats)){
                return [true, lastFormats, response.status];
            }
            lastFormats=formats;
            return [true, formats, response.status];
        }else{
            return [false, formats, response.status];
        }
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
        const formats = await response.json();
        if (response.status>=200 && response.status<=299){
            formats.sort((a, b) => {
                if (a.file.toLowerCase()>b.file.toLowerCase()){
                    return 1;
                }
                if  (a.file.toLowerCase()<b.file.toLowerCase()){
                    return -1;
                }
                return 0;
            })
            if (equal(lastFormats, formats)){
                return [true, lastFormats, response.status];
            }
            lastFormats=formats;
            return [true, formats, response.status];
        }else{
            return [false, formats, response.status];
        }
    }catch (e){
    }
    return [false, 'failed', 400];
}


export async function camUpdate(obj){
    try{
        const options = {
            credentials: 'include',
            method: "POST",
            cache: "no-cache",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(obj)
        };
        const response = await fetch('/api/cam/update', options);
        const formats = await response.json();
        if (response.status>=200 && response.status<=299){
            formats.sort((a, b) => {
                if (a.file.toLowerCase()>b.file.toLowerCase()){
                    return 1;
                }
                if  (a.file.toLowerCase()<b.file.toLowerCase()){
                    return -1;
                }
                return 0;
            })
            if (equal(lastFormats, formats)){
                return [true, lastFormats, response.status];
            }
            lastFormats=formats;
            return [true, formats, response.status];
        }else{
            return [false, formats, response.status];
        }
    }catch (e){
    }
    return [false, 'failed', 400];
}