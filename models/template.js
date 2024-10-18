//model/template.js 做數據管理
const { DataTypes } = require('sequelize')
const sequelize = require('../util/db')

const templateModel = sequelize.define(
  'templateModel',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'templates',
    timestamps: false
  }
)

module.exports = templateModel
