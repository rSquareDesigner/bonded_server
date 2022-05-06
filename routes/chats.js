var express = require('express');
var router = express.Router();
const conn = require('../db');

router.get('/chatsByItemAndUser', function (req, res, next) {

  let listing_id = req.query.listing_id;
  let user_id = req.query.user_id;
  
  let sqlstr = 'SELECT * FROM chats WHERE listing_id=' + listing_id + ' AND (user_id=' + user_id + ' OR user2_id=' + user_id + ')';
  
  conn.query(sqlstr, function (err, rows) {
    if (err) throw err;

    res.status(200).send(rows);
    releaseConnection(conn);

  });
});

router.get('/chatsByUser', function (req, res, next) {

  let user_id = req.query.user_id;
  
  let sqlstr = 'SELECT * FROM chats WHERE user_id=' + user_id + ' OR user2_id=' + user_id;
  
  conn.query(sqlstr, function (err, rows) {
    if (err) throw err;

    res.status(200).send(rows);
    releaseConnection(conn);

  });
});

function releaseConnection(con){
    con.getConnection( function(err, connection){
      connection.release();
    });
}

module.exports = router;