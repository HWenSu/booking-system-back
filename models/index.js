const serviceModel = require('./service')
const staffModel = require('./staff')
const certificateModel = require('./certificate')
const orderModel = require('./order')
require('./associations')

module.exports = { serviceModel, staffModel, certificateModel, orderModel }
