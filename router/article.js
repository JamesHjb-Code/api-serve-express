// 文章的路由模块
const express = require('express')
const router = express.Router()

// 导入并使用文章处理函数
const article_handler = require('../router_handler/article')
// 发布文章的路由
router.post('/add',article_handler.addArticle)

module.exports = router