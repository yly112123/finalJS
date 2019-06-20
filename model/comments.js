const marked=require('marked');
const Comment=require('../db/mongo').Comment;
Comment.plugin('contentToHtml',{
    afterFind:function(comments){
        return comments.map(function(comment){
            comment.comcontent=marked(comment.comcontent);
            return comment;
        })
    }
});
module.exports={
    create:function create(comment){
        return Comment.create(comment).exec();
    },
    getComments:function getComments(articleId){
        return Comment
        .find({articleId:articleId})
        .populate({path:'author',model:'User'})
        .sort({_id:1})
        .addCreatedAt()
        .contentToHtml()
        .exec();
    },
    getCommentsnum: function getCommentsnum (articleId) {
        return Comment.count({ articleId: articleId }).exec()
    },
    getCommentById:function getCommentById(commentId){
        return Comment.findOne({_id:commentId}).exec();
    },
    delCommentById:function delCommentById(commentId){
        return Comment.deleteOne({_id:commentId}).exec();
    },
    delCommentByArtId:function delCommentByArtId(articleId){
        return Comment.deleteMany({articleId:articleId}).exec();
    }

}