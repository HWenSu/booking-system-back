//model 做數據管理
//引入fs模塊，用於文件讀寫操作
const fs = require('fs')
//引入 path 模塊，用於處理和轉換文件路徑。
const path = require('path')
const filePath = path.join('data/certificate.json')
const db = require('../util/db')

class CertificateModel {
  constructor() {
    this.certificates = []
    this.init()
  }

  async init() {
    try {
      this.certificates = await this.read()
      this.certificateId = this.createId()
    } catch (err) {
      console.error('無法初始化:', err)
    }
  }

  create(newCertificate) {
    return new Promise((resolve, reject) => {
      try {
        const categories = ['A', 'B', 'C']
        const defaultCategory = 'A'

        newCertificate.category = categories.includes(newCertificate.category)
          ? newCertificate.category
          : defaultCategory
        newCertificate.id = this.serviceId + 1
        const orderedCertificate = {
          id: newCertificate.id,
          name: newCertificate.name,
          category: newCertificate.category
        }
        this.certificates.push(orderedCertificate)
        this.write(this.certificates)
          .then(() => resolve(orderedCertificate))
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
    if (this.certificates.length === 0) {
    } else {
      for (let i = 0; i < this.certificates.length; i++) {
        if (this.certificates[i].id > newId) {
          newId = this.certificates[i].id
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
          const certificates = JSON.parse(data)
          const deepCopy = JSON.parse(JSON.stringify(certificates)) // 深度複製
          resolve(deepCopy)
        }
      })
    })
  }
  getById(id) {
    return new Promise((resolve, reject) => {
      try {
        const certificate = this.certificates.find((a) => a.id === id)
        if (certificate) {
          const clonedCertificate = JSON.parse(JSON.stringify(certificate))
          resolve(clonedCertificate)
        } else {
          reject(`查無此服務`)
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  update(id, certificateData) {
    return new Promise((resolve, reject) => {
      this.getById(id).then((certificate) => {
        //直接使用重複的
        // 檢查是否存在要更新的字段，進行部分更新
        if (certificateData.name) {
          certificate.name = certificateData.name
        }
        if (certificateData.category) {
          certificateData.category = certificateData.category
        }
        let certificateIndex = this.certificates.findIndex((a) => a.id === id)
        this.certificates[certificateIndex] = certificate
        // 將更新後的文章列表寫入文件
        this.write(this.certificates)
          .then(() => {
            resolve(this.certificates[certificateIndex]) // 返回更新後的文章數據
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
      this.getById(id).then((certificate) => {
        let certificateIndex = this.certificates.findIndex((a) => a.id === id)
        this.certificates.splice(certificateIndex, 1)
        this.write(this.certificates)
          .then(() => resolve({ msg: `已把 ${id} 刪除成功` }))
          .catch((err) => reject(err))
      })
    })
  }
}

const certificateModel = new CertificateModel()

module.exports = certificateModel
