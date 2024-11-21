//service/service.js 做資料正確的判斷
//顯示錯誤的訊息做分類
const { serviceModel, massageImageModel } = require('../models')
const sharp = require('sharp')

class ServiceService {
  async getAllService() {
    const services = await serviceModel.findAll({
      include: [
        {
          model: massageImageModel
        }
      ]
    })

    // 處理圖片並展平結構
    return services.map((service) => {
      const serviceData = service.toJSON()
      const imageData = serviceData.massageImageModel
        ? `data:image/png;base64,${Buffer.from(
            serviceData.massageImageModel.img
          ).toString('base64')}`
        : null

      return {
        ...serviceData,
        img: imageData,
        massageImageModel: undefined // 移除不需要的嵌套字段
      }
    })
  }

  async getServiceById(id) {
    const service = await serviceModel.findByPk(id, {
      include: [
        {
          model: massageImageModel
        }
      ]
    })

    if (!service) {
      throw new Error('查無此服務')
    }
    // 將圖片轉換為 Base64 格式返回
    const serviceData = service.toJSON()
    const imageData = serviceData.massageImageModel?.img
      ? `data:image/png;base64,${Buffer.from(
          serviceData.massageImageModel.img
        ).toString('base64')}`
      : null

    return {
      ...serviceData,
      img: imageData,
      massageImageModel: undefined // 移除嵌套字段
    }
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

  async createService(serviceData) {
    const categories = ['A', 'B', 'C']
    const defaultCategory = 'A'

    serviceData.category = categories.includes(serviceData.category)
      ? serviceData.category
      : defaultCategory

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
        massage_id: massageId
      }
      const newService = await serviceModel.create(newServiceData)
      services.push(newService)
    }

    return services
  }

  //如果進來的ID是負數或是英文 這裡擋掉  //這裡返回到promise
  async updateService(id, serviceData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('無效的 ID')
    }
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

  async createImage(massageId, file) {
    if (!massageId) {
      throw new Error('請提供 massage_id')
    }

    if (!file) {
      console.log('未收到圖片文件', file) // 調試輸出
      throw new Error('請提供圖片')
    }

    // 確保 massageId 是正確的數值
    const validMassageId = massageId.id ? massageId.id : massageId

    // 檢查 massage_id 是否存在於 serviceModel
    const existingService = await serviceModel.findOne({
      where: { massage_id: validMassageId }
    })

    if (!existingService) {
      throw new Error('無效的 massage_id，請先創建對應的服務')
    }

    // 檢查圖片是否已經與該 massage_id 綁定
    const existingImage = await massageImageModel.findByPk(validMassageId)
    if (existingImage) {
      throw new Error('該 massage_id 已經有關聯的圖片，無法重複綁定')
    }

    const imageBuffer = await sharp(file.buffer)
      .resize({ width: 800 }) // 設定最大寬度為 800 像素
      .toFormat('jpeg') // 將圖片轉換為 JPEG 格式
      .toBuffer() // 將結果轉為二進制緩衝區

    const newImage = await massageImageModel.create({
      id: validMassageId, // 將 massage_id 作為圖片的主鍵
      img: imageBuffer
    })

    return newImage
  }

  async getImageByMassageId(id) {
    if (!id) {
      throw new Error('請提供 massage_id')
    }

    const image = await massageImageModel.findByPk(id)
    if (!image) {
      throw new Error('找不到對應的圖片')
    }

    return `data:image/jpeg;base64,${image.img.toString('base64')}`
  }

  async deleteImageById(id) {
    const image = await massageImageModel.findByPk(id)
    if (!image) {
      throw new Error('找不到圖片')
    }

    await image.destroy()
    return { message: '圖片已刪除' }
  }
}
const serviceService = new ServiceService()

module.exports = serviceService
