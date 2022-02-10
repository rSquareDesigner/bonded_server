
function generateVerificationCode(){
    var chars = '123456789';
    var token = '';
    for (var i=0; i < 6; i++){
      token += chars.charAt(Math.round(Math.random()*(chars.length-1)));
    }
    return token;
}

function generateResetToken(){
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var token = '';
    for (var i=0; i < 16; i++){
      token += chars.charAt(Math.round(Math.random()*(chars.length-1)));
    }
    return token;
}

module.exports = {
    generateVerificationCode:generateVerificationCode,
    generateResetToken: generateResetToken
}