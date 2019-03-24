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
    channels[data.channel].push({sender : data.sender, message : data.message}) //Saves new msg to the channel
    io.to(data.channel).emit('new message', data)
    console.log(`🎤 In ${data.channel}, ${data.sender} said: ${data.message} 🎤`)
    // io.emit('new message', data) //Broadcast to all clients on all channels
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

  //Registers event of a new channel being made
  socket.on('new channel', (newChannel) => {
    channels[newChannel] = [] //Save newChannel to channels object. The array holds msgs
    socket.join(newChannel) //Socket joins the newChannel room
    //Inform all clients of the new channel
    io.emit('new channel', newChannel) //Notify all clients of newChannel
    socket.emit('user changed channel', { //Notify client who made newChannel to change channels to the one they made
      channel : newChannel,
      messages : channels[newChannel]
    })
  })

  //Have the socket join the room of the channel
  socket.on('user changed channel', (newChannel) => {
    socket.join(newChannel)
    socket.emit('user changed channel', {
      channel : newChannel,
      messages : channels[newChannel]
    })
  })

}