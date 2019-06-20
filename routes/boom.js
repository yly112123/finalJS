const express = require('express')
const router = express.Router()
const usermodel=require('../model/users');
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function(req,res,next){
    const user=req.session.user;
    console.log(user._id);
    // usermodel.updateScoreById(user._id,{score:4})

    res.render('boom',{name:user.name});
});
module.exports = router