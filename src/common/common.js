
export function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export function isLegalPassword(password){
    if (typeof password !== 'string') return 'must be a string.';
    let failFor = '';
    if (password.trim() !== password){
        failFor+='no leading or trailing spaces allowed. ';
    }

    const upper = /[A-Z]/g;
    const lower = /[a-z]/g;
    const digit = /[0-9]/g;
    const special = /[`~!@#$%^&*()\-_=+[\];',./{}\\:"<>?|]/g;

    if (!password.match(upper)) failFor+='must have at least one uppercase character. ';
    if (!password.match(lower)) failFor+='must have at least one lowercase character. ';
    if (!password.match(digit)) failFor+='must have at least one digit. ';
    if (!password.match(special)) failFor+='must have at least one special character. ';
    if (password.trim().length>36) failFor+='must be less than 36 characters. ';
    if (password.trim().length<8) failFor+='must be at least 8 characters. ';
    return failFor.trim();
}