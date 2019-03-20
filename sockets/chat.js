module.exports = (io, socket, onlineUsers, channels) => {

  //This bad boy (slaps) listens sooooo hard for an event called 'new user'. He is a MATCHING SOCKET LISTENER!
  //Listen for 'new user' socket emits
  socket.on('new user', (username) => {
    //Save the username as key to access the user's socket ID
    onlineUsers[username] = socket.id
    //Save the username to socket as well
    socket['username'] = username
    console.log(`❤️${username} has joined the chat❤️`)
    //Emits username to all clients on connection because io.emit, as opposed to socket.emit, which emits only to the client that sent the 'new user'
    io.emit('new user', username)
  })

  socket.on('new message', (data) => {
    //Send that data back to all clients
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
    io.emit('new message', data)
  })

  socket.on('get online users', () => {
    //Send over the onlineUsers
    socket.emit('get online users', onlineUsers)
  })

  //Fires when a user closes out
  socket.on('disconnect', () => {
    //This deletes the user by using the username we saved to the socket
    delete onlineUsers[socket.username]
    io.emit('user has left', onlineUsers)
  })

  socket.on('new channel', (newChannel) => {
    //Save the new channel to our channels object. The array will hold the msgs
    channels[newChannel] = []
    //Have the socket join the new channel room
    socket.join(newChannel)
    //Inform all clients of the new channel
    io.emit('new channel', newChannel)
    //To the client that made the new channel, emit to signal that they should change their channel to the one they made
    socket.emit('user changed channel', {
      channel : newChannel,
      messages : channels[newChannel]
    })
  })
}