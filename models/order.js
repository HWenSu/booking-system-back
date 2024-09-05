//model 做數據管理
//引入fs模塊，用於文件讀寫操作
const fs = require('fs')
//引入 path 模塊，用於處理和轉換文件路徑。
const path = require('path')
const filePath = path.join('data/order.json')

class OrderModel {
  constructor() {
    this.orders = []
    this.init()
  }

  async init() {
    try {
      this.orders = await this.read()
      this.orderId = this.createId()
    } catch (err) {
      console.error('無法初始化:', err)
    }
  }

  create(newOrder) {
    return new Promise((resolve, reject) => {
      try {
        const gender = ['男', '女', '其他', '不想說']
        const defaultGender = '不想說'

        newOrder.gender = gender.includes(newOrder.gender)
          ? newOrder.gender
          : defaultGender
        newOrder.id = this.orderId + 1

        //timestamp UTC+0 yyyy-mm-dd hh:mm date()
        Date.UTC
        const orderedOrder = {
          id: newOrder.id,
          serviceId: newOrder.serviceId,
          start: newOrder.start,
          end: newOrder.end,
          staff: newOrder.staff,
          name: newOrder.name,
          gender: newOrder.gender,
          phone: newOrder.phone,
          email: newOrder.email,
          remark: newOrder.remark
        }
        this.orders.push(orderedOrder)
        this.write(this.orders)
          .then(() => resolve(orderedOrder))
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
    if (this.orders.length === 0) {
    } else {
      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].id > newId) {
          newId = this.orders[i].id
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
          const orders = JSON.parse(data)
          const deepCopy = JSON.parse(JSON.stringify(orders)) // 深度複製
          resolve(deepCopy)
        }
      })
    })
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      try {
        const order = this.orders.find((a) => a.id === id)
        if (order) {
          const clonedOrder = JSON.parse(JSON.stringify(order))
          resolve(clonedOrder)
        } else {
          reject(`查無此服務`)
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  update(id, orderData) {
    return new Promise((resolve, reject) => {
      this.getById(id).then((order) => {
        //直接使用重複的
        // 檢查是否存在要更新的字段，進行部分更新
        if (orderData.serviceId) {
          order.serviceId = orderData.serviceId
        }
        if (orderData.timestamp) {
          order.timestamp = orderData.timestamp
        }
        if (orderData.staff) {
          order.staff = orderData.staff
        }
        if (orderData.name) {
          order.name = orderData.name
        }
        if (orderData.gender) {
          order.gender = orderData.gender
        }
        if (orderData.phone) {
          order.phone = orderData.phone
        }
        if (orderData.email) {
          order.email = orderData.email
        }
        if (orderData.remark) {
          order.remark = orderData.remark
        }
        let orderIndex = this.orders.findIndex((a) => a.id === id)
        this.orders[orderIndex] = order
        // 將更新後的文章列表寫入文件
        this.write(this.orders)
          .then(() => {
            resolve(this.orders[orderIndex]) // 返回更新後的文章數據
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
      this.getById(id).then((order) => {
        let orderIndex = this.orders.findIndex((a) => a.id === id)
        this.orders.splice(orderIndex, 1)
        this.write(this.orders)
          .then(() => resolve({ msg: `已把 ${id} 刪除成功` }))
          .catch((err) => reject(err))
      })
    })
  }
}

const orderModel = new OrderModel()

module.exports = orderModel
