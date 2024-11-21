//route/service.js      檢查欄位
//const express = require('express')
//const router = express.Router()
const { Router } = require('express')
const router = Router()
const { serviceService } = require('../services')
const upload = require('../util/upload')()
const uploadBuffer = upload.single('img')
//調用util

//路由這邊檢查參數，有無參數跟參數是否在合理範圍內
// http return 400是用戶端錯誤 500是伺服器端錯誤
// 獲取所有服務
router.get('/', async (req, res) => {
  try {
    const services = await serviceService.getAllService()
    res.json(services)
  } catch (err) {
    res.status(500).json({ error: '訊息錯誤' })
  }
})

// 獲取一項服務
router.get('/:id', async (req, res) => {
  try {
    //寫條件判斷是否為數字
    const serviceNumber = Number(req.params.id)
    const service = await serviceService.getServiceById(serviceNumber)
    if (service) {
      res.json(service)
    }
  } catch (err) {
    //後面的錯誤返回物件跟code
    //沒ID或是回傳不是數字的內容
    res.status(404).json({ error: err })
  }
})

// 創建服務  
router.post('/', async (req, res) => {
  try {
    const { name, price, duration, description } = req.body
    // 以下分別做檢查
    if (!name) {
      return res.status(400).json({ error: '請輸入name' })
    }
    if (
      !Array.isArray(price) ||
      price.some(
        (p) => isNaN(p) || !Number.isInteger(Number(p)) || Number(p) <= 0
      )
    ) {
      return res
        .status(400)
        .json({ error: '請輸入price的陣列,並且必須為有效的正整數' })
    }
    if (
      !Array.isArray(duration) ||
      duration.some(
        (d) => isNaN(d) || !Number.isInteger(Number(d)) || Number(d) <= 0
      )
    ) {
      return res
        .status(400)
        .json({ error: '請輸入duration的陣列,並且必須為有效的正整數' })
    }
    if (!description) {
      return res.status(400).json({ error: '請輸入description' })
    }
    const newService = await serviceService.createService(req.body)
    res.status(201).json(newService)
  } catch (err) {
    res.status(500).json({ error: err.message || '訊息錯誤' })
  }
})

// 更新服務
router.put('/:id', async (req, res) => {
  try {
    const { name, price, duration, description } = req.body
    if (!name && !price && !duration && !description) {
      return res
        .status(400)
        .json({ error: '要更改name、price、duration或是description其中一項' })
    }
    const updatedService = await serviceService.updateService(
      Number(req.params.id),
      req.body
    )
    res.json(updatedService)
  } catch (err) {
    //err.code 400 500 try catch處理沒預期的錯誤 例如沒預期abc 沒有特地弄abc的錯誤內容
    res.status(400).json({ error: err.service })
  }
})

// 刪除服務
router.delete('/:id', async (req, res) => {
  try {
    await serviceService.deleteService(Number(req.params.id))
    res.status(204).json({ msg: 'success' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

//新增圖片
router.post('/image', uploadBuffer, async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      return res.status(400).json({ error: '請輸入id' })
    }
    const newImage = await serviceService.createImage(req.body, req.file)
    res.status(201).json(newImage)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/image/:id', async (req, res) => {
  try {
    const image = await serviceService.getImageByMassageId(req.params.id)
    res.send(`<img src="${image}" alt="Image" />`)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

router.delete('/image/:id', async (req, res) => {
  try {
    const message = await serviceService.deleteImageById(req.params.id)
    res.json(message)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

module.exports = router


