const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass('mongodb://localhost:27017/TCblog')
mongolass.connect(config.mongodb)

exports.User = mongolass.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  score:{type:'number',default: 0},
  time:{type:'string',required: true},
  state:{type:'number',default: 1}
});

exports.User.index({ name: 1 }, { unique: true }).exec()// 根据用户名找到用户，用户名全局唯一

const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results;
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result;
  }
})

exports.Article=mongolass.model('Article',{
  author:{type:Mongolass.Types.ObjectId,required: true},
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  pv: { type: 'number', default: 0 }
})
exports.Article.index({author:1,_id:-1}).exec()

exports.Comment=mongolass.model('Comment',{
  author:{type:Mongolass.Types.ObjectId,required:true},
  comcontent:{type:'string',required:true},
  articleId:{type:Mongolass.Types.ObjectId,required:true}
})
exports.Comment.index({articleId:1,_id:1}).exec()

