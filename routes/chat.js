var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const usermodel=require('../model/users')
  usermodel.getUsersbystate(1)
  .then(function(users){
    res.render('chat', { users: users });
  })
  .catch(next);
  // console.log(users);
  
});
module.exports = router;