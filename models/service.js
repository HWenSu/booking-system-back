//model 做數據管理
//引入fs模塊，用於文件讀寫操作
const fs = require('fs')
//引入 path 模塊，用於處理和轉換文件路徑。
const path = require('path')
const filePath = path.join('data/service.json')

class ServiceModel {
  constructor() {
    this.services = []
    this.init()
  }

  async init() {
    try {
      this.services = await this.read()
      this.serviceId = this.createId()
    } catch (err) {
      console.error('無法初始化:', err)
    }
  }

  create(newService) {
    return new Promise((resolve, reject) => {
      try {
        const categories = ["A","B","C"]
        const defaultCategory = "A"

        newService.category = categories.includes(newService.category)
          ? newService.category
          : defaultCategory
        newService.id = this.serviceId + 1
        const orderedService = {
          id: newService.id,
          name: newService.name,
          category: newService.category,
          price: newService.price,
          duration: newService.duration,
          description: newService.description,
          img: newService.img
        }
        this.services.push(orderedService)
        this.write(this.services)
          .then(() => resolve(orderedService))
          .catch((err) => reject(err))
      } catch (err) {
        reject(err)
      }
    })
  }

  write(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  createId() {
    let newId = 0
    if (this.services.length === 0) {
    } else {
      for (let i = 0; i < this.services.length; i++) {
        if (this.services[i].id > newId) {
          newId = this.services[i].id
        }
      }
    }
    return newId
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const services = JSON.parse(data)
          const deepCopy = JSON.parse(JSON.stringify(services)) // 深度複製
          resolve(deepCopy)
        }
      })
    })
  }
  getById(id) {
    return new Promise((resolve, reject) => {
      try {
        const service = this.services.find((a) => a.id === id)
        if (service) {
          const clonedService = JSON.parse(JSON.stringify(service))
          resolve(clonedService)
        } else {
          reject(`查無此服務`)
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  update(id, serviceData) {
    return new Promise((resolve, reject) => {
      this.getById(id).then((service) => {
        //直接使用重複的
        // 檢查是否存在要更新的字段，進行部分更新
        if (serviceData.name) {
          service.name = serviceData.name
        }
        if (serviceData.price) {
          service.price = serviceData.price
        }
        if (serviceData.duration) {
          service.description = serviceData.description
        }
        if (serviceData.description) {
          service.description = serviceData.description
        }
        if (serviceData.image) {
          service.image = serviceData.image
        }
        let serviceIndex = this.services.findIndex((a) => a.id === id)
        this.services[serviceIndex] = service
        // 將更新後的文章列表寫入文件
        this.write(this.services)
          .then(() => {
            resolve(this.services[serviceIndex]) // 返回更新後的文章數據
          })
          .catch((err) => {
            // 處理寫入錯誤
            reject(err)
          })
      })
    })
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.getById(id).then((service) => {
        let serviceIndex = this.services.findIndex((a) => a.id === id)
        this.services.splice(serviceIndex, 1)
        this.write(this.services)
          .then(() => resolve({ msg: `已把 ${id} 刪除成功` }))
          .catch((err) => reject(err))
      })
    })
  }
}

const serviceModel = new ServiceModel()

module.exports = serviceModel