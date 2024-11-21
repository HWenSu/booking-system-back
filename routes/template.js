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

router.post('/', async (req, res) => {
  try {
    const { company_id, type, dataModels } = req.body
    const newTemplate = await templateService.createTemplate(
      { company_id, type },
      dataModels
    )
    res.status(201).json(newTemplate)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:templateId', async (req, res) => {
  try {
    const templateId = req.params.templateId
    const { type, dataModels } = req.body
    const updatedTemplate = await templateService.updateTemplate(
      templateId,
      { type },
      dataModels
    )
    res.json(updatedTemplate)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 刪除模板資料 (Delete)
router.delete('/:templateId', async (req, res) => {
  try {
    const templateId = req.params.templateId
    const result = await templateService.deleteTemplate(templateId)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


module.exports = router