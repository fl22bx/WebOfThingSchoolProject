var observe = require('observe')

const resource = require('./WotModel.json')
const pirObservable = observe(resource.properties.resources['pir'].data)
const ledObservable = observe(resource.properties.resources['led'].data)
module.exports = {
  resource: resource,
  pirObservable: pirObservable,
  ledObservable: ledObservable

}
