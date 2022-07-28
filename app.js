// 导入express模块
const express = require('express')
// 创建express服务器
const app = express()

// 导入joi验证规则模块
const joi = require('joi')

// 导入并配置cors中间件,配置跨域
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件, 注意：这个中间件，只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({extended:false}))

// 一定要在路由之前，封装res.cc函数,中间件
app.use((req,res,next)=>{
  // status默认值为1，表示失败的情况
  // err的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1){
    res.send({
      status,
      message:err instanceof Error ? err.mesage : err,
    })
  }
  next()
})

// 一定要在路由之前配置解析Token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({secret:config.jwtSecreKey}).unless({path:[/^\/api/]}))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api',userRouter)
// 导入并使用个人信息路由模块
const userInfoRouter = require('./router/userinfo')
app.use('/my',userInfoRouter)
// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/artcate',artCateRouter)
// 导入并使用文章管理的路由模块
const articleRouter = require('./router/article')
app.use('/my/article',articleRouter)



// 定义错误级别的中间件
app.use((err, req, res, next)=>{
  // 验证失败导致的错误
  if(err instanceof joi.ValidationError) return res.cc(err.toString())
  // 身份认证失败后的错误
  if(err.name==='UnauthorizedError') return res.cc('身份认证失败！')
  // 未知的错误
  else res.cc(err.toString())
})
// 开启服务器
app.listen(3007,()=>{
  console.log('api server running at http://127.0.0.1:3007')
})

