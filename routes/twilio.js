var express = require('express');
var router = express.Router();
const verify = require('../helpers/verify');
const common = require('../helpers/common');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);


router.post('/confirmPhone', function (req, res, next) {
    var phone = req.body.phone;
    var code = common.generateVerificationCode();
    
    if (phone) {
        var phonex = phone.replace(/[a-zA-Z\s\(\)\-\.:]/g, '');
        if (phonex.length == 10) phonex = '+1' + phonex;
        client.messages
            .create({
                body: 'Your seelbach confirmation code is: ' + code,
                from: '+17752568484',
                to: phonex,
            })
            .then(message => {
                res.status(200).send({});
                //console.log(message.sid)
            });
    }

    verify.storePhonecode(req.body.user_id, code);

});

router.post('/listingReported', function (req, res, next) {
    var phone = '+17026725093';
    //var phone = '+15403141828';
    
    client.messages
            .create({
                body: 'A user has reported a listing. You can see the reports here ' + 'https://seelbach.com/admin/reports',
                from: '+17752568484',
                to: phone,
            })
            .then(message => {
                res.status(200).send({});
                //console.log(message.sid)
            });

});


module.exports = router;