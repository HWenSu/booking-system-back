//service 做資料正確的判斷
//顯示錯誤的訊息做分類
const { orderModel, serviceModel, staffModel } = require('../models')
const path = require('path')
const nodemailer = require('nodemailer')

class OrderService {
  //直接讀取陣列裡面全部的資料就好 不用全部重讀一遍read
  async getAllOrder() {
    return orderModel.orders
  }

  // async getOrderById(id) {
  //   return orderModel.getById(id)
  // }

  async createOrder(orderData) {
    const { serviceId, staff, timestamp } = orderData
    const serviceList = serviceModel.services.find(
      (serviceId) => serviceId.id === orderData.serviceId
    )
    if (serviceList === undefined) {
      throw new Error('無效的服務項目ID')
    }
    if (orderData.staff > 0) {
      const staffList = staffModel.staffs.find(
        (staffId) => staffId.id === orderData.staff
      )
      if (staffList === undefined) {
        throw new Error('無效的員工ID')
      }
    } else if (
      orderData.staff !== -1 &&
      orderData.staff !== -2 &&
      orderData.staff !== -3
    ) {
      throw new Error('無效的員工性別')
    }

    return orderModel.create(orderData)
  }

  //如果進來的ID是負數或是英文 這裡擋掉  //這裡返回到promise
  async updateOrder(id, orderData) {
    await orderModel.getById(id).catch((error) => {
      //return 404 msg 沒ID 的文章
      throw new Error(`查無此服務`)
    })
    // 執行更新操作
    return orderModel.update(id, orderData)
  }

  //刪除前確認文章是否存在
  async deleteOrder(id) {
    await orderModel.getById(id).catch((error) => {
      throw new Error(`查無此服務`)
    })
    return orderModel.delete(id)
  }

  async sendEmail(email, name) {
    //設置郵件發送配置
    const transporter = nodemailer.createTransport({
      service: 'gmail', //根據需求換其他信箱服務
      auth: {
        user: '你的信箱',
        pass: '你的密碼'
      }
    })
    //transporter.verify().then((result) => console.log(result))
    //發送郵件的函數
    const mailOptions = {
      from: 'willy39steven@gmail.com',
      to: email,
      subject: `美容預約申請通知`,
      text: `親愛的${name}，您的預約已成功，期待您的大駕光臨`
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
