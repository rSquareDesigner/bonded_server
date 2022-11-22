var express = require('express');
var router = express.Router();
const pdf_ops = require('../helpers/pdf_ops');


router.post('/createAgreement', function(req, res, next) {
  //var hoa_id = req.body.hoa_id;

  //pdf_ops.createReport(hoa_id);
  pdf_ops.createAgreement();

  res.status(200).send({status:'document_requested'});

  //res.send('respond with a resource');
});

module.exports = router;
