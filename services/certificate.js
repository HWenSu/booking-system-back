//service 做資料正確的判斷
//顯示錯誤的訊息做分類
const { certificateModel } = require('../models')

class CertificateService {
  
  async getAllCertificate() {
    return certificateModel.findAll()
  }

  async createCertificate(certificateData) {
    const categories = ['A', 'B', 'C']
    const defaultCategory = 'A'

    certificateData.category = categories.includes(certificateData.category)
      ? certificateData.category
      : defaultCategory

    return certificateModel.create(certificateData)
  }

  //如果進來的ID是負數或是英文可以在這裡擋掉  //這裡返回到promise
  async updateCertificate(id, certificateData) {
    const certificate = await certificateModel.findByPk(id) // 使用主鍵查找證照
    if (!certificate) {
      throw new Error(`查無此證照`)
    }
    return certificate.update(certificateData) // 更新證照數據
  }

  //刪除前確認證照是否存在
  async deleteCertificate(id) {
    const certificate = await certificateModel.findByPk(id) // 使用主鍵查找證照
    if (!certificate) {
      throw new Error(`查無此服務`)
    }
    return certificate.destroy() // 刪除證照
  }
}

const certificateService = new CertificateService()

module.exports = certificateService
