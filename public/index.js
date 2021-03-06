$(document).ready(() => {
  const socket = io.connect() //connect to the socket.io server
  let currentUser //keep track of current user
  socket.emit('get online users') //get the online users from the server
  socket.emit('user changed channel', "General") //each user should default to General

  $(document).on('click', '.channel', (e) => {
    let newChannel = e.target.textContent
    socket.emit('user changed channel', newChannel)
  })

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
    let channel = $('.channel-current').text() //Gets the client's channel
    let message = $('#chatInput').val() //Gets the msg txt value
    if(message.length > 0){ //Makes sure the msg isn't empty
      socket.emit('new message', { //Emits the msg w/ current user to the server
        sender : currentUser,
        message : message,
        channel : channel //Sends the channel to the server
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

  //output the new message IFF user is currently in that channel
  socket.on('new message', (data) => {
    let currentChannel = $('.channel-current').text()
    if(currentChannel == data.channel){
      $('.messageContainer').append(`
        <div class='message'>
          <p class='messageUser'>${data.sender}: </p>
          <p class='messageText'>${data.message}</p>
      `)
    }
  })

  //show the users on the page
  socket.on('get online users', (onlineUsers) => {
    //The following for loop's syntax: for(key in obj)
    //Our usernames are keys in the object of onlineUsers
    for(username in onlineUsers){
      $('.usersOnline').append(`<div class='userOnline'>${username}</div>`)
    }
  })

  //refresh the online user list when a 'user has left'
  socket.on('user has left', (onlineUsers) => {
    $('.usersOnline').empty()
    for(username in onlineUsers){
      $('.usersOnline').append(`<p>${username}</p>`)
    }
  })

  $('#newChannelBtn').click( () => {
    let newChannel = $('#newChannelInput').val()

    if(newChannel.length > 0){
      //Emit the new channel to the server
      socket.emit('new channel', newChannel)
      $('#newChannelInput').val("")
    }
  })

  // Add the new channel to the channels list (Fires for all clients)
  socket.on('new channel', (newChannel) => {
    $('.channels').append(`<div class="channel">${newChannel}</div>`);
  });

  //Make the channel joined the current channel. Then load the messages.
  //This only fires for the client who made the channel.
  socket.on('user changed channel', (data) => {
    $('.channel-current').addClass('channel')
    $('.channel-current').removeClass('channel-current')
    $(`.channel:contains('${data.channel}')`).addClass('channel-current')
    $('.channel-current').removeClass('channel')
    $('.message').remove()
    data.messages.forEach((message) => {
      $('.messageContainer').append(`
      <div class="message">
        <p class="messageUser">${message.sender}: </p>
        <p class="messageText">${message.message}</p>
      </div>
    `)
    })
  })

})