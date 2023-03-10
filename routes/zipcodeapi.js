var express = require('express');
var router = express.Router();
const https = require('https');
const request = require('request');
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

/*
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
*/

router.post('/getAddressCoordinates', function(req, res, next){
    //console.log('--------- get coordinates -------',req.body.address);
    /*
    const clientKey = process.env.POSITIONSTACK_KEY;
    
    request(`http://api.positionstack.com/v1/forward?access_key=${clientKey}&query=${req.body.address}&output=json`, { json: true }, (errx, resx, bodyx) => {
      if (errx) { return console.log(errx); }
      console.log(bodyx.url);
      console.log(bodyx.explanation);
      res.status(200).send(bodyx);
    });
    */

    var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.address}&key=${process.env.GOOGLE_API_KEY}`;
    request(url, { json: true }, (errx, resx, bodyx) => {
      if (errx) { return console.log(errx); }
      res.status(200).send(bodyx);
    });
                //console.log("url --- ", url);

                /*
                return $http.get(url, {}, {   
                    headers: {
                        'Content-Type': 'multipart/form-data'
                        //'Access-Control-Allow-Headers': 'x-dreamfactory-api-key'
                    }
                }).then(function (result) {
                    //console.log("result - ", result);
                    if (result.data.results[0]){
                        answer.location = result.data.results[0].formatted_address;
                        answer.lat = result.data.results[0].geometry.location.lat;
                        answer.lng = result.data.results[0].geometry.location.lng;
                    }
                */

    
    
});


module.exports = router;