module.exports = {
  port: 80,
  session: {
    secret: 'TCblog',
    key: 'TCblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/TCblog'
}