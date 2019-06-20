const express = require('express')
const router = express.Router()
const usermodel=require('../model/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', function (req, res, next) {
    // const author=req.query.author;
    // const user=req.session.user;
    usermodel.getUsers()
    .then(function(users){
      res.render('rankList',{users:users});
    })
    .catch(next);
  })

module.exports = router
