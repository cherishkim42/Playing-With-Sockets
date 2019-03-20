module.exports = (io, socket) => {

  //This bad boy (slaps) listens sooooo hard for an event called 'new user'. He is a MATCHING SOCKET LISTENER!
  //Listen for 'new user' socket emits
  socket.on('new user', (username) => {
    console.log(`❤️${username} has joined the chat❤️`)
    //Emits username to all clients on connection because io.emit, as opposed to socket.emit, which emits only to the client that sent the 'new user'
    io.emit('new user', username)
  })

  socket.on('new message', (data) => {
    //Send that data back to all clients
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
    io.emit('new message', data)
  })
}