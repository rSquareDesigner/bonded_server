

var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
var common = require('../helpers/common');
const tables = require('../helpers/tables');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    

router.post('/passwordReset', function (req, res, next) {
    //console.log('sendgrid/passwordReset', req.body);
    var token = common.generateResetToken();

    var mailObj = {
        to: req.body.email,
        from: "help@lazocompany.com",
        templateId: "d-faa7718613ec4afcb2175aceb7334e29",
        dynamic_template_data: {
            //firstname: req.body.name,
            linkurl: 'https://app.lazocompany.com/password-reset?token=' + token
        }
    }

    sendMail(mailObj);
    res.status(200).send({});

    //update token and set expiration date of 2 days
    tables.update('users',req.body.user_id,'token', token);
    tables.update('users',req.body.user_id,'token_expiration', Date.now() + (1000 * 60 * 60 * 24 * 2));
    
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

