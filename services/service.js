//service/service.js 做資料正確的判斷
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

  async getMassageId(name) {
    // 檢查資料庫中是否已經存在這個名稱的服務
    const existingService = await serviceModel.findOne({
      where: { name },
      order: [['massage_id', 'DESC']] // 按照 massage_id 降序排列
    })

    if (existingService) {
      // 如果存在，返回現有的 massage_id
      return existingService.massage_id
    } else {
      // 如果沒有找到相同名稱的服務，為新類別分配一個新的 massage_id
      const lastService = await serviceModel.findOne({
        order: [['massage_id', 'DESC']] // 找到最新的 massage_id
      })
      const newMassageId = lastService ? lastService.massage_id + 1 : 1
      return newMassageId
    }
  }

  async createService(serviceData, file) {
    const categories = ['A', 'B', 'C']
    const defaultCategory = 'A'

    serviceData.category = categories.includes(serviceData.category)
      ? serviceData.category
      : defaultCategory

    let imagePath = ''
    if (file !== undefined) {
      //config js
      imagePath = `http://localhost:5000/images/service/${file.originalname}`
    }

    const { name, price, duration } = serviceData

    const massageId = await this.getMassageId(name)

    if (
      !Array.isArray(price) ||
      !Array.isArray(duration) ||
      price.length !== duration.length
    ) {
      throw new Error('請確認每個price都有對應每個duration')
    }

    const services = []
    for (let i = 0; i < price.length; i++) {
      const newServiceData = {
        ...serviceData,
        price: price[i],
        duration: duration[i],
        img: imagePath,
        massage_id:massageId
      }
      const newService = await serviceModel.create(newServiceData)
      services.push(newService)
    }

    return services
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

  //刪除前確認服務是否存在
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
