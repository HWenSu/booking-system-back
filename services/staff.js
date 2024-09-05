//service 做資料正確的判斷
//顯示錯誤的訊息做分類
const {staffModel} = require('../models')
const path = require('path')

class StaffService {
  //直接讀取陣列裡面全部的資料就好 不用全部重讀一遍read
  async getAllStaff() {
    return staffModel.staffs
  }

  async getStaffById(id) {
    return staffModel.getById(id)
  }

  async createStaff(staffData, file) {
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
    await staffModel.getById(id).catch((error) => {
      //return 404 msg 沒ID 的文章
      throw new Error(`查無此服務`)
    })
    // 執行更新操作
    return staffModel.update(id, staffData)
  }

  //刪除前確認文章是否存在
  async deleteStaff(id) {
    await staffModel.getById(id).catch((error) => {
      throw new Error(`查無此服務`)
    })
    return staffModel.delete(id)
  }
}

const staffService = new StaffService()

module.exports = staffService
