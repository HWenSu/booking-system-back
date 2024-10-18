// models/associations.js
const staffModel = require('./staff')
const certificateModel = require('./certificate')
const serviceModel = require('./service')
const templateModel = require('./template')
const templateDataModel = require('./templateData')


// 定義多對多關聯
staffModel.belongsToMany(certificateModel, {
  through: 'staff_certificates',
  foreignKey: 'staff_id',
  timestamps: false
})
certificateModel.belongsToMany(staffModel, {
  through: 'staff_certificates',
  foreignKey: 'certificate_id',
  timestamps: false
})

templateModel.hasMany(templateDataModel, {
  foreignKey: 'template_id',
  sourceKey: 'id',
  timestamps: false
})

templateDataModel.belongsTo(templateModel, {
  foreignKey: 'template_id',
  targetKey: 'id',
  timestamps: false
})

staffModel.belongsToMany(templateDataModel, {
  through: 'template_data_gender',
  foreignKey: 'gender_id',
  timestamps: false
})

templateDataModel.belongsToMany(staffModel, {
  through: 'template_data_gender',
  foreignKey: 'template_data_id',
  timestamps: false
})

serviceModel.belongsToMany(templateDataModel, {
  through: 'template_data_service',
  foreignKey: 'massage_id',
  timestamps: false
})

templateDataModel.belongsToMany(serviceModel, {
  through: 'template_data_service',
  foreignKey: 'template_data_id',
  timestamps: false
})


module.exports = {
  staffModel,
  certificateModel,
  serviceModel,
  templateModel,
  templateDataModel
}