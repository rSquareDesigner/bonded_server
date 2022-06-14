var express = require('express');
var router = express.Router();
var Kraken = require("kraken");
var image_optimization = require('../helpers/image_optimization');
//var log = require('../log');

router.post('/optimizeImage', function(req, res, next) {
    //console.log("/optimizeImage");

    //assign file name depending on size
    if (!req.body.width)  {
        res.status(200).send({msg:"missing image width"});
        return;
    }

    var filenameo = '';

    if (req.body.width == 300) filenameo = req.body.filename.replace('.jpeg','_sm.jpeg');
    else if (req.body.width == 800) filenameo = req.body.filename.replace('.jpeg','_lg.jpeg');
    else filenameo = req.body.filename;

    var container = req.body.container;

    //log.kraken('opt request: ' + filenameo + ' ' + container);
    
    var imageurl = 'https://surfgenie.blob.core.windows.net/' + container + '/' + req.body.filename;
    
    var kraken = new Kraken({
        "api_key": process.env.KRAKEN_KEY,
        "api_secret": process.env.KRAKEN_API_SECRET
    });
    var params = {
        url: imageurl,
        wait: true,
        resize: {
            width: req.body.width,
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
            console.log('kraken status', status);
            if (status.success) {
                //console.log("Success. Optimized image URL: %s", status.kraked_url);
                //log.kraken('Success. Optimized image URL: %s'+ status.kraked_url);
                
                res.status(200).send({msg:"success with kraken"});
                //pending_optimization.success(filename);

            } else {
                console.log("Fail. Error message: %s", status.message);
                res.status(201).send("Fail. Error message: %s" + status.message);
                //pending_optimization.failed(filename);
                //log.kraken('ERROR: ' + status.message);
            }
        }
        else {
            console.log("response from kraken is undefined");
            res.status(201).send("Response from kraken is undefined");
            //pending_optimization.failed(filename);
            //log.kraken('ERROR: Response from kraken is undefined');
        }
    });
});

router.post('/optimizeListingImages', function(req, res, next) {
    var listing_id = req.body.listing_id;

    if (listing_id){
        res.status(200).send({msg: 'image optimization request received'});
        image_optimization.optimizeImages(listing_id);
    }
    else res.status(200).send({msg: 'listing_id is missing from request'});
});

module.exports = router;