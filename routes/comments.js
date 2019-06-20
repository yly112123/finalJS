const express = require('express')
const router = express.Router()
const commentmodel=require('../model/comments');
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments 创建一条留言
router.post('/', checkLogin, function (req, res, next) {
  const author = req.session.user._id;
  const articleId = req.fields.articleId;
  const content = req.fields.content;
  try {
    if (!content.length) {
      throw new Error('留言内容不为空');
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }
  let comment = {
    author: author,
    articleId: articleId,
    comcontent: content
  }
  commentmodel.create(comment)
    .then(function () {
      req.flash('success', '留言成功')
      // 留言成功后跳转到上一页
      res.redirect('back')
    })
    .catch(next)
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/delete', checkLogin, function (req, res, next) {
  const commentId = req.params.commentId
  const author = req.session.user._id

  commentmodel.getCommentById(commentId)
    .then(function (comment) {
      if (!comment) {
        throw new Error('留言不存在')
      }
      if (comment.author.toString() !== author.toString()) {
        throw new Error('没有权限删除留言')
      }
      commentmodel.delCommentById(commentId)
        .then(function () {
          req.flash('success', '删除留言成功')
          // 删除成功后跳转到上一页
          res.redirect('back')
        })
        .catch(next)
    })
})

module.exports = router