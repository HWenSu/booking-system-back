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
  // 獲取模板數據
  async getTemplates() {
    return await templateModel.findAll({
      include: [
        {
          model: templateDataModel
        }
      ]
    })
  }

  // 獲取服務數據
  async getServices() {
    const services = await serviceModel.findAll()
    const serviceMap = new Map()

    // 處理服務資料
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

    return serviceMap
  }

  // 獲取員工數據
  async getStaff(company) {
    const staff = await staffModel.findAll({
      where: {
        company: company
      }
    })

    // 根據性別分組員工資料
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

    return staffByGender
  }

  // 查詢每位員工的不可用日期
  async getUnavailableDates() {
    const orders = await orderModel.findAll()
    const unavailableDates = {}

    orders.forEach((order) => {
      const staff = order.staff
      if (!unavailableDates[staff]) {
        unavailableDates[staff] = []
      }

      unavailableDates[staff].push({
        start: order.start,
        end: order.end
      })
    })
    return unavailableDates
  }

  // 處理模板數據
  formatTemplateData(template, serviceMap, staffByGender, unavailableDates) {
    const formattedTemplates = []
    const changePageTemplates = []

    template.templateDataModels.forEach((dataModel) => {
      const formattedData = {
        category: template.type,
        Data: [
          {
            label: dataModel.label,
            required: dataModel.required === 1
          }
        ]
      }

      // Input 類型
      if (template.type === 'Input') {
        formattedData.name =
          dataModel.label.charAt(0).toUpperCase() + dataModel.label.slice(1)
        formattedData.Data[0].type = dataModel.type
      }

      // TimePicker 類型，填充不可用時間
      if (template.type === 'TimePicker') {
        formattedData.Data[0].unavailableDates = unavailableDates
      }

      // ChangePage 類型
      if (template.type === 'ChangePage' && dataModel.type) {
        formattedData.Data[0].type = dataModel.type.split(',')
        changePageTemplates.push(formattedData)
      }

      // Dropdown 類型
      if (template.type === 'Dropdown') {
        if (dataModel.label === 'Service') {
          formattedData.Data[0].option = Array.from(serviceMap.values()).map(
            (service) => ({
              id: service.id,
              name: service.name
            })
          )
        } else if (dataModel.label === 'Duration') {
          formattedData.Data[0].option = Array.from(serviceMap.values()).map(
            (service) => ({
              id: service.id,
              name: service.durations.sort((a, b) => a - b)
            })
          )
        } else if (dataModel.label === 'Gender') {
          formattedData.Data[0].option = [
            { id: 1, name: '女' },
            { id: 2, name: '其他' },
            { id: 3, name: '男' }
          ]
        } else if (dataModel.label === 'Staff') {
          formattedData.Data[0].option = [
            { id: 1, name: staffByGender.female },
            { id: 2, name: staffByGender.other },
            { id: 3, name: staffByGender.male }
          ]
        }
      }

      if (template.type !== 'ChangePage') {
        formattedTemplates.push(formattedData)
      }
    })

    return { formattedTemplates, changePageTemplates }
  }

  // 排列模板順序
  orderTemplates(formattedTemplates, changePageTemplates, unavailableDates) {
    const orderedTemplates = []

    // 1. 插入 Service
    orderedTemplates.push(
      formattedTemplates.find((t) => t.Data[0].label === 'Service')
    )

    // 2. 插入 Duration
    orderedTemplates.push(
      formattedTemplates.find((t) => t.Data[0].label === 'Duration')
    )

    // 3. 插入 Gender
    orderedTemplates.push(
      formattedTemplates.find((t) => t.Data[0].label === 'Gender')
    )

    // 4. 插入 Staff
    orderedTemplates.push(
      formattedTemplates.find((t) => t.Data[0].label === 'Staff')
    )

    // 5. 插入 TimePicker
    orderedTemplates.push({
      category: 'TimePicker',
      Data: [
        {
          label: '',
          required: true,
          unavailableDates: unavailableDates
        }
      ]
    })

    // 6. 插入第一個 ChangePage
    orderedTemplates.push(changePageTemplates[0])

    // 7. 插入 Input 類型資料
    ;['Name', 'Phone', 'Email', 'Remark'].forEach((label) => {
      const inputTemplate = formattedTemplates.find(
        (t) => t.Data[0].label === label
      )
      if (inputTemplate) {
        orderedTemplates.push(inputTemplate)
      }
    })

    // 8. 插入第二個 ChangePage
    if (changePageTemplates.length > 1) {
      orderedTemplates.push(changePageTemplates[1])
    }

    return orderedTemplates
  }

  // 組合起最終模板
  async getAllTemplate(company) {
    const templates = await this.getTemplates()
    const services = await this.getServices()
    const staff = await this.getStaff(company)
    const unavailableDates = await this.getUnavailableDates()

    let allFormattedTemplates = []
    let allChangePageTemplates = []

    templates.forEach((template) => {
      const { formattedTemplates, changePageTemplates } =
        this.formatTemplateData(template, services, staff, unavailableDates)
      allFormattedTemplates = allFormattedTemplates.concat(formattedTemplates)
      allChangePageTemplates =
        allChangePageTemplates.concat(changePageTemplates)
    })

    return this.orderTemplates(
      allFormattedTemplates,
      allChangePageTemplates,
      unavailableDates
    )
  }
}

const templateService = new TemplateService()
module.exports = templateService
