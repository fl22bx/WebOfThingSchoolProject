
// const _ = require('lodash/collection')
// const resources = require('../../Resources/Model')
// const resources = require.main.require('./Resources/Model')
const resources = require('../../WotModel/Model').resource
const obs = require('../../WotModel/Model').pirObservable

/**
 * Pir Hardware
 */
module.exports = class PirPlugin {
  constructor (value = false) {
    this.interval = null
    this.pir = null
    this.model = resources.properties.resources['pir']
    this.actions = ['pirState']
    this.simulate = value
    this.observe()
  }
  stop () {
    if (this.simulate) {
      clearInterval(this.interval)
      this.interval = 0
    } else {
      if (this.pir != null) {
        this.pir.unexport()
        this.pir = null
      }
    }
  }

  observe () {
    obs.on('change', (change) => {
      if (this.model.data[change.index].Status !== undefined) {
        this.model.data[change.index].Status.Status === 'true' ? this.start() : this.stop()
      }
    })
  }

  PirStatus (value, user) {
    let data = resources.properties.resources.pir.data
    if (data.length > 60) data.shift()
    obs.push({ Status: this.CreateValueStatus(value, user) })
  }

  registerMovement (value) {
    let data = resources.properties.resources.pir.data
    console.log(data.length)
    if (data.length > 60) data.shift()
    obs.push({ Movement: this.createValueMovement(value) })
  }

  createValueMovement (data) {
    return { 'pir': data, 'timestamp': Date.now() }
  }

  CreateValueStatus (data, user) {
    return { 'Status': data, 'StatusChangerUnit': user, 'timestamp': Date.now() }
  }

  start () {
    if (this.simulate) {
      this.simulatePir()
    } else {
      this.connectHardware()
    }
  }

  connectHardware () {
    let Gpio = require('onoff').Gpio
    this.pir = new Gpio(this.model.values['Movement'].customFields.Gpio, 'in', 'both')
    process.on('SIGINT', this.stop.bind(this))
    this.pir.watch((e, value) => {
      if (e) {
        this.stop()
        throw new Error(e)
      }
      this.registerMovement(value)
    })
  }

  simulatePir () {
    this.interval = setInterval(() => {
      let value = this.model.data[this.model.data.length - 1]
      if (value.Movement === undefined) {
        value = true
      } else {
        value = !value.Movement.pir
      }

      this.registerMovement(value)
    }, 2000)
  }
}
