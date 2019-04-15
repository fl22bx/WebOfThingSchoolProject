
const resource = require('../WotModel/Model').resource
const Led = require('../plugins/internal/LedClass')
const Pir = require('../plugins/internal/pirClass')

/**
 *Security alarm controlls
 *
 * @class SecurityAlarm
 */
class SecurityAlarm {
  constructor (SimulateValue) {
    this.pirModel = resource.properties.resources['pir']
    this.ledModel = resource.properties.resources['led']

    this.led = new Led(SimulateValue)
    this.pir = new Pir(SimulateValue)
    this.led.start()
  }

  alarmState (stateValue, user) {
    this.led.LedSwitch(stateValue)
    this.pir.PirStatus(stateValue, user)
  }
}

const instance = new SecurityAlarm(false)
Object.freeze(instance)
module.exports = instance
