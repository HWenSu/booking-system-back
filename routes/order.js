//route      檢查欄位
//const express = require('express')
//const router = express.Router()
const { Router } = require('express')
const router = Router()
const { orderService } = require('../services')
const path = require('path')

//路由這邊檢查參數，有無參數跟參數是否在合理範圍內
// http return 400是用戶端錯誤 500是伺服器端錯誤
// 獲取所有服務
router.get('/', async (req, res) => {
  try {
    const orders = await orderService.getAllOrder()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: '訊息錯誤' })
  }
})

// 創建服務
router.post('/', async (req, res) => {
  try {
    const { serviceId, start, name, phone, email } = req.body
    //以下分別做檢查
    if (!serviceId) {
      return res.status(400).json({ error: '請輸入serviceId' })
    }
    if (!start) {
      return res.status(400).json({ error: '請輸入start' })
    }
    if (!name) {
      return res.status(400).json({ error: '請輸入name' })
    }
    if (
      !phone ||
      phone.length !== 10 
    ) {
      return res.status(400).json({ error: '請輸入phone並且輸入正確格式' })
    }

    if (!email || orderService.checkEmail(email)) {
      return res.status(400).json({ error: '請輸入email，並且輸入正確格式' })
    }
    const newOrder = await orderService.createOrder(req.body)

    try{
      await orderService.sendEmail(email, name, start)
      res.status(201).json(newOrder)
    }catch(emailErr){
      res.status(500).json({ error: '訂單創建成功，但郵件發送失敗' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message || '訊息錯誤' })
  }
})

// 更新服務
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: '要更改name或是category其中一項' })
    }
    const updatedOrder = await orderService.updateOrder(
      Number(req.params.id),
      req.body
    )
    res.json(updatedOrder)
  } catch (err) {
    //err.code 400 500 try catch處理沒預期的錯誤 例如沒預期abc 沒有特地弄abc的錯誤內容
    res.status(400).json({ error: err.order })
  }
})

// 刪除服務
router.delete('/:id', async (req, res) => {
  try {
    await orderService.deleteOrder(Number(req.params.id))
    res.status(204).json({ msg: 'success' })
  } catch (err) {
    res.status(400).json({ error: err.order })
  }
})

module.exports = router
