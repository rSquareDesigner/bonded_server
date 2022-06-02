

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

router.post('/messageNotification', function (req, res, next) {

    //get recipient's email from user_id
    tables.getByField('users','id', req.body.recipient_user_id).then(function(result){
        var recipient_user = result[0];
        
        if (recipient_user){
            var mailObj = {
                to: recipient_user.email,
                from: "admin@surfgenie.com",
                templateId: "d-f2510f67b5304457b4d34af1cd0af72e",
                dynamic_template_data: {
                    user_name: req.body.user_name,
                    user_image: req.body.user_image,
                    user_message: req.body.user_message,
                    listing_title: req.body.listing_title,
                    listing_description: req.body.listing_description,
                    listing_image: req.body.listing_image,
                    link_url: 'https://surfgenie.com/messages/' + req.body.chat_id
                }
            }
        
            sendMail(mailObj);
            res.status(200).send({});
        }

        else res.status(500).send({msg:'user not found'});
    });
    
});

router.post('/rateYourPurchase', function (req, res, next) {

    //get recipient's email from user_id
    Promise.all([
        tables.getByField('users','id', req.body.seller_user_id),
        tables.getByField('users','id', req.body.buyer_user_id)
    ]).then(function(results){
        var seller = results[0][0];
        var buyer = results[1][0];
        //console.log('seller', seller);
        //console.log('buyer', buyer);
        if (seller && buyer){
            var mailObj = {
                to: buyer.email,
                from: "admin@surfgenie.com",
                templateId: "d-e11857bf685643f2a65a5506b6234443",
                dynamic_template_data: {
                    seller_name: seller.name,
                    seller_image: seller.image,
                    listing_title: req.body.listing_title,
                    listing_description: req.body.listing_description,
                    listing_image: req.body.listing_image,
                    link_url: 'https://surfgenie.com/transaction-feedback/' + req.body.transaction_id
                }
            }
        
            sendMail(mailObj);
            res.status(200).send({});
        }

        else res.status(500).send({msg:'user not found'});
    });
    
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

