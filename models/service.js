//model/service.js 做數據管理
const { DataTypes } = require('sequelize')
const sequelize = require('../util/db')


// 定義 Certificate 模型
const serviceModel = sequelize.define(
  'serviceModel',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    massage_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'A'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'services', // 資料表名稱
    timestamps: false // 如果不需要自動生成 createdAt 和 updatedAt 時間戳欄位
  }
)

module.exports = serviceModel