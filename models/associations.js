// models/associations.js
const staffModel = require('./staff')
const certificateModel = require('./certificate')
const serviceModel = require('./service')
const templateModel = require('./template')
const templateDataModel = require('./templateData')
const orderModel = require('./order')
const massageImageModel = require('./massageImage')
const staffImageModel = require('./staffImage')



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

staffModel.hasMany(orderModel, {
  foreignKey: 'staff',
  sourceKey: 'id',
  timestamps: false
})

orderModel.belongsTo(staffModel, {
  foreignKey: 'staff',
  targetKey: 'id',
  timestamps: false
})

massageImageModel.hasMany(serviceModel, {
  foreignKey: 'massage_id',
  sourceKey: 'id',
  timestamps: false
})

serviceModel.belongsTo(massageImageModel, {
  foreignKey: 'massage_id',
  targetKey: 'id',
  timestamps: false
})

staffImageModel.hasOne(staffModel, {
  foreignKey: 'id',
  sourceKey: 'id',
  timestamps: false
})

staffModel.belongsTo(staffImageModel, {
  foreignKey: 'id',
  targetKey: 'id',
  timestamps: false
})

module.exports = {
  staffModel,
  certificateModel,
  serviceModel,
  templateModel,
  templateDataModel,
  massageImageModel,
  staffImageModel
}