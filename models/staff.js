//model/staff.js 做數據管理
const { DataTypes } = require('sequelize')
const sequelize = require('../util/db')


const staffModel = sequelize.define(
  'staffModel',
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
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    img: {
      type: DataTypes.STRING
    },
    expertise: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'staff', // 資料表名稱
    timestamps: false // 如果不需要自動生成 createdAt 和 updatedAt 時間戳欄位
  }
)


module.exports = staffModel
