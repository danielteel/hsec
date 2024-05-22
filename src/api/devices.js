const equal = require('fast-deep-equal');

let lastDevices=[];

export async function devicesList(){
    try {
        const response = await fetch('/api/devices/list', {credentials: 'include'});
        const devices = await response.json();
        if (response.status>=200 && response.status<=299){
            devices.sort((a, b) => {
                if (a.device_id>b.device_id){
                    return 1;
                }
                if  (a.device_id<b.device_id){
                    return -1;
                }
                return 0;
            })
            if (equal(lastDevices, devices)){
                return [true, lastDevices, response.status];
            }
            lastDevices=devices;
            return [true, devices, response.status];
        }else{
            return [false, devices, response.status];
        }
    }catch(e){
    }
    return [false, 'failed', 400];
}