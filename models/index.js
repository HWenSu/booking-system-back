const serviceModel = require('./service')
const staffModel = require('./staff')
const certificateModel = require('./certificate')
const orderModel = require('./order')
const templateModel = require('./template')
const templateDataModel = require('./templateData')
require('./associations')

module.exports = {
  serviceModel,
  staffModel,
  certificateModel,
  orderModel,
  templateModel,
  templateDataModel
}
