//route/staff.js      檢查欄位
//const express = require('express')
//const router = express.Router()
const { Router } = require('express')
const router = Router()
const { staffService } = require('../services')
const upload = require('../util/upload')()
const uploadBuffer = upload.single('img')
//調用util

//路由這邊檢查參數，有無參數跟參數是否在合理範圍內
// http return 400是用戶端錯誤 500是伺服器端錯誤
// 取得所有員工
router.get('/', async (req, res) => {
  try {
    const company = req.company
    const staffs = await staffService.getAllStaff(company)
    res.json(staffs)
  } catch (err) {
    res.status(500).json({ error: '訊息錯誤' })
  }
})

// 取得一位員工
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

// 新增員工   
router.post('/', async (req, res) => {
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


// 批量增加員工的證照
router.post('/:id/certificates', async (req, res) => {
  try {
    const staffId = Number(req.params.id)
    const certificateIds = req.body.certificateIds

    // 檢查是否提供證照ID列表
    if (!Array.isArray(certificateIds) || certificateIds.length === 0) {
      return res.status(400).json({ error: '請提供有效的證照ID列表' })
    }

    const result = await staffService.addCertificatesToStaff(staffId, certificateIds)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message || '添加證照時發生錯誤' })
  }
})

// 批量刪除員工的證照
router.delete('/:id/certificates', async (req, res) => {
  try {
    const staffId = Number(req.params.id);
    const { certificateIds } = req.body;

    if (!Array.isArray(certificateIds) || certificateIds.length === 0) {
      return res.status(400).json({ error: '請提供有效的證照ID列表' });
    }

    const result = await staffService.removeCertificatesFromStaff(staffId, certificateIds);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// 更新員工
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

// 刪除員工
router.delete('/:id', async (req, res) => {
  try {
    await staffService.deleteStaff(Number(req.params.id))
    res.status(204).json({ msg: 'success' })
  } catch (err) {
    res.status(400).json({ error: err.staff })
  }
})

//新增圖片
router.post('/image', uploadBuffer, async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      return res.status(400).json({ error: '請輸入id' })
    }
    const newImage = await staffService.createImage(req.body, req.file)
    res.status(201).json(newImage)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/image/:id', async (req, res) => {
  try {
    const image = await staffService.getImageById(req.params.id)
    res.send(`<img src="${image}" alt="Image" />`)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

router.delete('/image/:id', async (req, res) => {
  try {
    const message = await staffService.deleteImageById(req.params.id)
    res.json(message)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

module.exports = router
