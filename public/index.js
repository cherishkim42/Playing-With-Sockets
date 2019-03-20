$(document).ready(() => {
  //Connect to the socket.io server
  const socket = io.connect()

  //Keep track of current user
  let currentUser;

  $('#createUserBtn').click((e) => {
    e.preventDefault()
    if ($('#usernameInput').val().length > 0) {
      //We're using a SOCKET EVENT in lieu of an HTTP request to send the new username to the server
      //Emit to the server the new user!
      //"new user" is what's known as a NEW EVENT
      socket.emit('new user', $('#usernameInput').val())
      //Save the current user when created
      currentUser = $('#usernameInput').val();
      $('.usernameForm').remove()
      //Make main page visible by updating display of .mainContainer from none to flex
      $('.mainContainer').css('display', 'flex')
    }
  })

  //We need this button to emit a NEW MESSAGE event to the server and have the server emit a NEW MESSAGE event to all connected clients
  $('#sendChatBtn').click((e) => {
    e.preventDefault()
    //Get the msg txt value
    let message = $('#chatInput').val()
    //Make sure it's not empty
    if(message.length > 0){
      //Emit the msg with the current user to the server
      socket.emit('new message', {
        sender : currentUser,
        message : message,
      })
      $('#chatInput').val("")
    }
  })

  //this sets up client to listen for any "new user" events coming from the server
  //i.e. socket listeners
  socket.on('new user', (username) => {
    console.log(`💙${username} has joined the chat!💙`)
    //note the use of append!
    $('.usersOnline').append(`<div class='userOnline'>${username}</div>`)
  })

  //output the new message
  socket.on('new message', (data) => {
    $('.messageContainer').append(`
      <div class='message'>
        <p class='messageUser'>${data.sender}: </p>
        <p class='messageText'>${data.message}</p>
    `)
  })

})