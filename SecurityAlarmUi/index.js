const express = require('express')
const app = express()
var path = require('path')
// app.use('/', require('./routes/router.js'))
app.get('/', (req, resp) => {
  resp.sendFile(path.join(__dirname, '/www/assets/html/index.html'))
})

app.use(express.static(path.join(__dirname, '/www/assets')))

app.listen(4000, () => {
  console.log('Server upp and running on port ' + 4000)
})
