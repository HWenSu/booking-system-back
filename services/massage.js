//service 做資料正確的判斷
//顯示錯誤的訊息做分類
const massageModel = require('../models')

class MassageService {
  //直接讀取陣列裡面全部的資料就好 不用全部重讀一遍read
  async getAllMassage() {
    return massageModel.massages
  }

  async getMassageById(id) {
    return massageModel.getById(id)
  }

  async createMassage(massageData) {
    return massageModel.create(massageData)
  }

  //如果進來的ID是負數或是英文 這裡擋掉  //這裡返回到promise
  async updateMassage(id, massageData) {
    await massageModel.getById(id).catch((error) => {
      //return 404 msg 沒ID 的文章
      throw new Error(`查無此服務`)
    })
    // 執行更新操作
    return massageModel.update(id, massageData)
  }

  //刪除前確認文章是否存在
  async deleteMassage(id) {
    await massageModel.getById(id).catch((error) => {
      throw new Error(`查無此服務`)
    })
    return massageModel.delete(id)
  }
}

const massageService = new MassageService()

module.exports = massageService
