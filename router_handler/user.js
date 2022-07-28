// 导入db数据库
const db = require('../db/index')
// 导入bcryptjs这个包
const bcrypt = require('bcryptjs')
// 导入生成Token包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')
// 注册新用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息

  // 接收表单数据信息
  const userinfo = req.body
  // 判断数据是否合法
  // if (!userinfo.username || !userinfo.password) {
  //   return res.send({ status: 1, message: '用户名或密码不能为空！' })
  // }

  // 定义sql语句，查询用户名是否被占用
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, userinfo.username, (err, result) => {
    // 执行sql语句失败
    // if (err) { return res.send({ status: 1, message: err.message }) }
    if (err) {
      return res.cc(err)
    }

    // 判断用户名是否被占用
    if (result.length > 0) {
      // return res.send({
      //   status: 1,
      //   message: '用户名被占用，请更换其他用户名！'
      // })
      return res.cc('用户名被占用，请更换其他用户名！')
    }
  })
  // TODO:用户名可用，后面继续可以写
  // 调用bcrypt.hashSync()对密码进行加密
  userinfo.password = bcrypt.hashSync(userinfo.password, 10)

  // 定义插入新用户的SQL语句
  const sql = 'insert into ev_users set ?'
  // 调用db.query()执行SQL语句
  db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, result) => {
    // 判断sql语句是否执行成功
    if (err) {
      return res.cc(err)
    }
    // 判断影响行数是否为1
    if (result.affectedRows !== 1) {
      // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
      return res.cc('注册用户失败，请稍后再试！')
    }
    // 注册用户成功
    // res.send({ status: 0, message: '注册成功！' })
    res.cc('注册成功！',0)
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单的数据
  const userinfo = req.body
  // 定义sql语句
  const sql = `select * from ev_users where username=?`
  db.query(sql,userinfo.username,(err, results)=>{
    // 执行sql语句失败
    if(err) return res.cc(err)
    // 执行sql语句成功，但是获取到的数据条数不等于1
    if(results.length !== 1) return res.cc('登录失败！')
    // TODO:判断密码是否正确
   const comparseResults = bcrypt.compareSync(userinfo.password, results[0].password)
   if(!comparseResults) return res.cc('登录失败！'+err)

  //  TODO: 在服务器端生成Token的字符串
  const user = {...results[0],password:'',user_pic:''}

  // 对用户的信息进行加密，生成Token字符串
  const tokenStr = jwt.sign(user,config.jwtSecreKey, {expiresIn: config.expiresIn})

  // 调用res.send() 将Token响应给客户端
  res.send({
    status:0,
    message:'登录成功!',
    token:'Bearer '+tokenStr
  })
  })
}