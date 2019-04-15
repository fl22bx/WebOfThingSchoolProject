import io from 'socket.io-client'
import $ from 'jquery'
/**
 * Socket.io handler
 *
 * @param {*} token
 */
function socket (token) {
  var socket = io.connect('http://172.20.10.8:3000', { query: 'token=' + token })

  socket.on('alert', function (data) {
    let input
    if (data.Status) {
      input = `
      <div>
      <h3>Security Event</h3>
      <p>${data.Status.StatusChangerUnit} ${data.Status.Status === 'true' ? 'Started' : 'Stopped'} Alarm</p>
      <p>${new Date(data.Status.timestamp)}</p>
      </div>
    `
    } else if (data.Movement) {
      if (data.Movement.pir === 'true') {

      }
      input = `
      <div>
      <h3>Security Event</h3>
      <p>${data.Movement.pir ? 'Alert Movement Detected' : 'Movement Stoped'} </p>
      <p>${new Date(data.Movement.timestamp)}</p>
      </div>
    `
    }

    $('.wotEvents').prepend(input)
  })
}

export { socket }
