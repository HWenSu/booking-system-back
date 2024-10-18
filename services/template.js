//services/template.js 做資料正確的判斷
//顯示錯誤的訊息做分類
const {
  templateModel,
  templateDataModel,
  staffModel,
  serviceModel,
  orderModel
} = require('../models')

class TemplateService {
  async getAllTemplate(company) {
    const templates = await templateModel.findAll({
      include: [
        {
          model: templateDataModel
        }
      ]
    })

    // 取得服務資料
    const services = await serviceModel.findAll()

    // 取得員工資料
    const staff = await staffModel.findAll({
      where: {
        company: company // 根據公司名稱過濾員工
      }
    })
    
    // 整理模板數據
    let formattedTemplates = []

    // 儲存服務和時長
    let serviceMap = new Map()

    // 先處理服務資料，按 `massage_id` 合併相同的服務，並將 `duration` 轉換為數組
    services.forEach((service) => {
      const serviceId = service.massage_id

      if (!serviceMap.has(serviceId)) {
        serviceMap.set(serviceId, {
          id: serviceId,
          name: service.name,
          durations: []
        })
      }

      const serviceData = serviceMap.get(serviceId)
      if (!serviceData.durations.includes(service.duration)) {
        serviceData.durations.push(service.duration)
      }
    })

    // 將合併後的服務資料轉換成需要的下拉選項格式
    const serviceDropdown = {
      category: 'Dropdown',
      Data: [
        {
          label: 'Service',
          option: Array.from(serviceMap.values()).map((service) => ({
            id: service.id,
            name: service.name
          })),
          required: true
        }
      ]
    }

    // 將時長資料轉換成需要的下拉選項格式
    const durationDropdown = {
      category: 'Dropdown',
      Data: [
        {
          label: 'Duration',
          option: Array.from(serviceMap.values()).map((service) => ({
            id: service.id,
            name: service.durations.sort((a, b) => a - b) // 按時長排序
          })),
          required: true
        }
      ]
    }

    // 根據性別分組員工資料，並將名字整理成列表
    const staffByGender = {
      male: [],
      female: [],
      other: []
    }

    staff.forEach((staffMember) => {
      if (staffMember.gender === 3) {
        staffByGender.male.push(staffMember.name)
      } else if (staffMember.gender === 1) {
        staffByGender.female.push(staffMember.name)
      } else {
        staffByGender.other.push(staffMember.name)
      }
    })

    // 按需求格式構建 Gender 下拉選單
    const genderDropdown = {
      category: 'Dropdown',
      Data: [
        {
          label: 'Gender',
          option: [
            { id: 1, name: '女' },
            { id: 2, name: '其他' },
            { id: 3, name: '男' }
          ],
          required: false
        }
      ]
    }

    // 按需求格式構建 Staff 下拉選單
    const staffDropdown = {
      category: 'Dropdown',
      Data: [
        {
          label: 'Staff',
          option: [
            { id: 1, name: staffByGender.female },
            { id: 2, name: staffByGender.other },
            { id: 3, name: staffByGender.male }
          ],
          required: true
        }
      ]
    }

    // 處理模板數據
    templates.forEach((template) => {
      console.log(template)
      template.templateDataModels.forEach((dataModel) => {
        const formattedData = {
          category: template.type,
          Data: [
            {
              label: dataModel.label,
              required: dataModel.required === 1 ? true : false
            }
          ]
        }

        // 如果是 Input 類型，添加 `name` 屬性
        if (template.type === 'Input') {
          formattedData.name =
            dataModel.label.charAt(0).toUpperCase() + dataModel.label.slice(1)
          formattedData.Data[0].type = dataModel.type
        }

        // 如果是 ChangePage 類型，處理 type
        if (template.type === 'ChangePage' && dataModel.type) {
          formattedData.Data[0].type = dataModel.type.split(',')
        }

        // 添加處理後的資料到結果
        formattedTemplates.push(formattedData)
      })
    })

    // 查找所有 'ChangePage' 的模板
    const changePageTemplates = formattedTemplates.filter(
      (t) => t.category === 'ChangePage'
    )

    // 移動其中一個 'ChangePage' 到最後
    if (changePageTemplates.length > 1) {
      const secondChangePageIndex = formattedTemplates.indexOf(
        changePageTemplates[1]
      )
      const secondChangePage = formattedTemplates.splice(
        secondChangePageIndex,
        1
      )[0] // 移除第二個 'ChangePage'
      formattedTemplates.push(secondChangePage) // 將它添加到數組的最後
    }

    formattedTemplates.unshift(
      serviceDropdown,
      durationDropdown,
      genderDropdown,
      staffDropdown
    )

    // 返回組裝好的結果，包含服務和時長的下拉選項
    return formattedTemplates
  }
}
const templateService = new TemplateService()

module.exports = templateService
