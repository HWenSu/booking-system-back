//service/staff.js 做資料正確的判斷
//顯示錯誤的訊息做分類
const { staffModel, certificateModel, staffImageModel } = require('../models')
const sharp = require('sharp')

class StaffService {
  async getAllStaff(companyName) {
    const staffList = await staffModel.findAll({
      where: { company: companyName },
      include: [
        {
          model: certificateModel, // 關聯
          attributes: ['name', 'category'], // 只返回需要的欄位
          through: {
            attributes: [] //不拿中介表的資料
          }
        },
        {
          model: staffImageModel, // 關聯圖片
          attributes: ['img'] // 只需要圖片字段
        }
      ]
    })

    const genderConvert = {
      1: '女',
      2: '其他',
      3: '男'
    }

    return staffList.map((staff) => ({
      id: staff.id,
      name: staff.name,
      gender: genderConvert[staff.gender],
      expertise: staff.expertise,
      certificates: staff.certificateModels.map(({ name, category }) => ({
        name,
        category
      })),
      img: staff.staffImageModel // 圖片欄位
        ? `data:image/jpeg;base64,${staff.staffImageModel.img.toString(
            'base64'
          )}`
        : null // 若無圖片，返回 null
    }))
  }

  async getStaffById(id, companyName) {
    const staff = await staffModel.findOne({
      where: { id, company: companyName },
      include: [
        {
          model: certificateModel, // 關聯
          attributes: ['name', 'category'], // 只返回需要的欄位
          through: {
            attributes: [] //不拿中介表的資料
          }
        },
        {
          model: staffImageModel, // 關聯圖片
          attributes: ['img'] // 只需要圖片字段
        }
      ]
    })

    const genderConvert = {
      1: '女',
      2: '其他',
      3: '男'
    }

    if (!staff) {
      throw new Error('查無此員工')
    }

    return {
      name: staff.name,
      gender: genderConvert[staff.gender],
      expertise: staff.expertise,
      certificates: staff.certificateModels.map(({ name, category }) => ({
        name,
        category
      })),
      img: staff.staffImageModel // 圖片欄位
        ? `data:image/jpeg;base64,${staff.staffImageModel.img.toString(
            'base64'
          )}`
        : null // 若無圖片，返回 null
    }
  }

  async createStaff(staffData) {
    const gender = [0, 1, 2, 3]
    const defaultGender = '2'

    staffData.gender = gender.includes(staffData.gender)
      ? staffData.gender
      : defaultGender

    return staffModel.create(staffData)
  }

  async addCertificatesToStaff(staffId, certificateIds) {
    const staff = await staffModel.findByPk(staffId)
    if (!staff) {
      throw new Error('找不到該員工')
    }

    // 使用 getCertificateModels() 來獲取員工已有的證照
    const existingCertificates = await staff.getCertificateModels({
      where: { id: certificateIds }
    })

    const existingCertificateIds = existingCertificates.map((cert) => cert.id)
    const newCertificateIds = certificateIds.filter(
      (id) => !existingCertificateIds.includes(id)
    )

    if (newCertificateIds.length === 0) {
      throw new Error('所有證照已經存在，沒有新增任何證照')
    }

    const newCertificates = await certificateModel.findAll({
      where: { id: newCertificateIds }
    })

    if (newCertificates.length !== newCertificateIds.length) {
      const missingIds = newCertificateIds.filter(
        (id) => !newCertificates.some((cert) => cert.id === id)
      )
      throw new Error(`找不到以下證照ID: ${missingIds.join(', ')}`)
    }

    await staff.addCertificateModels(newCertificates) // 使用 addCertificateModels() 來新增
    return { message: '證照成功添加' }
  }

  async removeCertificatesFromStaff(staffId, certificateIds) {
    const staff = await staffModel.findByPk(staffId)
    if (!staff) {
      throw new Error('找不到該員工')
    }
    //使用 getCertificateModels() 來獲取員工現有的證照
    const existingCertificates = await staff.getCertificateModels({
      where: { id: certificateIds }
    })

    const existingCertificateIds = existingCertificates.map((cert) => cert.id)
    const missingCertificateIds = certificateIds.filter(
      (id) => !existingCertificateIds.includes(id)
    )

    if (missingCertificateIds.length > 0) {
      throw new Error(
        `以下證照ID不存在或是該員工未持有: ${missingCertificateIds.join(', ')}`
      )
    }

    await staff.removeCertificateModels(existingCertificates)
    return { message: '成功刪除指定的證照' }
  }

  //如果進來的ID是負數或是英文 這裡擋掉  //這裡返回到promise
  async updateStaff(id, staffData) {
    const staff = await staffModel.findByPk(id)
    if (!staff) {
      throw new Error(`查無此員工`)
    }
    // 執行更新操作
    return staff.update(staffData)
  }

  //刪除前確認員工是否存在
  async deleteStaff(id) {
    const staff = await staffModel.findByPk(id)
    if (!staff) {
      throw new Error(`查無此員工`)
    }
    return staff.destroy()
  }

  async createImage(id, file) {
    if (!id) {
      throw new Error('請提供 id')
    }

    if (!file) {
      console.log('未收到圖片文件', file) // 調試輸出
      throw new Error('請提供圖片')
    }

    // 確保 id 是正確的數值
    const validId = id.id ? id.id : id

    // 檢查 id 是否存在於 staffModel
    const existingStaff = await staffModel.findOne({
      where: { id: validId }
    })

    if (!existingStaff) {
      throw new Error('無效的 id，請先創建對應的員工')
    }

    // 檢查圖片是否已經與該 id 綁定
    const existingImage = await staffImageModel.findByPk(validId)
    if (existingImage) {
      throw new Error('該 id 已經有關聯的圖片，無法重複綁定')
    }

    const imageBuffer = await sharp(file.buffer)
      .resize({ width: 800 }) // 設定最大寬度為 800 像素
      .toFormat('jpeg') // 將圖片轉換為 JPEG 格式
      .toBuffer() // 將結果轉為二進制緩衝區

    const newImage = await staffImageModel.create({
      id: validId, // 將 massage_id 作為圖片的主鍵
      img: imageBuffer
    })

    return newImage
  }

  async getImageById(id) {
    if (!id) {
      throw new Error('請提供 id')
    }

    const image = await staffImageModel.findByPk(id)
    if (!image) {
      throw new Error('找不到對應的圖片')
    }

    return `data:image/jpeg;base64,${image.img.toString('base64')}`
  }

  async deleteImageById(id) {
    const image = await staffImageModel.findByPk(id)
    if (!image) {
      throw new Error('找不到圖片')
    }

    await image.destroy()
    return { message: '圖片已刪除' }
  }
}

const staffService = new StaffService()

module.exports = staffService
