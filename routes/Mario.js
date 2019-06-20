const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function(req,res,next){
    const user=req.session.user;
    console.log(req.session);
    res.render('Mario');
})
module.exports = router