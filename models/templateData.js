//model/templateData.js 做數據管理
const { DataTypes } = require('sequelize')
const sequelize = require('../util/db')

const templateDataModel = sequelize.define(
  'templateDataModel',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    required: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  },
  {
    tableName: 'template_data',
    timestamps: false
  }
)

module.exports = templateDataModel