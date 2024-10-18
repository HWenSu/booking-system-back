//key 跟 value 名稱相同的時候，可以直接一個名稱 const { calculator } = require('./calculator')

//const {plus, minus, multiply, divide, compute } = require('./calculator')
//module.exports = { plus, minus, multiply, divide, compute }
const serviceService = require('./service')
const staffService = require('./staff')
const certificateService = require('./certificate')
const orderService = require('./order')
const templateService = require('./template')

module.exports = {
  serviceService,
  staffService,
  certificateService,
  orderService,
  templateService
}

// const { calculator : calculator } = require('./calculator')
// module.exports = calculator
