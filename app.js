var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
var flash=require('connect-flash');
var config=require('config-lite')(__dirname);
var app = express();
const server = require('http').Server(app); 
const io = require('socket.io')(server);


var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var commentsRouter = require('./routes/comments');
var postsRouter = require('./routes/articles');
var signinRouter = require('./routes/signin');
var signupRouter = require('./routes/signup');
var signoutRouter = require('./routes/signout');
var snakeRouter = require('./routes/snake');
var boomRouter=require('./routes/boom');
var rankRouter=require('./routes/rankList');
var chatRouter=require('./routes/chat');


var onlineUsers = [];
let usersNum = 0;                    //统计在线登录人数

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')));


// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}))
// flash 中间件，用来显示通知
app.use(flash())
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/images'), // 上传文件目录
  keepExtensions: true// 保留后缀
}))
//变量
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  // res.locals.addOnlineUser = (data) => {
  //   onlineUsers.push({
  //       username: data.name,  
  //       message: []  
  //   });
  //   usersNum = onlineUsers.length;
  //   console.log(`用户${data.name}登录成功，进入ddvdd聊天室，当前在线登录人数：${usersNum}`);  
  // }
  res.locals.onlineUsers= onlineUsers;
  next();
});


app.use('/',indexRouter);
app.use('/articles', postsRouter);
// app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/signout', signoutRouter);
app.use('/comments', commentsRouter);
app.use('/snake', snakeRouter);
app.use('/rankList',rankRouter);
app.use('/chat',chatRouter);
app.use('/boom', boomRouter);
// catch 404 and forward to error handler

// 正常请求的日志
// app.use(expressWinston.logger({
//   transports: [
//       new winston.transports.Console({
//           json: true,
//           colorize: true
//       }),
//       new winston.transports.File({
//           filename: 'logs/success.log'
//       })
//   ]
// }));
// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
  
//   // res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // res.locals.success=req.flash('success').toString();
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
io.on('connection', function (socket) {
	/*是否是新用户标识*/
	var isNewPerson = true; 
	/*当前登录用户*/
    var username = null;
	/*监听登录*/
	socket.on('login',function(data){
		for(var i=0;i<onlineUsers.length;i++){
	        if(onlineUsers[i].username === data.username){
	          	isNewPerson = false;
	          	break;
	        }else{
	          	isNewPerson = true;
	        }
	    }
	    if(isNewPerson){
	        username = data.username;
	        onlineUsers.push({
            username:data.username,
            avatar:data.avatar
          })
          console.log(data.avatar)
          console.log(data.username)
          console.log(onlineUsers)
	        // /*登录成功*/
          // socket.emit('loginSuccess',onlineUsers);
          /*登录成功*/
          socket.emit('loginlist',onlineUsers);
	        /*向所有连接的客户端广播add事件*/
	        io.sockets.emit('add',data);
	    }else{
	    	/*登录失败*/
	        socket.emit('loginFail','');
      }
      
	})

	/*监听发送消息*/
	socket.on('sendMessage',function(data){
        io.sockets.emit('receiveMessage',data);
    })

	/*退出登录*/
	socket.on('disconnect',function(){
		/*向所有连接的客户端广播leave事件*/
      	io.sockets.emit('leave',username);
      	onlineUsers.map(function(val,index){
        if(val.username === username){
          onlineUsers.splice(index,1);
        }
      })
      socket.emit('loginlist',onlineUsers);
    })
})
server.listen(80,()=>{                
  console.log("server running at 127.0.0.1:80")});

module.exports = app;
