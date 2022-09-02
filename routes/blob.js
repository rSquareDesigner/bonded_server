var express = require('express');
var router = express.Router();

const { BlobServiceClient } = require("@azure/storage-blob");
 
const account = "seelbach";
const sas = process.env.AZURE_STORAGE_SAS;
 
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net${sas}`
);

router.get('/getFiles/:listing_id', function (req, res, next) {
    console.log('getFiles');
    let files = [];
    const containerName = 'listings'; //+ req.params.listing_id;
    const listing_id = req.params.listing_id;
    
    getFiles();
    
    async function getFiles() {
        const containerClient = blobServiceClient.getContainerClient(containerName);

        let i = 1;
        let iter = await containerClient.listBlobsFlat();
        for await (const blob of iter) {
            //console.log(`Blob ${i++}: ${blob.name}`);
            if (blob.name.indexOf(listing_id + '/') == 0) files.push(blob.name);
        }
        res.status(200).send(files);
    }
});

router.get('/getShaperFiles/:shaper_id', function (req, res, next) {
    console.log('getFiles');
    let files = [];
    const containerName = 'shapers'; //+ req.params.listing_id;
    const listing_id = req.params.shaper_id;
    
    getFiles();
    
    async function getFiles() {
        const containerClient = blobServiceClient.getContainerClient(containerName);

        let i = 1;
        let iter = await containerClient.listBlobsFlat();
        for await (const blob of iter) {
            //console.log(`Blob ${i++}: ${blob.name}`);
            if (blob.name.indexOf(shaper_id + '/') == 0) files.push(blob.name);
        }
        res.status(200).send(files);
    }
});

module.exports = router;