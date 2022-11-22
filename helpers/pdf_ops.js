var fs = require('fs');
var pdf = require('dynamic-html-pdf');
const tables = require('./tables');
var path = require("path");

const { BlobServiceClient } = require("@azure/storage-blob"); 
    
//var html = fs.readFileSync('./helpers/template.html', 'utf8');

// Custom handlebar helper
pdf.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
})

function createAgreement(){
    /*
    tables.getByField('hoas','id',_hoa_id).then(function(result){
        var hoa = result[0];
        if (hoa){
            createPDF(hoa);
        }
    })
    */
    var object = {
        seller: {
            id: 5,
            name: 'Seller Name, LLC',
            address: '1234 Main St',
            city: 'New York',
            state: 'NY',
            zipcode: '12345',
            contact_name: 'John Smith',
            contact_phone: '123-123-1234',
            contact_email: 'johnsmith@seller.com',
            bank: {
                name: 'Money Bank 123',
                owner_name: 'John Smith',
                routing_number: '00000000',
                account_number: '00000000',
            }
        },
        purchaser: {
            name: 'Purchaser Name, LLC',
            address: '5678 Cambell St',
            city: 'Chicago',
            state: 'IL',
            zipcode: '56789',
            contact_name: 'Tony Jones',
            contact_phone: '567-567-5678',
            contact_email: 'tonyjones@purchaser.com'
        },
        transaction: {
            serial_number: '1234-5675',
            wholesale_number: '66778899',
            date: 'November 3rd, 2022',
            payment_deadline_string: '12:00 PM, MONDAY November 9th, 2022',

        }

    }
    createPDF(object);
}

function createPDF(data) {

    var html = fs.readFileSync(path.join(__dirname,'..','helpers', 'sales_agreement_template.html'), 'utf8');
    
    var options = {
        format: "letter",
        orientation: "portrait",
        border: "10mm"
    };
    
    html = html.replace(/{{seller.name}}/g, data.seller.name);
    html = html.replace(/{{seller.address}}/g, data.seller.address);
    html = html.replace(/{{seller.city}}/g, data.seller.city);
    html = html.replace(/{{seller.state}}/g, data.seller.state);
    html = html.replace(/{{seller.zipcode}}/g, data.seller.zipcode);

    html = html.replace(/{{purchaser.name}}/g, data.purchaser.name);
    html = html.replace(/{{purchaser.address}}/g, data.purchaser.address);
    html = html.replace(/{{purchaser.city}}/g, data.purchaser.city);
    html = html.replace(/{{purchaser.state}}/g, data.purchaser.state);
    html = html.replace(/{{purchaser.zipcode}}/g, data.purchaser.zipcode);

    html = html.replace(/{{transaction.serial_number}}/g, data.transaction.serial_number);
    html = html.replace(/{{transaction.wholesale_number}}/g, data.transaction.wholesale_number);
    html = html.replace(/{{transaction.date}}/g, data.transaction.date);
    html = html.replace(/{{transaction.payment_deadline_string}}/g, data.transaction.payment_deadline_string);
    
    /*
    //form compensation string
    if (_hoa.compensations){
        var compensations = JSON.parse(_hoa.compensations);
        var html_string = '';
        compensations.forEach(c => {
            html_string += `<tr class="table_text"><td class="cell_local">${c.name}</td><td class="cell_local">${c.description}</td><td class="cell_local">$${c.amount}</td><td class="cell_local">${c.frequency}</td></tr>`;
        });
    }

    html = html.replace('{{hoa_compensations}}', html_string);

    */
    //form expenses string
    
    
    var document = {
        type: 'file',     // 'file' or 'buffer'
        template: html,
        context: {},
        path: path.join(__dirname,'..','temp', 'sales_agreement.pdf')    // it is not required if type is buffer
    };

    pdf.create(document, options)
        .then(res => {
            //console.log(res);
            uploadToAzureStorage(data.seller.id, data.purchaser.name, data.transaction.date);

        })
        .catch(error => {
            //console.error(error)
        });
}

async function uploadToAzureStorage(seller_id, buyer_name, date){
//console.log(process.env.AZURE_STORAGE_CONNECTION_STRING)
const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    // Create a unique name for the blob
const blobName = seller_id + '/' + 'sale-agreement_' + buyer_name.toLowerCase() + '_' + date + '.pdf';
const containerClient = blobServiceClient.getContainerClient('sales-agreements');

// Get a block blob client
const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//console.log('\nUploading to Azure storage as blob:\n\t', blobName);

// Upload data to the blob
//const data = 'Hello, World!';
const uploadBlobResponse = await blockBlobClient.uploadFile(path.join(__dirname,'..','temp', 'sales_agreement.pdf'));
//const uploadBlobResponse = await blockBlobClient.uploadFile('./temp/report.pdf');
//const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
//console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
    
}

module.exports = {
    createAgreement:createAgreement
}