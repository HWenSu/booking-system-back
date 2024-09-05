//route      檢查欄位
//const express = require('express')
//const router = express.Router()
const { Router } = require('express')
const router = Router()
const { certificateService } = require('../services')
const path = require('path')


//路由這邊檢查參數，有無參數跟參數是否在合理範圍內
// http return 400是用戶端錯誤 500是伺服器端錯誤
// 獲取所有服務
router.get('/', async (req, res) => {
  try {
    const certificates = await certificateService.getAllCertificate()
    res.json(certificates)
  } catch (err) {
    res.status(500).json({ error: '訊息錯誤' })
  }
})


// 創建服務   //certificateService.upload(依照不同的路徑給參數).single('img') 變成一個變數
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    // 以下分別做檢查
    if (!name) {
      return res.status(400).json({ error: '請輸入name' })
    }
    const newCertificate = await certificateService.createCertificate(req.body)
    res.status(201).json(newCertificate)
  } catch (err) {
    res.status(500).json({ error: err.message || '訊息錯誤' })
  }
})

// 更新服務
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body
    if (!name ) {
      return res.status(400).json({ error: '要更改name或是category其中一項' })
    }
    const updatedCertificate = await certificateService.updateCertificate(
      Number(req.params.id),
      req.body
    )
    res.json(updatedCertificate)
  } catch (err) {
    //err.code 400 500 try catch處理沒預期的錯誤 例如沒預期abc 沒有特地弄abc的錯誤內容
    res.status(400).json({ error: err.certificate })
  }
})

// 刪除服務
router.delete('/:id', async (req, res) => {
  try {
    await certificateService.deleteCertificate(Number(req.params.id))
    res.status(204).json({ msg: 'success' })
  } catch (err) {
    res.status(400).json({ error: err.certificate })
  }
})

module.exports = router
