const routes = require('express').Router()
var path = require('path')

routes.route('/')
  .get((req, resp) => {
    resp.sendFile(path.join(__dirname, '/www/assets/html/index.html'))
  })

module.exports = routes
