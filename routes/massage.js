//route      檢查欄位
//const express = require('express')
//const router = express.Router()
const { Router } = require('express')
const router = Router()
const massageService = require('../services')


//路由這邊檢查參數，有無參數跟參數是否在合理範圍內
// http return 400是用戶端錯誤 500是伺服器端錯誤
// 獲取所有服務
router.get('/', async (req, res) => {
  try {
    const massages = await massageService.getAllMassage()
    res.json(massages)
  } catch (err) {
    res.status(500).json({ error: '訊息錯誤' })
  }
})

// 獲取一項服務
router.get('/:id', async (req, res) => {
  try {
    //寫條件判斷是否為數字
    const massageNumber = Number(req.params.id)
    const massage = await massageService.getMassageById(massageNumber)
    if (massage) {
      res.json(massage)
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
    const { name, price, description } = req.body
    // 檢查必要字段是否存在
    if (!name || !price || !description) {
      return res
        .status(400)
        .json({ error: 'name、price或是description全部都要有' })
    }
    const newMassage = await massageService.createMassage(req.body)
    res.status(201).json(newMassage)
  } catch (err) {
    res.status(500).json({ error: '訊息錯誤' })
  }
})

// 更新服務
router.put('/:id', async (req, res) => {
  try {
    const { name, price, description } = req.body
    if (!name && !price && !description ) {
      return res
        .status(400)
        .json({ error: '要更改name、price或是description其中一項' })
    }
    const updatedMassage = await massageService.updateMassage(
      Number(req.params.id),
      req.body
    )
    res.json(updatedMassage)
  } catch (err) {
    //err.code 400 500 try catch處理沒預期的錯誤 例如沒預期abc 沒有特地弄abc的錯誤內容
    res.status(400).json({ error: err.message })
  }
})

// 刪除服務
router.delete('/:id', async (req, res) => {
  try {
    await massageService.deleteMassage(Number(req.params.id))
    res.status(204).json({ msg: 'success' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
