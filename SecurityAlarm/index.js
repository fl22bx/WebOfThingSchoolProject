const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const Database = require('./Config/DbConfig')
const passport = require('passport')
const pirObservable = require('./WotModel/Model').pirObservable
const resource = require('./WotModel/Model').resource
require('dotenv').config()
var jwt = require('jsonwebtoken')

const server = require('http').createServer(app)

var io = require('socket.io')(server)
// let originSim = 'http://localhost:4000'
app.use(cors({
  origin: 'http://172.20.10.8:4000',
  credentials: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./Config/PassportConfig')
app.use(passport.initialize())
new Database().Initialize()

app.use('/pi', require('./Routes/WotModel'))
/*
io.use((socket, next) => {
  let token = socket.handshake.query.token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'))
    socket.decoded = decoded
    next()
  })

  return next(new Error('authentication error'))
})
*/

io.on('connection', client => {
  pirObservable.on('change', (change) => {
    client.emit('alert', resource.properties.resources['pir'].data[change.index])
  })
})

server.listen(3000)
