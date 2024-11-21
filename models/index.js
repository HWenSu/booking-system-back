const serviceModel = require('./service')
const staffModel = require('./staff')
const certificateModel = require('./certificate')
const orderModel = require('./order')
const templateModel = require('./template')
const templateDataModel = require('./templateData')
const massageImageModel = require('./massageImage')
const staffImageModel = require('./staffImage')
require('./associations')

module.exports = {
  serviceModel,
  staffModel,
  certificateModel,
  orderModel,
  templateModel,
  templateDataModel,
  massageImageModel,
  staffImageModel
}
