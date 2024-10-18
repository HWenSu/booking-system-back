//route/template.js      檢查欄位
//const express = require('express')
//const router = express.Router()
const { Router } = require('express')
const router = Router()
const { templateService } = require('../services')

// 取得所有模板資料
router.get('/', async (req, res) => {
  try {
    const company = req.company
    const templates = await templateService.getAllTemplate(company) 
    res.json(templates) 
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router