//model 做數據管理
//引入fs模塊，用於文件讀寫操作
const fs = require('fs')
//引入 path 模塊，用於處理和轉換文件路徑。
const path = require('path')
const filePath = path.join('data/staff.json')

class StaffModel {
  constructor() {
    this.staffs = []
    this.init()
  }

  async init() {
    try {
      this.staffs = await this.read()
      this.staffId = this.createId() 
    } catch (err) {
      console.error('無法初始化:', err)
    }
  }

  create(newStaff) {
    return new Promise((resolve, reject) => {
      try {
        const gender = ['男', '女', '其他', '不想說']
        const defaultGender = '其他'

        newStaff.gender = gender.includes(newStaff.gender)
          ? newStaff.gender
          : defaultGender
        newStaff.id = this.staffId + 1
        const orderedStaff = {
          id: newStaff.id,
          name: newStaff.name,
          company: newStaff.company,
          gender: newStaff.gender,
          img: newStaff.img,
          expertise: newStaff.expertise
        }
        this.staffs.push(orderedStaff)
        this.write(this.staffs)
          .then(() => resolve(orderedStaff))
          .catch((err) => reject(err))
      } catch (err) {
        reject(err)
      }
    })
  }

  write(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  createId() {
    let newId = 0
    if (this.staffs.length === 0) {
    } else {
      for (let i = 0; i < this.staffs.length; i++) {
        if (this.staffs[i].id > newId) {
          newId = this.staffs[i].id
        }
      }
    }
    return newId
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const staffs = JSON.parse(data)
          const deepCopy = JSON.parse(JSON.stringify(staffs)) // 深度複製
          resolve(deepCopy)
        }
      })
    })
  }
  getById(id) {
    return new Promise((resolve, reject) => {
      try {
        const staff = this.staffs.find((a) => a.id === id)
        if (staff) {
          const clonedStaff = JSON.parse(JSON.stringify(staff))
          resolve(clonedStaff)
        } else {
          reject(`查無此服務`)
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  update(id, staffData) {
    return new Promise((resolve, reject) => {
      this.getById(id).then((staff) => {
        //直接使用重複的
        // 檢查是否存在要更新的字段，進行部分更新
        if (staffData.name) {
          staff.name = staffData.name
        }
        if (staffData.gender) {
          staff.gender = staffData.gender
        }
        if (staffData.image) {
          staff.image = staffData.image
        }
        if (staffData.expertise) {
          staff.expertise = staffData.expertise
        }
        let staffIndex = this.staffs.findIndex((a) => a.id === id)
        this.staffs[staffIndex] = staff
        // 將更新後的文章列表寫入文件
        this.write(this.staffs)
          .then(() => {
            resolve(this.staffs[staffIndex]) // 返回更新後的文章數據
          })
          .catch((err) => {
            // 處理寫入錯誤
            reject(err)
          })
      })
    })
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.getById(id).then((staff) => {
        let staffIndex = this.staffs.findIndex((a) => a.id === id)
        this.staffs.splice(staffIndex, 1)
        this.write(this.staffs)
          .then(() => resolve({ msg: `已把 ${id} 刪除成功` }))
          .catch((err) => reject(err))
      })
    })
  }
}

const staffModel = new StaffModel()

module.exports = staffModel
