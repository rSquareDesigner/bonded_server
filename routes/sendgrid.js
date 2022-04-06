

var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
const common = require('../helpers/common');
const verify = require('../helpers/verify');
const tables = require('../helpers/tables');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    

router.post('/passwordReset', function (req, res, next) {
    //console.log('sendgrid/passwordReset', req.body);
    var token = common.generateResetToken();

    var mailObj = {
        to: req.body.email,
        from: "admin@surfgenie.com",
        templateId: "d-3586b483b7e94c1b9520f4ed23d46648",
        dynamic_template_data: {
            //firstname: req.body.name,
            linkurl: 'https://surfgenie.com/password-reset?token=' + token
        }
    }

    sendMail(mailObj);
    res.status(200).send({});

    //update token and set expiration date of 2 days
    tables.update('users',req.body.user_id,'token', token);
    tables.update('users',req.body.user_id,'token_expiration', Date.now() + (1000 * 60 * 60 * 24 * 2));
    
});


router.post('/verifyEmail', function (req, res, next) {
    
    var code = common.generateVerificationCode();

    var mailObj = {
        to: req.body.email,
        from: "admin@surfgenie.com",
        templateId: "d-e5334b37f8e048ba8976bc5ae26a1ac9",
        dynamic_template_data: {
            email: req.body.email,
            verification_code: code
        }
    }

    sendMail(mailObj);
    res.status(200).send({});

    verify.storeEmailcode(req.body.user_id, code);
    
});



function sendMail(request){
    //log.sendgrid('send request: ' + request.to + ' ' + request.templateId);
    sgMail.send(request).then((response) => {
        //console.log('Message sent', response)
        //console.log('response', response[0])
        //log.sendgrid('success: ' + response[0].statusCode);
    }).catch((error) => {
        //console.log(error.response.body.errors[0].message)
        //log.sendgrid('ERROR: ' + error.response.body.errors[0].message);
        // console.log(error.response.body.errors[0].message)
    })
    
}

module.exports = router;

