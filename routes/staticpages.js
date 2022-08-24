var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.post('/write', function (req, res, next) {

    var fileName = path.join(__dirname, '..', 'public', 'item-' + req.body.id + '.html');

    var stream = fs.createWriteStream(fileName);

    stream.once('open', function (fd) {
        var html = buildHtml(req);
        stream.end(html);
        res.status(200).send({ msg: 'Success Creating Page' });
    });

});

function buildHtml(req) {

    return '<!doctype html>' +
        '<html>' +
        '<head>' +
        '<base href="/">' +
        '<meta charset="utf-8">' +
        '<meta property="og:url" content="https://server.surfgenie.com/item-' + req.body.id + '.html" />' +
        '<meta property="og:type" content="article" />' +
        '<meta property="og:title" content="SurfGenie" />' +
        '<meta property="og:description" content="' + req.body.description + '" />'+
        '<meta property="og:image" content="' + req.body.image + '" />' +
        '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />' +
        '<script type="text/javascript">' +
        'window.location.href = "https://surfgenie.com/item-details/' + req.body.id + '";' +
        '</script>' +
        '</head>' +
        '<body>' +
        'If you are not redirected automatically, follow this <a href="https://surfgenie.com/item-details/' + req.body.id + '">link</a>.' +
        '</body>' +
        '</html>';
}

router.post('/delete', function(req, res, next) {
    try {
        fs.unlinkSync('./public/' + req.body.id + '.html');
    } catch (ex) {
        //console.log(ex)
        //res.send(500,ex)
    }
    res.status(200).send('successfully deleted ');
});

module.exports = router;
