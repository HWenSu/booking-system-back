//service 做資料正確的判斷
//顯示錯誤的訊息做分類
const { staffModel, certificateModel } = require('../models')

class StaffService {
  async getAllStaff() {
    const staffList = await staffModel.findAll({
      include: [
        {
          model: certificateModel, // 關聯
          attributes: ['name', 'category'], // 只返回需要的欄位
          through: {
            attributes: [] //不拿中介表的資料
          }
        }
      ]
    })

    const genderConvert = {
      0: '男',
      1: '女',
      2: '其他',
      3: '不想說'
    }

    return staffList.map((staff) => ({
      id: staff.id,
      name: staff.name,
      company: staff.company,
      gender: genderConvert[staff.gender],
      img: staff.img,
      expertise: staff.expertise,
      certificates: staff.certificateModels.map(({ name, category }) => ({
        name,
        category
      }))
    }))
  }

  async getStaffById(id) {
    const staff = await staffModel.findByPk(id, {
      include: [
        {
          model: certificateModel, // 關聯
          attributes: ['name', 'category'], // 只返回需要的欄位
          through: {
            attributes: [] //不拿中介表的資料
          }
        }
      ]
    })

    const genderConvert = {
      0: '男',
      1: '女',
      2: '其他',
      3: '不想說'
    }

    if (!staff) {
      throw new Error('查無此員工')
    }

    return {
      name: staff.name,
      company: staff.company,
      gender: genderConvert[staff.gender],
      img: staff.img,
      expertise: staff.expertise,
      certificates: staff.certificateModels.map(({ name, category }) => ({
        name,
        category
      }))
    }
  }

  async createStaff(staffData, file) {
    const gender = [0, 1, 2, 3]
    const defaultGender = '2'

    staffData.gender = gender.includes(staffData.gender)
      ? staffData.gender
      : defaultGender

    let imagePath = ''
    if (file !== undefined) {
      //config js
      imagePath = `http://localhost:5000/images/staff/${file.originalname}`
    }
    const newStaffData = {
      ...staffData,
      img: imagePath
    }
    return staffModel.create(newStaffData)
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

  //刪除前確認文章是否存在
  async deleteStaff(id) {
    const staff = await staffModel.findByPk(id)
    if (!staff) {
      throw new Error(`查無此員工`)
    }
    return staff.destroy()
  }
}

const staffService = new StaffService()

module.exports = staffService
