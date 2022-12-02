var express = require('express');
var router = express.Router();
const tables = require('../helpers/tables');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/exists', function(req, res, next) {
  
  let email = req.query.email;

  tables.getByField('users','email',email).then(function(data){
    if (data.length > 0) res.status(200).send({exists: true});
    else res.status(200).send({exists: false});
    console.log((data.length > 0 ? 'user exists':'user does not exist'));
  });

  //res.send('respond with a resource');
});

router.post('/validateCode', function(req, res, next) {
  var user_response = req.body.code;
  var user_phone = req.body.phone;

  tables.getByField('login_sessions','phone', user_phone).then(function(data){
    //console.log('data', data);
    var session_object = data.filter(x => {return x.phone == user_phone && x.code == user_response})[0];

    //if code is correct
    if (session_object){      
      //TODO delete session_object
      tables.deleteItem('login_sessions', session_object.id).then(function(){
        //console.log('login sessions item deleted')
      })
      
      res.status(200).send({status:'verified'});
    }

    else res.status(200).send({status:'failed'});

  })

  //res.send('respond with a resource');
});

module.exports = router;
