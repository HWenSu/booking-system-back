//model 做數據管理
//引入fs模塊，用於文件讀寫操作
const fs = require('fs')
//引入 path 模塊，用於處理和轉換文件路徑。
const path = require('path')
const filePath = path.join('data/data.json')

class MassageModel {
  constructor() {
    this.massages = []
    this.init()
  }

  async init() {
    try {
      this.massages = await this.read()
      this.massageId = this.createId()
    } catch (err) {
      console.error('無法初始化:', err)
    }
  }

  create(newMassage) {
    return new Promise((resolve, reject) => {
      try {
        newMassage.id = this.massageId + 1
        const orderedMassage = {
          id: newMassage.id,
          name: newMassage.name,
          price: newMassage.price,
          description: newMassage.description,
          image: newMassage.image
        }
        this.massages.push(orderedMassage)
        this.write(this.massages)
          .then(() => resolve(orderedMassage))
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
    if (this.massages.length === 0) {
    } else {
      for (let i = 0; i < this.massages.length; i++) {
        if (this.massages[i].id > newId) {
          newId = this.massages[i].id
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
          const massages = JSON.parse(data)
          const deepCopy = JSON.parse(JSON.stringify(massages)) // 深度複製
          resolve(deepCopy)
        }
      })
    })
  }
  getById(id) {
    return new Promise((resolve, reject) => {
      try {
        const massage = this.massages.find((a) => a.id === id)
        if (massage) {
          const clonedMassage = JSON.parse(JSON.stringify(massage))
          resolve(clonedMassage)
        } else {
          reject(`查無此服務`)
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  update(id, massageData) {
    return new Promise((resolve, reject) => {
      this.getById(id).then((massage) => {
        //直接使用重複的
        // 檢查是否存在要更新的字段，進行部分更新
        if (massageData.name) {
          massage.name = massageData.name
        }
        if (massageData.price) {
          massage.price = massageData.price
        }
        if (massageData.description) {
          massage.description = massageData.description
        }
        if (massageData.image) {
          massage.image = massageData.image
        }
        let massageIndex = this.massages.findIndex((a) => a.id === id)
        this.massages[massageIndex] = massage
        // 將更新後的文章列表寫入文件
        this.write(this.massages)
          .then(() => {
            resolve(this.massages[massageIndex]) // 返回更新後的文章數據
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
      this.getById(id).then((massage) => {
        let massageIndex = this.massages.findIndex((a) => a.id === id)
        this.massages.splice(massageIndex, 1)
        this.write(this.massages)
          .then(() => resolve({ msg: `已把 ${id} 刪除成功` }))
          .catch((err) => reject(err))
      })
    })
  }
}

const massageModel = new MassageModel()

module.exports = massageModel