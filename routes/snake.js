const express = require('express')
const router = express.Router()
const usermodel=require('../model/users');
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function(req,res,next){
    const user=req.session.user;
    console.log(user._id);
    // usermodel.updateScoreById(user._id,{score:4})

    res.render('snake',{name:user.name});
});

router.get('/:score', checkLogin, function (req, res, next) {
    const user=req.session.user;
    const score=req.params.score;
    const numscore=parseInt(score);
    const time=new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString();
    console.log("1111  "+time);
    console.log("2222   "+user.score);
    console.log("3333   "+numscore);
    if(user.score<numscore){
        usermodel.updateScoreById(user._id,{score:numscore,time:time});
        res.redirect('back');
    }
    else{
        res.redirect('back');
    }
  });

module.exports = router