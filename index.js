// 引用後端框架 express
const express = require('express')
const cors = require('cors')
//路由們，底下可以包含多個路由器設定，這邊引用路由設定檔，沒有指定檔案預設就是./routes/index.js
const router = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
// 建立 express 實例
const app = express()

// 使用 cors 中間件，允許不同網域來的請求，免於同源策略的限制
app.use(
  cors({
    origin: [
      'https://booking-system-weld-two.vercel.app',
      'http://localhost:3000',
    ], // 替換為你的 Vercel 前端域名
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允許的請求方法
    credentials: true, // 如果需要傳遞 cookies 或身份驗證令牌
  })
)
//告訴 Express 應用程式要使用 express.json() 中間件來解析請求主體中的 JSON 格式資料
app.use(express.json())


app.use(express.urlencoded({ extended: true }))

//使用路由設定
app.use(router)

// 設定靜態文件目錄  //express.static() 是 Express 提供的一個中間件，專門用來提供靜態文件（如圖片、CSS 文件、JavaScript 文件等）。
//path.join(__dirname, 'images') 構建了一個絕對路徑，它指向當前應用程式目錄下的 images 資料夾
app.use('/images', express.static(path.join(__dirname, 'images')));

// 處理 GET localhost:[PORT] 的請求(註：localhost:[PORT] 和 localhost:[PORT]/ 是等價的，結尾有無 / 都一樣)
// req: 前端發送來的請求物件
// res: 回傳給前端的回應物件，可以透過 send 回傳字串，或透過 json 回傳 json 格式數據。
//app.get('/', (req, res) => {
// 以字串形式返回
// res 的 status 設置 HTTP 回應碼，若沒設置，預設為 200
// res.send('This is backend of Calculator.')
//})

// 設置監聽的 port (後端 URL 會是 localhost:[PORT])
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`express server is running on ${PORT}`)
})
