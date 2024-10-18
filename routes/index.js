//引用
//const express = require('express')
//const Router = express.Router
// = const { Router } = require('express')

//const express = require('express')
//const router = express.Router()
const { Router } = require('express')
//建立根路由
const router = Router()

// 處理 GET localhost:[PORT] 的請求(註：localhost:[PORT] 和 localhost:[PORT]/ 是等價的，結尾有無 / 都一樣)
// req: 前端發送來的請求物件
// res: 回傳給前端的回應物件，可以透過 send 回傳字串，或透過 json 回傳 json 格式數據。
router.get('/', (req, res) => {
  // 以字串形式返回
  res.status(200).send('This is massage service.')

  // res 的 status 設置 HTTP 回應碼，若沒設置，預設為 200
  // res.send('This is backend of Calculator.')
})

// const service = require('./service')
// router.use('/service', service)

// 這裡提取公司名稱，並將它作為參數傳遞給各個子路由
router.use(
  '/:company/service',
  (req, res, next) => {
    req.company = req.params.company
    next()
  },
  require('./service')
)

router.use(
  '/:company/staff',
  (req, res, next) => {
    req.company = req.params.company
    next()
  },
  require('./staff')
)

router.use(
  '/:company/certificate',
  (req, res, next) => {
    req.company = req.params.company
    next()
  },
  require('./certificate')
)

router.use(
  '/:company/order',
  (req, res, next) => {
    req.company = req.params.company
    next()
  },
  require('./order')
)

router.use(
  '/:company/template',
  (req, res, next) => {
    req.company = req.params.company
    next()
  },
  require('./template')
)

module.exports = router
