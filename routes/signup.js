const express = require('express')
const router = express.Router()
const fs=require('fs');
const path=require('path');
const usermodel=require('../model/users');


const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
//   res.send('注册页')
    res.render('signup');
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
    const name=req.fields.name;
    const password=req.fields.password;
    const repassword=req.fields.repassword;
    //path.sep:将特定文字分隔符 ‘\\' 或 ‘/' 的字符串转换成数组对象.pop()返回最后一个元素
    const avatar=req.files.avatar.path.split(path.sep).pop();
    try{
        console.log(name+"  "+password+"   "+avatar+"    "+repassword+"    "+req.files.avatar);
        if(!(name.length>=3&&name.length<=8)){
            throw new Error('用户名：3——8个字符');
        }
        if(password.length<6||password.length>10){
            throw new Error('密码：6——10个字符');
        }
        if(password!==repassword){
            throw new Error('两次密码不一样');
        }
        if(avatar.search('.jpg')==-1){
            throw new Error('请上传头像');
        }
    }catch(e){
        // 注册失败，异步删除上传的头像
        // if(req.files.avatar.name){
        fs.unlink(req.files.avatar.path,function(err){
            if(err){
                throw err;
            }
            console.log("file"+req.files.avatar.path+"delete");
        });
        // }
        req.flash('error', e.message);
        return res.redirect('/signup');
    }
    let user={
        name:name,
        password:password,
        avatar:avatar
    }
    usermodel.create(user)
    .then(function(result){
        user=result.ops[0];
        //删除密码，将用户信息存入session
        delete user.password;
        req.session.user=user;
        req.flash('success','注册成功');
        // res.locals.addOnlineUser(user);
        // console.log(res.locals.onlineUsers);
        res.redirect('/snake');
        console.log("then  "+user);
    })
    .catch(function(e){
        // 注册失败，异步删除上传的头像
    if(avatar.search('.jpg')!==-1){
        fs.unlink(req.files.avatar.path,function(err){
            if(err){
                throw err;
            }
            console.log("file"+req.files.avatar.path+"delete");
        });
    }
      // 用户名已存在，跳回注册页
    if (e.message.match('duplicate key')) {
        console.log(e.message);
        req.flash('error', '用户名已被占用')
        return res.redirect('/signup')
    }
      next(e);
    });
//   res.send('注册')
})

module.exports = router