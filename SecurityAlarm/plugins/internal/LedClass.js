
const resources = require('../../WotModel/Model').resource
const obs = require('../../WotModel/Model').ledObservable

/**
 * Led Hardware
 */
module.exports = class LedPlugin {
  constructor (value = false) {
    this.interval = null
    this.led = null
    this.model = resources.properties.resources['led']
    this.actions = ['ledState']
    this.simulate = value
  }
  stop () {
    if (this.simulate) {
      clearInterval(this.interval)
    } else {
      // this.led.writeSync(0)
      this.led.unexport()
      process.exit()
    }
  }

  observe () {
    obs.on('change', (change) => {
      this.led.writeSync(this.model.data[change.index].red === 'true' ? 1 : 0)
    })
  }

  LedSwitch (value) {
    obs.push(this.createValue(value))
  }

  createValue (data) {
    return { 'red': data, 'timestamp': Date.now() }
  }

  connectHardware () {
    let Gpio = require('onoff').Gpio
    this.led = new Gpio(this.model.values['led'].customFields.Gpio, 'out')
    process.on('SIGINT', this.stop.bind(this))

    this.observe()
  }

  // -------------------------------------------

  start () {
    if (this.simulate) {
      this.simulateLed()
    } else {
      this.connectHardware()
    }
  }

  simulateLed () {
    this.interval = setInterval(() => {
      this.LedSwitch()
    }, 4000)
  }
}
