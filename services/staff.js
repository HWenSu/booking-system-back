//service/staff.js 做資料正確的判斷
//顯示錯誤的訊息做分類
const { staffModel, certificateModel } = require('../models')

class StaffService {

  async getAllStaff(companyName) {
    const staffList = await staffModel.findAll({
      where: { company: companyName },
      include: [
        {
          model: certificateModel, // 關聯
          attributes: ['name', 'category'], // 只返回需要的欄位
          through: {
            attributes: [] //不拿中介表的資料
          }
        }
      ]
    })

    const genderConvert = {
      1: '女',
      2: '其他',
      3: '男'
    }

    return staffList.map((staff) => ({
      id: staff.id,
      name: staff.name,
      gender: genderConvert[staff.gender],
      img: staff.img,
      expertise: staff.expertise,
      certificates: staff.certificateModels.map(({ name, category }) => ({
        name,
        category
      }))
    }))
  }

  async getStaffById(id, companyName) {
    const staff = await staffModel.findOne({
      where: {  id,company: companyName },
      include: [
        {
          model: certificateModel, // 關聯
          attributes: ['name', 'category'], // 只返回需要的欄位
          through: {
            attributes: [] //不拿中介表的資料
          }
        }
      ]
    })

    const genderConvert = {
      1: '女',
      2: '其他',
      3: '男'
    }

    if (!staff) {
      throw new Error('查無此員工')
    }

    return {
      name: staff.name,
      gender: genderConvert[staff.gender],
      img: staff.img,
      expertise: staff.expertise,
      certificates: staff.certificateModels.map(({ name, category }) => ({
        name,
        category
      }))
    }
  }

  async createStaff(staffData, file) {
    const gender = [0, 1, 2, 3]
    const defaultGender = '2'

    staffData.gender = gender.includes(staffData.gender)
      ? staffData.gender
      : defaultGender

    let imagePath = ''
    if (file !== undefined) {
      //config js
      imagePath = `http://localhost:5000/images/staff/${file.originalname}`
    }
    const newStaffData = {
      ...staffData,
      img: imagePath
    }
    return staffModel.create(newStaffData)
  }

async addCertificatesToStaff(staffId, certificateIds) {
  const staff = await staffModel.findByPk(staffId);
  if (!staff) {
    throw new Error('找不到該員工');
  }

  // 使用 getCertificateModels() 來獲取員工已有的證照
  const existingCertificates = await staff.getCertificateModels({
    where: { id: certificateIds }
  });

  const existingCertificateIds = existingCertificates.map(cert => cert.id);
  const newCertificateIds = certificateIds.filter(id => !existingCertificateIds.includes(id));

  if (newCertificateIds.length === 0) {
    throw new Error('所有證照已經存在，沒有新增任何證照');
  }

  const newCertificates = await certificateModel.findAll({
    where: { id: newCertificateIds }
  });

  if (newCertificates.length !== newCertificateIds.length) {
    const missingIds = newCertificateIds.filter(id => !newCertificates.some(cert => cert.id === id));
    throw new Error(`找不到以下證照ID: ${missingIds.join(', ')}`);
  }

  await staff.addCertificateModels(newCertificates); // 使用 addCertificateModels() 來新增
  return { message: '證照成功添加' };
}

  async removeCertificatesFromStaff(staffId, certificateIds){
    const staff = await staffModel.findByPk(staffId)
    if (!staff) {
      throw new Error('找不到該員工')
    }
    //使用 getCertificateModels() 來獲取員工現有的證照
    const existingCertificates = await staff.getCertificateModels({
      where: {id: certificateIds}
    })

    const existingCertificateIds = existingCertificates.map(cert => cert.id)
    const missingCertificateIds = certificateIds.filter(id => !existingCertificateIds.includes(id))

    if(missingCertificateIds.length > 0 ){
       throw new Error(
         `以下證照ID不存在或是該員工未持有: ${missingCertificateIds.join(', ')}`
       )
    }

    await staff.removeCertificateModels(existingCertificates)
    return { message: '成功刪除指定的證照' }
  }




  //如果進來的ID是負數或是英文 這裡擋掉  //這裡返回到promise
  async updateStaff(id, staffData) {
    const staff = await staffModel.findByPk(id)
    if (!staff) {
      throw new Error(`查無此員工`)
    }
    // 執行更新操作
    return staff.update(staffData)
  }

  //刪除前確認員工是否存在
  async deleteStaff(id) {
    const staff = await staffModel.findByPk(id)
    if (!staff) {
      throw new Error(`查無此員工`)
    }
    return staff.destroy()
  }
}

const staffService = new StaffService()

module.exports = staffService
