$(document).ready(() => {
  //Connect to the socket.io server
  const socket = io.connect()

  $('#createUserBtn').click((e) => {
    e.preventDefault()
    let username = $('#usernameInput').val()
    if (username.length > 0) {
      //We're using a SOCKET EVENT in lieu of an HTTP request to send the new username to the server
      //Emit to the server the new user!
      //"new user" is what's known as a NEW EVENT
      socket.emit('new user', username)
      $('.usernameForm').remove()
    }
  })

  //this sets up client to listen for any "new user" events coming from the server
  //i.e. socket listeners
  socket.on('new user', (username) => {
    console.log(`💙${username} has joined the chat!💙`)
  })
})