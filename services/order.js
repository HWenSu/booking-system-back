//service 做資料正確的判斷
//顯示錯誤的訊息做分類
const { orderModel, serviceModel, staffModel } = require('../models')
require('dotenv').config() // 加載 .env 文件
const { Op } = require('sequelize')
const nodemailer = require('nodemailer')

class OrderService {
  //直接讀取陣列裡面全部的資料就好 不用全部重讀一遍read
  async getAllOrder() {
    return orderModel.findAll()
  }

  async getOrderById(id) {
    const order = await orderModel.findByPk(id)
    if (!order) {
      throw new Error('查無此訂單')
    }
    return order
  }

  async createOrder(orderData) {
    const { serviceId, staff, start } = orderData

    // 確認 serviceId 是否有效
    const service = await serviceModel.findByPk(serviceId)
    if (!service) {
      throw new Error('無效的服務項目ID')
    }
    // 如果有指定員工，確認 staff ID 是否有效
    const staffRecord = await staffModel.findByPk(staff)
    if (!staffRecord) {
      throw new Error('無效的員工ID')
    }

    // 計算 end time 根據服務時間長度
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + service.duration) // 加上服務的持續時間

    const genderConvert = {
      0: '男',
      1: '女',
      2: '其他',
      3: '不想說'
    }

    const conflictingOrders = await orderModel.findOne({
      where: {
        staff: staff, // 檢查是否有相同的員工
        [Op.or]: [
          // 使用 Sequelize 的 Op.or 組合多種條件來判斷預約時間是否重疊
          {
            start: {
              [Op.between]: [start, end] // 檢查新的 start 時間是否落在現有預約的 start 和 end 之間
            }
          },
          {
            end: {
              [Op.between]: [start, end] // 檢查新的 end 時間是否落在現有預約的 start 和 end 之間
            }
          },
          {
            [Op.and]: [
              { start: { [Op.lte]: start } }, // 檢查現有預約的 start 是否在新預約的 start 之前或相等 lit為小於等於
              { end: { [Op.gte]: end } } // 檢查現有預約的 end 是否在新預約的 end 之後或相等 gte為大於等於
            ]
          }
        ]
      }
    })
    if (conflictingOrders) {
      throw new Error('該員工在此時段已有其他預約')
    }

    // 創建新訂單
    const newOrder = await orderModel.create({
      serviceId: orderData.serviceId,
      start: orderData.start,
      end: end,
      staff: orderData.staff,
      name: orderData.name,
      gender: genderConvert[orderData.gender],
      phone: orderData.phone,
      email: orderData.email,
      remark: orderData.remark
    })
    return newOrder
  }

  //如果進來的ID是負數或是英文 這裡擋掉  //這裡返回到promise
  async updateOrder(id, orderData) {
    const order = await orderModel.findByPk(id)
    if (!order) {
      throw new Error('查無此訂單')
    }
    return order.update(orderData)
  }

  //刪除前確認文章是否存在
  async deleteOrder(id) {
    const order = await orderModel.findByPk(id)
    if (!order) {
      throw new Error('查無此訂單')
    }
    return order.destroy()
  }

  async sendEmail(email, name, start) {
    //設置郵件發送配置
    const transporter = nodemailer.createTransport({
      service: 'gmail', //根據需求換其他信箱服務
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    //transporter.verify().then((result) => console.log(result))
    //發送郵件的函數
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `美容預約申請通知`,
      text: `親愛的${name}，您預約在${start}的時段已成功，期待您的大駕光臨`
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
        return 'Error sending email'
      } else {
        console.log(info)
        return 'Email sent'
      }
    })
  }

  checkEmail(email) {
    const atIndex = email.indexOf('@')
    if (atIndex === -1) {
      return true
    }
    const domain = email.substring(atIndex + 1)
    if (domain.length === 0) {
      return true
    }
    const userName = email.substring(0, atIndex)
    if (userName.length === 0) {
      return true
    }
    const dot = domain.indexOf('.')
    if (dot === -1) {
      return true
    }
    const dotDomain = domain.substring(dot + 1)
    if (dotDomain.length === 0) {
      return true
    }
    return false
  }
}

const orderService = new OrderService()

module.exports = orderService
