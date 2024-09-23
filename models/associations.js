// models/associations.js
const staffModel = require('./staff')
const certificateModel = require('./certificate')

// 定義多對多關聯
staffModel.belongsToMany(certificateModel, {
  through: 'staff_certificates',
  foreignKey: 'staff_id'
})
certificateModel.belongsToMany(staffModel, {
  through: 'staff_certificates',
  foreignKey: 'certificate_id'
})

module.exports = { staffModel, certificateModel }