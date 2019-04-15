const routes = require('express').Router()
const resources = require('../WotModel/Model').resource
const passport = require('passport')
const jwt = require('jsonwebtoken')
const UserModel = require('../Models/UserModel')
const SecurityAlarm = require('../Models/SecurityAlarmSingleton')

/**
 * Wot model router
 *
 */
routes.route('/')
  .get((req, resp, next) => {
    resp.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      things: '/things/'
    })

    let fields = ['id', 'name', 'description', 'tags', 'customFields']
    let target = {}
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i]
      target[field] = resources[field]
    }
    resp.send(target)
  })

routes.route('/model/')
  .get((req, resp) => {
    resp.set('Link', '<url>; rel="type" ')
    resp.send(resources)
  })

routes.route('/properties/')
  .get((req, resp) => {
    resp.send(resources['properties'])
  })

routes.route('/properties/pir/')
  .get((req, resp) => {
    resp.send(resources['properties'].resources['pir'])
  })

routes.route('/properties/led/')
  .get((req, resp) => {
    resp.send(resources['properties'].resources['led'])
  })

routes.route('/actions/')
  .get((req, resp) => {
    resp.set('Link', '<url/actions>; rel="type" ')
    let tmp = []
    let obj = resources.actions.resources

    for (var key in obj) {
      tmp.push({ 'id': key, 'name': obj[key].name })
    }

    resp.send(tmp)
  })

routes.route('/actions/AlarmState/')
  .get((req, resp) => {
    resp.send(resources['actions'].resources['AlarmState'])
  })
  .post(passport.authenticate('jwt', { session: false }), (req, resp) => {
    SecurityAlarm.alarmState(req.body.state, req.user.Username)
    resp.send(202)
  })

routes.route('/actions/Authenticate/')
  .get((req, resp) => {
    resp.send(resources['actions'].resources['Authenticate'])
  })
  .post((req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) { return next(err) }

      if (!user) {
        res.status(401)
        return res.send()
      }
      req.logIn(user, { session: false }, function (err) {
        if (err) { return next(err) }
        const token = jwt.sign({ user: user.Username }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.status(200)
        return res.json(token)
      })
    })(req, res, next)
  })

routes.route('/actions/User/')
  .get((req, resp) => {
    resp.send(resources['actions'].resources['User'])
  })
  .post(passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let newUser = new UserModel({
      Username: req.body.username,
      Password: req.body.password
    })
    newUser.save()
      .then((doc, e) => {
        if (e) {
          res.status(500)
          res.send(e)
        }
        res.status(201)
        res.send()
      })
  })

module.exports = routes
