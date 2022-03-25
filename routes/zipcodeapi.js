var express = require('express');
var router = express.Router();
const https = require('https');
var tables = require('../helpers/tables');

router.get('/zipcode/:zip', function (req, res, next) {

    const clientKey = process.env.ZIPCODEAPI_APPLICATION_KEY;

    const options = new URL(`https://www.zipcodeapi.com/rest/${clientKey}/info.json/${req.params.zip}/radians`); 
    
    const reqx = https.request(options, resx => {
        //console.log(`statusCode: ${resx.statusCode}`)
        resx.setEncoding('utf8');
        resx.on('data', d => {
            //console.log('data zipapi',d);
            res.status(200).send(d);
        });

        /*
        resx.on('end', d => {
            console.log('response zipapi',reqx);
            res.status(200).send(d);
        });
        */
        
    })

    reqx.on('error', error => {
        //console.error(error)
        res.status(200).send({});
    })

    reqx.end()
});

router.post('/closestLocation', function (req, res, next) {
    
    var userzip = req.body.zip;
    var refzips = req.body.refzips;

    const clientKey = process.env.ZIPCODEAPI_CLIENT_KEY;
    const options = new URL(`https://www.zipcodeapi.com/rest/${clientKey}/multi-distance.json/${userzip}/${refzips}/mile`); 
    
    const reqx = https.request(options, resx => {
        //console.log(`statusCode: ${resx.statusCode}`)
        resx.setEncoding('utf8');
        resx.on('data', d => {
            //console.log('response zip api',d);
            res.status(200).send(d);
        });
    });

    reqx.on('error', error => {
        //console.error(error)
        res.status(200).send({});
    })

    reqx.end()
});


module.exports = router;