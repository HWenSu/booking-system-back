const multer = require('multer')

//丟進util
function upload() {
  // 使用 multer 的 memoryStorage 將圖片存到內存中，而非硬碟
  const storage = multer.memoryStorage()
  return multer({ storage: storage })
  
}

module.exports = upload