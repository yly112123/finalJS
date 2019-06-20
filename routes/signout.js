const express = require('express')
const router = express.Router()
const usermodel=require('../model/users')
const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
  usermodel.updateStateById(req.session.user._id,{state:0});
  req.session.user=null;
  req.flash('success','退出登录');
  res.redirect('/articles');
})

module.exports = router