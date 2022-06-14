var tables = require('./tables');
const { BlobServiceClient } = require("@azure/storage-blob");
var Kraken = require("kraken");

const account = "surfgenie";
const sas = process.env.AZURE_STORAGE_SAS;
 
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net${sas}`
);



function optimizeImages(listing_id) {
    //console.log('optimizing images', listing_id);

    tables.getByField('listings', 'id', listing_id).then(function (data) {
        var listing = data[0];
        if (listing) {
            var listing_images = JSON.parse(listing.images);
            if (listing_images.length > 0) {
                getImageFiles(listing_images, listing_id);
            }
        }
    })

}

function evaluateImages(files, listing_images, listing_id) {
    //console.log('files =', files);
    //console.log('listing_images =', listing_images);
    var need_optimization = false;
    listing_images.forEach(x => {
        if (files.indexOf(listing_id + '/' + x) > -1) {
            var small_image = listing_id + '/' + x.replace('.jpeg', '_sm.jpeg');
            if (files.indexOf(small_image) == -1) {
                need_optimization = true;
                optimizeImage(listing_id, x, 'small');
            }

            var large_image = listing_id + '/' + x.replace('.jpeg', '_lg.jpeg');
            if (files.indexOf(large_image) == -1) {
                need_optimization = true;
                optimizeImage(listing_id, x, 'large');
            }
        }
        //else removeImage(listing_id,x);
    });

    if (need_optimization == false) {
        tables.update('listings', listing_id, 'image_optimization_complete', true);
    };
}



function getImageFiles(listing_images, listing_id) {
    let files = [];
    const containerName = 'listings'; //+ req.params.listing_id;

    getFiles();

    async function getFiles() {
        const containerClient = blobServiceClient.getContainerClient(containerName);

        let i = 1;
        let iter = await containerClient.listBlobsFlat();
        for await (const blob of iter) {
            //console.log(`Blob ${i++}: ${blob.name}`);
            if (blob.name.indexOf(listing_id + '/') == 0) files.push(blob.name);
        }
        
        evaluateImages(files,listing_images, listing_id);
        return;
    }
}

function optimizeImage(listing_id, filename, size){
    
    var filenameo = '';
    var width;

    if (size == 'small'){
        filenameo = listing_id + '/' + filename.replace('.jpeg','_sm.jpeg');
        width = 300;    
    }
    else if (size == 'large'){
        filenameo = listing_id + '/' + filename.replace('.jpeg','_lg.jpeg');
        width = 800;    
    }

    var container = 'listings';

    //log.kraken('opt request: ' + filenameo + ' ' + container);
    
    var imageurl = 'https://surfgenie.blob.core.windows.net/' + container + '/' + listing_id + '/' + filename;

    //console.log('optimize - ', imageurl);
    
    var kraken = new Kraken({
        "api_key": process.env.KRAKEN_KEY,
        "api_secret": process.env.KRAKEN_API_SECRET
    });
    var params = {
        url: imageurl,
        wait: true,
        resize: {
            width: width,
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
                
                //res.status(200).send({msg:"success with kraken"});
                //pending_optimization.success(filename);

            } else {
                //console.log("Fail. Error message: %s", status.message);
                //res.status(201).send("Fail. Error message: %s" + status.message);
                //pending_optimization.failed(filename);
                //log.kraken('ERROR: ' + status.message);
            }
        }
        else {
            //console.log("response from kraken is undefined");
            //res.status(201).send("Response from kraken is undefined");
            //pending_optimization.failed(filename);
            //log.kraken('ERROR: Response from kraken is undefined');
        }
    });
}

module.exports = {
    optimizeImages: optimizeImages
};
