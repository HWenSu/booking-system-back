//service 做資料正確的判斷
//顯示錯誤的訊息做分類
const { certificateModel } = require('../models')
const path = require('path')

class CertificateService {
  //直接讀取陣列裡面全部的資料就好 不用全部重讀一遍read
  async getAllCertificate() {
    return certificateModel.certificates
  }

  async createCertificate(certificateData) {
    return certificateModel.create(certificateData)
  }

  //如果進來的ID是負數或是英文 這裡擋掉  //這裡返回到promise
  async updateCertificate(id, certificateData) {
    await certificateModel.getById(id).catch((error) => {
      //return 404 msg 沒ID 的文章
      throw new Error(`查無此服務`)
    })
    // 執行更新操作
    return certificateModel.update(id, certificateData)
  }

  //刪除前確認文章是否存在
  async deleteCertificate(id) {
    await certificateModel.getById(id).catch((error) => {
      throw new Error(`查無此服務`)
    })
    return certificateModel.delete(id)
  }
}

const certificateService = new CertificateService()

module.exports = certificateService
