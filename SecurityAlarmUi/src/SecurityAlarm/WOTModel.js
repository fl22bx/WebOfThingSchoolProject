import $ from 'jquery'
import axios from 'axios'
import { socket } from '../socket.io'

/**
 * Autogenerated Ui from wot model
 *
 * @export
 * @class SecurityAlarmUI
 */
export default class SecurityAlarmUI {
  constructor (URI) {
    this.uri = URI
    this.model = null
    this.token = null
  }

  render () {
    if (this.token !== null) {
      var headers = {
        withCredentials: true,
        headers: { 'Authorization': 'Bearer ' + this.token }
      }

      axios.get(this.uri, headers)
        .then((response) => {
          this.model = response.data

          this.renderModel()
          this.renderProperties()
          this.renderEvents()
          this.onSubmitt()
          socket(this.token)
        })
    } else {
      this.rendetAuth()
      this.onSubmitt()
    }
  }

  renderModel () {
    $('.wotName').text(this.model.name)
  }

  renderProperties () {
    $('.wotActions').html('')
    for (var key in this.model.actions.resources) {
      let input = ''
      if (this.model.actions.resources[key].requiresAuthentication === 'true') {
        for (var Valuekey in this.model.actions.resources[key].values) {
          let value = this.model.actions.resources[key].values[Valuekey]
          if (value.type === 'boolean') {
            input += `
                <label for=${Valuekey}>${Valuekey}</label>
                  <select id=${Valuekey} name=${Valuekey}>
                      <option value=true>true</option>
                      <option value=false>false</option>
                  </select>
                  `
          } else if (value.type === 'string') {
            input += `
                <label for=${Valuekey}>${Valuekey}</label>
                <input id=${Valuekey} type="text" name=${Valuekey}>
                `
          }
        }

        let actionUri = `${this.model.id}${this.model.actions.link}/${[key]}`

        $('.wotActions').append(`
        <div>
        <h3>${key}</h3>
        <p>Description : ${this.model.actions.resources[key].description}</p>
        <form action=${actionUri} class="form" id=${key}>
        ${input}
        <button>Send</button>
        </form>
    </div>
        `)
      }
    }
  }

  onSubmitt () {
    let self = this
    $('.form').submit(function (event) {
      event.preventDefault()
      let tmp = {}
      $(this).serializeArray().forEach(obj => {
        tmp[obj.name] = obj.value
      })
      event.target.id === 'Authenticate' ? self.getToken(event.currentTarget.action, tmp) : self.submitAction(event.currentTarget.action, tmp)
    })
  }

  rendetAuth () {
    let input = `
    <label for='username'>username</label>
    <input id='username' type="text" name='username'>
    <label for='password'>password</label>
    <input id='password' type="text" name='password'>
    `
    $('.wotActions').html(`
      <div>
      <h3>Security</h3>
      <form action="http://172.20.10.8:3000/pi/actions/Authenticate" class="form" id='Authenticate'>
      ${input}
      <button>Send</button>
      </form>
      </div>
    `)
  }

  getToken (uri, data) {
    axios.post(uri, data)
      .then((response) => {
        this.token = response.data
        this.render()
      })
  }

  submitAction (uri, data) {
    var headers = {
      withCredentials: true,
      headers: { 'Authorization': 'Bearer ' + this.token }
    }

    axios.post(uri, data, headers)
      .then((response) => {
        $('.flash').text('Command Sent')
      })
  }

  renderEvents () {
    for (var i = this.model.properties.resources.pir.data.length - 1; i >= 0; --i) {
      let input
      if (this.model.properties.resources.pir.data[i].Status) {
        input = `
        <div>
        <h3>Security Event</h3>
        <p>${this.model.properties.resources.pir.data[i].Status.StatusChangerUnit} ${this.model.properties.resources.pir.data[i].Status.Status === 'true' ? 'Started' : 'Stopped'} Alarm</p>
        <p>${new Date(this.model.properties.resources.pir.data[i].Status.timestamp)}</p>
        </div>
      `
      } else if (this.model.properties.resources.pir.data[i].Movement) {
        if (this.model.properties.resources.pir.data[i].Movement.pir === 'true') {

        }
        input = `
        <div>
        <h3>Security Event</h3>
        <p>${this.model.properties.resources.pir.data[i].Movement.pir ? 'Alert Movement Detected' : 'Movement Stoped'} </p>
        <p>${new Date(this.model.properties.resources.pir.data[i].Movement.timestamp)}</p>
        </div>
      `
      }

      $('.wotEvents').append(input)
    }
  }
}
