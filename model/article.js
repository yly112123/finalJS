const marked = require('marked');
const Article=require('../db/mongo').Article;
const commentmodel=require('./comments');

// article 添加留言数
Article.plugin('addCommentsnum', {
    afterFind: function (articles) {
      return Promise.all(articles.map(function (article) {
        return commentmodel.getCommentsnum(article._id).then(function (commentsnum) {
          article.commentsnum = commentsnum;
          return article;
        })
      }))
    },
    afterFindOne: function (article) {
      if (article) {
        return commentmodel.getCommentsnum(article._id)
        .then(function (num) {
            article.commentsnum = num;
          return article;
        })
      }
      return article;
    }
  })
// 将 article 的 content 从 markdown 转换成 html
Article.plugin('contentToHtml', {
    afterFind: function (articles) {
      return articles.map(function (article) {
        article.content = marked(article.content);
        return article;
      });
    },
    afterFindOne: function (article) {
      if (article) {
        article.content = marked(article.content);
      }
      return article;
    }
  });

module.exports={
  //新建文章
  create:function create(article){
    return Article.create(article).exec();
  },
  // 通过文章 id 获取一篇文章
  getArticleById: function getArticleById (artId) {
    return Article
      .findOne({ _id: artId })
      //path是 Article 表里 author 的字段，User 是 author 对应的数据表
      .populate({ path: 'author', model: 'User' })
      .addCreatedAt()
      .contentToHtml()
      .addCommentsnum()
      .exec();
  },

  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  getArticles: function getArticles (author) {
    const query = {};
    if (author) {
      query.author = author
    }
    return Article
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .contentToHtml()
      .addCommentsnum()
      .exec();
  },

  // 通过文章 id 给 pv 加 1
  insertPv: function insertPv (articleId) {
    return Article
      .update({ _id: articleId }, { $inc: { pv: 1 } })//inc 对pv+1
      .exec();
  },
  // 通过文章 id 获取一篇未Markdown的文章
  getRawArticleById: function getRawArticleById (articleId) {
    return Article
      .findOne({ _id: articleId })
      .populate({ path: 'author', model: 'User' })
      .exec();
  },
  
  // 通过文章 id 更新一篇文章
  updateArticleById: function updateArticleById (articleId, data) {
    return Article.update({ _id: articleId }, { $set: data }).exec();
  },
  
  // 通过文章 id 删除一篇文章
  delArticleById: function delArticleById (articleId) {
    return Article.deleteOne({_id: articleId })
    .exec()
    .then(function(res){
        if(res.result.ok&&res.result.n>0){
            return commentmodel.delCommentByArtId(articleId);
        }
    });
  }

}