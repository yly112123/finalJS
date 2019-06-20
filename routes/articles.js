const express = require('express')
const router = express.Router()
const postmodel=require('../model/article')
const commentmodel=require('../model/comments')
const Article=require('../db/mongo').Article;
const checkLogin = require('../middlewares/check').checkLogin

// GET /articles 所有用户或者特定用户的文章页
// GET /articles?author=xxx
router.get('/', function (req, res, next) {
  const author=req.query.author;
  let page = Number(req.query.page) || 1;
  const limit=2;
  let skip;
  let pages;
  const query = {};
    if (author) {
      query.author = author
    }
  //获取总条数；
  Article.count(query).then(function (count) {
    //计算总页数；
    pages=Math.ceil(count/limit)
    //当前页不能大于总页数；
    page=Math.min(page,pages)
    //当前页不能小于1
    page=Math.max(page,1)
    console.log(page)
    skip=(page-1)*limit;//忽略数
})
.then(function(){
    console.log(query);
    return Article
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .contentToHtml()
      .addCommentsnum()
      .limit(limit).skip(skip)
      .exec();
}).then(function(articles){
  res.render('articles',{
    articles:articles,
    page:page,
    // count:count,
    pages:pages,
    limit:limit,
  });
})
.catch(next);

})

router.post('/',checkLogin,function(req,res,next){
  const keyword=req.fields.proname;
  let query={};
  query.title=new RegExp(keyword);
  query.content=new RegExp(keyword);
  var _filter={
    $or: [  // 多字段同时匹配
      {title: {$regex: keyword}},
      {content: {$regex: keyword, $options: '$i'}}, //  $options: '$i' 忽略大小写
    ]
  }
  console.log(_filter)
  Article.find(_filter)
  .populate({ path: 'author', model: 'User' })
  .sort({ _id: -1 })
  .addCreatedAt()
  .contentToHtml()
  .addCommentsnum()
  .exec()
  .then(function(articles){
    res.render('filterarticles',{
      articles:articles
    });
  })
  .catch(next);
})




// POST 发表文章
router.post('/create', checkLogin, function (req, res, next) {
  const author= req.session.user._id;
  const title=req.fields.title;
  const content=req.fields.content;
  try{
    if(!title.length){
      throw new Error('请输入标题');
    }
    if(!content.length){
      throw new Error('请输入内容');
    }
  }catch(e){
    req.flash('error',e.message);
    return res.redirect('back');
  }
  let article={
    author:author,
    title:title,
    content:content
  }
  postmodel.create(article)
  .then(function(result){
    article=result.ops[0];
    req.flash('success','发表成功');
    res.redirect(`/articles/${article._id}`);
  })
  .catch(next);
});

// GET 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.render('create')
})

// GET 一个文章页
router.get('/:articleId', function (req, res, next) {
  const articleId=req.params.articleId;
  // 将多个Promise实例包装成一个新的Promise实例
  console.log(articleId);
  Promise.all([
    postmodel.getArticleById(articleId),
    commentmodel.getComments(articleId),
    postmodel.insertPv(articleId)
  ])
  .then(function(result){
    console.log(result);
    const article=result[0];
    const comments=result[1];
    if(!article){
      throw new Error('文章不存在');
    }
    res.render('article',{
      article:article,
      comments:comments
    });
  })
  .catch(next);
})

// GET 更新文章页
router.get('/:articleId/edit', checkLogin, function (req, res, next) {
  const articleId=req.params.articleId;
  console.log(articleId);
  const author=req.session.user._id;
  postmodel.getRawArticleById(articleId)
  .then(function(article){
    if(!article){
      throw new Error('文章不存在');
    }
    if(author.toString()!==article.author._id.toString()){
      throw new Error('只能修改本人文章');
    }
    res.render('edit',{article:article});
  })
  .catch(next);
})

// POST 更新一篇文章
router.post('/:articleId/edit', checkLogin, function (req, res, next) {
  
  const author=req.session.user._id;
  const title=req.fields.title;
  const content=req.fields.content;
  try{
    if(!title.length){
      throw new Error('标题不能为空');
    }
    if(!content.length){
      throw new Error('内容不能为空');
    }
  }catch(e){
    req.flash('error',e.message);
    return res.redirect('back');
  }
  const articleId=req.params.articleId;
  postmodel.getRawArticleById(articleId)
  .then(function(article){
    console.log(article);
    if(!article){
      throw new Error('文章不存在');
    }
    if(article.author._id.toString()!==author.toString()){
      throw new Error('只能修改本人文章');
    }
    postmodel.updateArticleById(articleId,{title:title,content:content})
    .then(function(){
      req.flash('success','修改成功');
      console.log();
      res.redirect(`/articles/${articleId}`);
    })
    .catch(next);
  });


})

// GET 删除一篇文章
router.get('/:articleId/delete', checkLogin, function (req, res, next) {
  const articleId=req.params.articleId;
  const author=req.session.user._id;
  postmodel.getRawArticleById(articleId)
  .then(function(article){
    if(!article){
      throw new Error('文章不存在');
    }
    if(article.author._id.toString()!==author.toString())
      throw new Error('只能删除自己的文章');
    postmodel.delArticleById(articleId)
    .then(function(){
      req.flash('success','删除成功');
      res.redirect('/articles');
    })
    .catch(next);
  })
})

module.exports = router