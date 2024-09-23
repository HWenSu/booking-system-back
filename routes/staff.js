//route      檢查欄位
//const express = require('express')
//const router = express.Router()
const { Router } = require('express')
const router = Router()
const { staffService } = require('../services')
const upload = require('../util/upload')
const uploadFile = upload('images/staff').single('img')
//調用util

//路由這邊檢查參數，有無參數跟參數是否在合理範圍內
// http return 400是用戶端錯誤 500是伺服器端錯誤
// 獲取所有服務
router.get('/', async (req, res) => {
  try {
    const company = req.company
    const staffs = await staffService.getAllStaff(company)
    res.json(staffs)
  } catch (err) {
    res.status(500).json({ error: '訊息錯誤' })
  }
})

// 獲取一項服務
router.get('/:id', async (req, res) => {
  try {
    //寫條件判斷是否為數字
    const staffNumber = Number(req.params.id)
    const company = req.company
    const staff = await staffService.getStaffById(staffNumber, company)
    if (staff) {
      res.json(staff)
    }
  } catch (err) {
    //後面的錯誤返回物件跟code
    //沒ID或是回傳不是數字的內容
    res.status(404).json({ error: err })
  }
})

// 創建服務   //staffService.upload(依照不同的路徑給參數).single('img') 變成一個變數
router.post('/', uploadFile, async (req, res) => {
  try {
    const { name, expertise } = req.body
    const company = req.company
    // 以下分別做檢查
    if (!name) {
      return res.status(400).json({ error: '請輸入name' })
    }
    if (!expertise) {
      return res.status(400).json({ error: '請輸入expertise' })
    }
    const newStaff = await staffService.createStaff(
      { ...req.body, company },
      req.file
    )
    res.status(201).json(newStaff)
  } catch (err) {
    res.status(500).json({ error: err.message || '訊息錯誤' })
  }
})

// 更新服務
router.put('/:id', async (req, res) => {
  try {
    const { name, img, expertise } = req.body
    if (!name && !img && !expertise) {
      return res
        .status(400)
        .json({ error: '要更改name、img或是expertise其中一項' })
    }
    const updatedStaff = await staffService.updateStaff(
      Number(req.params.id),
      req.body
    )
    res.json(updatedStaff)
  } catch (err) {
    //err.code 400 500 try catch處理沒預期的錯誤 例如沒預期abc 沒有特地弄abc的錯誤內容
    res.status(400).json({ error: err.staff })
  }
})

// 刪除服務
router.delete('/:id', async (req, res) => {
  try {
    await staffService.deleteStaff(Number(req.params.id))
    res.status(204).json({ msg: 'success' })
  } catch (err) {
    res.status(400).json({ error: err.staff })
  }
})

module.exports = router
