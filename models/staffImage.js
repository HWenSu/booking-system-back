//model/staffImage.js 做數據管理
const { DataTypes } = require('sequelize')
const sequelize = require('../util/db')

const staffImageModel = sequelize.define(
  'staffImageModel',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    img: {
      type: DataTypes.BLOB('long')
    }
  },
  {
    tableName: 'staff_image', // 資料表名稱
    timestamps: false // 如果不需要自動生成 createdAt 和 updatedAt 時間戳欄位
  }
)

module.exports = staffImageModel
