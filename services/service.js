//service 做資料正確的判斷
//顯示錯誤的訊息做分類
const {serviceModel} = require('../models')
const path = require('path')

class ServiceService {
  //直接讀取陣列裡面全部的資料就好 不用全部重讀一遍read
  async getAllService() {
    return serviceModel.services
  }

  async getServiceById(id) {
    return serviceModel.getById(id)
  }

  async createService(serviceData, file) {
    let imagePath = ''
    if (file !== undefined) {
      //config js
      imagePath = `http://localhost:5000/images/service/${file.originalname}`
    }
    const newServiceData = {
      ...serviceData,
      img: imagePath
    }
    return serviceModel.create(newServiceData)
  }


  //如果進來的ID是負數或是英文 這裡擋掉  //這裡返回到promise
  async updateService(id, serviceData) {
    await serviceModel.getById(id).catch((error) => {
      //return 404 msg 沒ID 的文章
      throw new Error(`查無此服務`)
    })
    // 執行更新操作
    return serviceModel.update(id, serviceData)
  }

  //刪除前確認文章是否存在
  async deleteService(id) {
    await serviceModel.getById(id).catch((error) => {
      throw new Error(`查無此服務`)
    })
    return serviceModel.delete(id)
  }
}

const serviceService = new ServiceService()

module.exports = serviceService

