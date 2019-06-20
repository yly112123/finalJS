const User=require('../db/mongo').User;
module.exports={
  //注册用户
  create:function create(user){
    const time=new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString();
    user.time=time;
    return User.create(user).exec();
  },
  // 通过用户名获取用户信息
  getUserByName: function getUserByName (name) {
    // return User.findOne({ name: name }).addCreatedAt().exec()
    return User.findOne({ name: name }).exec();
  },
  // 按分数降序
  getUsers: function getUsers() {
    return User
      .find()
      .sort({ score: -1 })
      .exec();
  },
  // 通过userid 更新score
  updateScoreById: function updateScoreById (userId, data) {
    return User.update({ _id: userId }, { $set: data }).exec();
  },
  // 是否已登录
  getUsersbystate: function getUsersbystate(state) {
    return User
      .find({state:state})
      .exec();
  },
  updateStateById:function updateStateById(userId,data){
    return User.update({ _id: userId }, { $set: data }).exec();
  }

}
