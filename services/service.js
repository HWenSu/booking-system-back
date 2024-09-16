//service 做資料正確的判斷
//顯示錯誤的訊息做分類
const { serviceModel } = require('../models')

class ServiceService {
  async getAllService() {
    return serviceModel.findAll()
  }

  async getServiceById(id) {
    const service = await serviceModel.findByPk(id)
    if (!service) {
      throw new Error('查無此服務')
    }
    return service
  }

  async createService(serviceData, file) {
    const categories = ['A', 'B', 'C']
    const defaultCategory = 'A'

    certificateData.category = categories.includes(certificateData.category)
      ? certificateData.category
      : defaultCategory

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
    const service = await serviceModel.findByPk(id)
    if (!service) {
      throw new Error(`查無此服務`)
    }
    // 執行更新操作
    return service.update(serviceData)
  }

  //刪除前確認文章是否存在
  async deleteService(id) {
    const service = await serviceModel.findByPk(id)
    if (!service) {
      throw new Error(`查無此員工`)
    }
    return service.destroy()
  }
}
const serviceService = new ServiceService()

module.exports = serviceService
