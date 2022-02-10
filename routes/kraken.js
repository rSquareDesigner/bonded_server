var express = require('express');
var router = express.Router();
var Kraken = require("kraken");
//var log = require('../log');

router.post('/optimizeImage', function(req, res, next) {
    //console.log("/optimizeImage");

    var filenameo = req.body.filename;
    var container = req.body.container;

    //log.kraken('opt request: ' + filenameo + ' ' + container);
    
    var imageurl = 'https://surfgenie.blob.core.windows.net/' + container + '/' + filenameo;
    
    var kraken = new Kraken({
        "api_key": process.env.KRAKEN_KEY,
        "api_secret": process.env.KRAKEN_API_SECRET
    });
    var params = {
        url: imageurl,
        wait: true,
        resize: {
            width: req.body.width ? req.body.width:150,
            strategy: "landscape"
        },
        lossy: true,
        azure_store: {
            account: "surfgenie",
            key: process.env.AZURE_STORAGE_KEY,
            container: container,
            path: filenameo,
            headers: {
                "Cache-Control": "public, max-age=31536000"
            }
        }
    };

    kraken.url(params, function (err,status) {
        if (status) {
            //console.log('kraken status', status);
            if (status.success) {
                //console.log("Success. Optimized image URL: %s", status.kraked_url);
                //log.kraken('Success. Optimized image URL: %s'+ status.kraked_url);
                
                res.status(200).send({msg:"success with kraken"});

            } else {
                //console.log("Fail. Error message: %s", status.message);
                res.status(500).send("Fail. Error message: %s" + status.message);
                //log.kraken('ERROR: ' + status.message);
            }
        }
        else {
            //console.log("response from kraken is undefined");
            res.status(500).send("Response from kraken is undefined");
            //log.kraken('ERROR: Response from kraken is undefined');
        }
    });
});

module.exports = router;